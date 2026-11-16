import type { Plugin, ResolvedConfig } from 'vite'
import { glob } from 'glob'
import path from 'pathe'
import fs from 'fs-extra'
import history from 'connect-history-api-fallback'
export function vitePagePlugin(): Plugin {
  const options = {
    dir: 'apps',
    default: '',
  }
  let config: ResolvedConfig
  const root = process.cwd()
  const pages = new Map()
  let isBuild = false
  const getApps = async () => {
    const cwd = path.join(config?.root || root, options.dir)
    const dirs = await glob(`**/**/index.html`, {
      ignore: ['node_modules'],
      cwd,
    })
    const input = {}
    dirs.forEach((item) => {
      const entry = path.resolve(cwd, item)
      const [name] = item.split('\\')
      const source = path.join(options.dir, item)
      pages.set(name, { entry, source })
      if (!isBuild) {
        input[name] = entry
      }
    })
    if (!options.default) {
      options.default = pages.keys().next().value
    }
    const defaultPage = pages.get(options.default)
    pages.set('index', defaultPage)
    input['index'] = defaultPage.source
    return input
  }
  const getrewrites = (input = {}) => {
    const list = []
    Object.keys(input).forEach((item) => {
      const { source } = pages.get(item)
      if (item === 'index') {
        list.push({
          from: '/',
          to: `/${source}`,
        })
      } else {
        list.push({
          from: new RegExp(`^\/${item}$`),
          to: `/${source}`,
        })
      }
    })
    return list
  }
  const isEagerChunk = (id: string) => {
    if (id.includes('node_modules') && !/\.css($|\\?)/.test(id)) return true
    return false
  }
  return {
    name: 'vite:page',
    enforce: 'pre',
    async config(config, { command }) {
      isBuild = command === 'build'
      const entry = await getApps()
      config.build = config.build || {}
      config.build.rollupOptions = config.build.rollupOptions || {}
      config.build.rollupOptions.input = entry
      config.build.rollupOptions.output = {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        manualChunks(id, { getModuleInfo }) {
          if (isEagerChunk(id) && /@vue\/(runtime|shared|reactivity)/.test(id)) {
            return 'framework'
          }
          if (isEagerChunk(id) && /vue-router/.test(id)) {
            return 'framework'
          }
        },
      }
      config.resolve = config.resolve || {}
      config.resolve.alias = config.resolve.alias || {}
      config.resolve.alias = {
        '@': path.resolve(root, 'src'),
      }
    },
    configResolved(Resolved) {
      config = Resolved
    },
    configureServer({ middlewares: app, config }) {
      app.use(
        history({
          verbose: Boolean(process.env.DEBUG) && process.env.DEBUG !== 'false',
          disableDotRule: undefined,
          htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
          rewrites: getrewrites(config.build.rollupOptions.input),
        }),
      )
    },
    async closeBundle() {
      const dest = (config.build && config.build.outDir) || 'dist'
      const resolve = (p: string) => path.resolve(root, p)
      await fs.copyFile(
        resolve(`${dest}/${options.dir}/${options.default}/index.html`),
        resolve(`${dest}/index.html`),
      )
      await fs.remove(resolve(`${dest}/${options.dir}`))
    },
  }
}
