export type ReviewStatus = 'confirmed' | 'pending'

export interface FieldItem {
  part: string
  field: string
  label: string
  meaning: string
  note: string
}

export interface PageDoc {
  no: number
  title: string
  route: string
  group: string
  status: ReviewStatus
  retired: boolean
  statusRaw: string
  fields: FieldItem[]
  enums: string[]
  lead: string[]
  understoodCount: number
}

const LABEL_HEADERS = ['列标题', '列名', '页面文案', '原标题', '标题', '名称', '提示']
const MEANING_HEADERS = ['当前理解', '理解', '说明', '含义', '当前处理', '对应字段']
const FIELD_HEADERS = new Set(['字段', '参数', 'bankCode', '路由'])

function clean(text: string): string {
  return text.replace(/`/g, '').replace(/\s+/g, ' ').trim()
}

function splitRow(line: string): string[] {
  const trimmed = line.trim()
  if (!trimmed.startsWith('|')) return []
  const cells = trimmed.split('|').map((cell) => clean(cell))
  if (cells[0] === '') cells.shift()
  if (cells[cells.length - 1] === '') cells.pop()
  return cells
}

function isSeparator(cells: string[]): boolean {
  return cells.length > 0 && cells.every((cell) => /^:?-+:?$/.test(cell))
}

function inferGroup(no: number, body: string): string {
  const line = body.split('\n').find((item) => /^- 栏目[:：]/.test(item.trim()))
  if (line) return line.replace(/^- 栏目[:：]/, '').trim()
  if (no <= 16) return '会员管理'
  if (no <= 22) return 'APP管理'
  if (no <= 47) return 'KYC管理'
  if (no === 48) return 'BI看板'
  return '其他'
}

function extractRoute(body: string): string {
  const line = body.split('\n').find((item) => item.includes('路由：') || item.includes('路由:'))
  if (!line) return '无独立菜单'
  const paths = [...line.matchAll(/`(\/[^`]+)`/g)]
    .map((item) => item[1])
    .filter((path) => !path.startsWith('/ar-'))
  if (paths.length) return paths.join('、')
  const plain = line.match(/(\/[A-Za-z][^\s`，,）)]*)/)
  if (plain && !plain[1].startsWith('/ar-')) return plain[1]
  return '无独立菜单'
}

function parseColumnLine(line: string): FieldItem[] {
  const body = line.replace(/^列[:：]/, '').replace(/。.*$/, '')
  const parts: string[] = []
  let buffer = ''
  let depth = 0
  for (const char of body) {
    if (char === '（' || char === '(') depth += 1
    if ((char === '）' || char === ')') && depth > 0) depth -= 1
    if (char === '、' && depth === 0) {
      if (buffer.trim()) parts.push(buffer.trim())
      buffer = ''
      continue
    }
    buffer += char
  }
  if (buffer.trim()) parts.push(buffer.trim())
  return parts.filter(Boolean).map((item) => {
    const matched = item.match(/^(.+?)（(.+)）$/)
    if (!matched) {
      return { part: '正文列', field: '', label: clean(item), meaning: '', note: '' }
    }
    const label = clean(matched[1])
    const inner = matched[2].trim()
    const alias = inner.match(/字段\s*`([A-Za-z_][A-Za-z0-9_]*)`/)
    if (alias && clean(inner.replace(/字段\s*`[^`]+`/, '')) === '') {
      return { part: '正文列', field: alias[1], label, meaning: '', note: '' }
    }
    const fieldMatch = inner.match(/^`([A-Za-z_][A-Za-z0-9_]*)`/)
    const field = fieldMatch ? fieldMatch[1] : ''
    const meaning = clean(field ? inner.replace(/^`[^`]+`[，,]?\s*/, '') : inner)
    return { part: '正文列', field, label, meaning, note: '' }
  })
}

function consumeTable(lines: string[], index: number, part: string): { fields: FieldItem[]; next: number } | null {
  const headers = splitRow(lines[index] || '')
  if (!headers.length || isSeparator(headers) || !FIELD_HEADERS.has(headers[0])) return null
  const separator = splitRow(lines[index + 1] || '')
  if (!isSeparator(separator)) return null
  const labelIndex = headers.findIndex((header) => LABEL_HEADERS.includes(header))
  const meaningIndex = headers.findIndex((header) => MEANING_HEADERS.includes(header))
  const noteIndex = headers.findIndex((header) => header === '备注')
  const fields: FieldItem[] = []
  let cursor = index + 2
  while (cursor < lines.length && lines[cursor].trim().startsWith('|')) {
    const cells = splitRow(lines[cursor])
    if (!isSeparator(cells) && cells.some(Boolean)) {
      const field = cells[0] || ''
      const label = labelIndex >= 0 ? cells[labelIndex] || '' : ''
      let meaning = meaningIndex >= 0 ? cells[meaningIndex] || '' : ''
      const note = noteIndex >= 0 ? cells[noteIndex] || '' : ''
      if (!meaning && meaningIndex < 0) {
        meaning = cells
          .map((cell, cellIndex) => ({ cell, cellIndex }))
          .filter(({ cellIndex: current, cell: value }) => current !== 0 && current !== labelIndex && current !== noteIndex && value)
          .map(({ cell, cellIndex: current }) => `${headers[current]}：${cell}`)
          .join('；')
      }
      if (!meaning && headers[0] === '路由') meaning = '原型不接线上报表，页面保持空状态'
      fields.push({ part: headers[0] === '路由' ? '看板路由' : part, field, label, meaning, note })
    }
    cursor += 1
  }
  return { fields, next: cursor }
}

function parseSection(heading: string, body: string): PageDoc | null {
  const matched = heading.match(/^(\d+)\.\s+(.+)$/)
  if (!matched) return null
  const no = Number(matched[1])
  const title = matched[2].replace(/\s+[A-Za-z][A-Za-z0-9]*-[A-Za-z0-9-]*$/, '').trim()
  const lines = body.split('\n')
  const statusLine = lines.find((line) => /^状态[:：]/.test(line.trim())) || ''
  const statusRaw = statusLine.replace(/^状态[:：]/, '').trim()
  const fields: FieldItem[] = []
  const enums: string[] = []
  const lead: string[] = []
  let part = '列表字段'
  let inFence = false
  let inEnum = false
  let index = 0
  while (index < lines.length) {
    const line = lines[index].trim()
    if (line.startsWith('```')) {
      inFence = !inFence
      index += 1
      continue
    }
    if (inFence) {
      index += 1
      continue
    }
    if (line.startsWith('### ')) {
      part = line.slice(4).trim()
      inEnum = false
      index += 1
      continue
    }
    if (line.startsWith('同页读到的枚举')) {
      inEnum = true
      index += 1
      continue
    }
    if (inEnum) {
      if (line.startsWith('- ')) {
        enums.push(clean(line.slice(2)))
        index += 1
        continue
      }
      if (!line) {
        index += 1
        continue
      }
      inEnum = false
    }
    if (line.startsWith('|')) {
      const table = consumeTable(lines, index, part)
      if (table) {
        fields.push(...table.fields)
        index = table.next
        continue
      }
    }
    const columns = readColumnSentence(line)
    if (columns) {
      fields.push(...columns.fields)
      if (columns.tail) lead.push(columns.tail)
    } else if (/^`[A-Za-z_][A-Za-z0-9_]*`[:：]/.test(line)) {
      enums.push(clean(line))
    }
    index += 1
  }
  let route = extractRoute(body)
  if (route === '无独立菜单') {
    const routes = fields.filter((item) => item.part === '看板路由').map((item) => item.field)
    if (routes.length > 1) route = `${routes.length} 个看板路由`
    else if (routes.length === 1) route = routes[0]
  }
  return {
    no,
    title,
    route,
    group: inferGroup(no, body),
    status: statusRaw.includes('已确认') ? 'confirmed' : 'pending',
    retired: statusRaw.includes('弃用'),
    statusRaw,
    fields,
    enums,
    lead,
    understoodCount: fields.filter((item) => item.meaning.trim()).length,
  }
}

function readColumnSentence(line: string): { fields: FieldItem[]; tail: string } | null {
  const text = line.replace(/^- /, '').trim()
  const single = text.match(/只展示一列\s*([^。，]+)/)
  if (single) {
    return {
      fields: [{ part: '列表字段', field: '', label: clean(single[1]), meaning: '', note: '' }],
      tail: '',
    }
  }
  const matched = text.match(/^(.*?列(?:和[^：]{0,30}|在[^：]{0,30})?)[:：]\s*(.+)$/)
  if (!matched) return null
  const right = matched[2]
  if (!right.includes('、') || right.includes('POST ') || right.includes('http')) return null
  const [listPart, ...tailParts] = right.split('。')
  const fields = parseColumnLine(`列：${listPart}`).map((item) => ({
    ...item,
    part: columnPart(matched[1]),
  }))
  if (!fields.length) return null
  const tail = clean(tailParts.join('。'))
  return { fields, tail: tail && !/^\d+\s*条[。.]?$/.test(tail) ? tail : '' }
}

function columnPart(left: string): string {
  const text = clean(left)
  const columnAt = text.lastIndexOf('列')
  const sentenceAt = text.lastIndexOf('。', columnAt)
  const clipped = (sentenceAt >= 0 ? text.slice(sentenceAt + 1) : text).trim()
  if (!clipped || clipped === '列') return '正文列'
  return clipped
}

function omittedTokens(body: string): string[] {
  const tokens: string[] = []
  for (const match of body.matchAll(/少了([^。；\n]+)/g)) {
    match[1].split('多了')[0].split(/[、，]/).forEach((part) => {
      const text = clean(part).replace(/以及.*/, '').trim()
      if (text && text.length <= 24) tokens.push(text)
    })
  }
  return tokens
}

function labelHits(label: string, token: string): boolean {
  if (!label || !token) return false
  const left = label.replace(/[（(].*$/, '').replace(/是否/g, '')
  const right = token.replace(/标记/g, '').replace(/是否/g, '')
  if (left.length < 2 || right.length < 2) return false
  if (right.startsWith('写错') && left.includes('写错')) return true
  return left.includes(right)
}

function inheritLine(line: string): boolean {
  const text = line.replace(/^- /, '').trim()
  if (/使用同一个页面组件/.test(text) && /同一套/.test(text)) return true
  if (/列比\s*§\d+\s*少了/.test(text)) return true
  return /列和|的列和|列在|其余列/.test(text) && /同一套|相同|的基础上/.test(text)
}

function copyFields(target: PageDoc, source: PageDoc | undefined, part: string, skip: string[]) {
  if (!source) return
  const seen = new Set(target.fields.map((item) => `${item.part}|${item.field}|${item.label}`))
  source.fields.forEach((item) => {
    if (skip.some((token) => labelHits(item.label, token) || labelHits(item.field, token))) return
    const basePart = item.part === '列表字段' || item.part === '正文列' ? part : `${part} · ${item.part}`
    const key = `${basePart}|${item.field}|${item.label}`
    if (seen.has(key)) return
    seen.add(key)
    target.fields.push({ ...item, part: basePart })
  })
  source.enums.forEach((item) => {
    if (!target.enums.includes(item)) target.enums.push(item)
  })
}

function inheritShared(pages: PageDoc[], bodies: Map<number, string>) {
  pages.forEach((page) => {
    const body = bodies.get(page.no) || ''
    const skip = omittedTokens(body)
    body.split('\n').forEach((raw) => {
      const line = raw.trim()
      if (!line || !inheritLine(line)) return
      const text = line.replace(/^- /, '')
      const sectionNos = [...text.matchAll(/§(\d+)/g)].map((item) => Number(item[1]))
      const routes = [...text.matchAll(/`(\/[^`]+)`/g)]
        .map((item) => item[1])
        .filter((path) => !path.startsWith('/ar-'))
      sectionNos.forEach((no) => {
        copyFields(page, pages.find((item) => item.no === no), `同 §${no}`, skip)
      })
      routes.forEach((route) => {
        const source = pages.find((item) => item.route === route && item.no !== page.no)
        const part = source && source.title === page.title ? `同 ${source.route}` : `同 ${source?.title || '同页'}`
        copyFields(page, source, part, skip)
      })
    })
  })
  pages.forEach((page) => {
    if (page.fields.length) return
    const body = bodies.get(page.no) || ''
    body.split('\n').forEach((raw) => {
      const line = raw.trim()
      if (!line || line === '---' || line.startsWith('|') || line.startsWith('#') || /^状态[:：]/.test(line)) return
      if (/^- (栏目|路由|代码|列表|标题|页面)/.test(line)) return
      const text = clean(line.replace(/^- /, ''))
      if (text && !page.lead.includes(text)) page.lead.push(text)
    })
  })
  pages.forEach((page) => {
    page.understoodCount = page.fields.filter((item) => item.meaning.trim()).length
  })
}

export function parseFieldNotes(markdown: string): PageDoc[] {
  const text = markdown.replace(/\r\n/g, '\n')
  const chunks = text.split(/\n(?=## )/)
  const pages: PageDoc[] = []
  const bodies = new Map<number, string>()
  for (const chunk of chunks) {
    const trimmed = chunk.trim()
    if (!trimmed.startsWith('## ')) continue
    const breakAt = trimmed.indexOf('\n')
    const heading = (breakAt === -1 ? trimmed : trimmed.slice(0, breakAt)).replace(/^## /, '')
    const body = breakAt === -1 ? '' : trimmed.slice(breakAt + 1)
    const page = parseSection(heading, body)
    if (!page) continue
    pages.push(page)
    bodies.set(page.no, body)
  }
  inheritShared(pages, bodies)
  return pages.sort((a, b) => a.no - b.no)
}
