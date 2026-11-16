export function deepClone(obj: any):any {
  if (obj === null || typeof obj !== 'object') {
    return obj // 如果是基本数据类型或null，则直接返回
  }

  if (Array.isArray(obj)) {
    const newArray = []
    for (let i = 0; i < obj.length; i++) {
      newArray[i] = deepClone(obj[i]) // 递归克隆数组的每个元素
    }
    return newArray
  }

  const newObj = Object.create(null)
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = deepClone(obj[key]) // 递归克隆对象的每个属性
    }
  }

  return newObj
}
