export function toTree<T extends Record<string, any>>(data: T[] = []) {
  const treeMap: { [key: number | string]: T } = {} // 哈希表用于快速查找节点
  const tree: T[] = []

  // 将数据存入哈希表
  data.forEach((node) => {
    treeMap[node.id] = { ...node, children: [] }
  })

  // 构建树形结构
  data.forEach((node) => {
    if (node.parentId !== null && treeMap[node.parentId]) {
      treeMap[node.parentId].children.push(treeMap[node.id])
    } else {
      tree.push(treeMap[node.id]) // 根节点没有父节点，直接加入树
    }
  })
  return tree
}
