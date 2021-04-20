const dedup = (data, getKey = () => {}) => {
    const map = new Map()
    data.forEach((item) => {
      const key = getKey(item)
      if (!map.has(key)) {
        map.set(key, item)
      }
    })
    let result = []
    for (let [, item] of map.entries()) {
      result.push(item)
    }
    console.log(result)
    return result
  }
  
  let data = [
    { id: 1, v: 1 },
    { id: 2, v: 2 },
    { id: 1, v: 2 },
  ]
  
  dedup(data, (item) => item.id)
  
  let data1 = [
    { id: 1, v: 1, id1: 1 },
    { id: 2, v: 2, id1: 2 },
    { id: 1, v: 2, id1: 1 },
  ]
  
  dedup(data1, (item) => `${item.id}-${item.id1}`)