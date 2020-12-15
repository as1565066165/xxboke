/**
 * @param {Object} 原数据
 * @param {Object} mapping 映射表
 * @param {Boolean} removeOthers 是否删除映射表外的字段
 */
export function keysMapping (target = {}, mapping = {}, removeOthers = false) {
  if (Array.isArray(target)) {
    return target.map(item => keysMapping(item, mapping, removeOthers))
  }
  if (typeof target !== 'object' || target === null) return target
  const rst = {}
  const keys = Object.keys(target)
  keys.forEach(key => {
    // eslint-disable-next-line no-prototype-builtins
    if (!(target.hasOwnProperty(key))) return
    if (removeOthers && !(key in mapping)) return
    let item = target[key]
    if (item && typeof item === 'object') {
      item = keysMapping(item, mapping, removeOthers)
    }
    rst[mapping[key] || key] = item
  })
  return rst
}

export function keysMappingReverse (target, mapping, removeOthers = false) {
  const remapping = {}
  for (const key in mapping) {
    if (typeof mapping[key] !== 'string') continue
    remapping[mapping[key]] = key
  }
  console.log(remapping)
  return keysMapping(target, remapping, removeOthers)
}
