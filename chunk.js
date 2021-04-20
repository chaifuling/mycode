function chunk(arr, number) {

    var list = arr.slice(0, number)
    var list2 = arr.slice(number,)
    if (list.length == 0) {
        return [list]
    }
    return [list, list2].filter(item => item.length !== 0)
}

/**
 * @param input
 * @param size
 * @returns {Array}
 */
 _.chunk(['a', 'b', 'c', 'd'], 2)
 // => [['a', 'b'], ['c', 'd']]
 
 _.chunk(['a', 'b', 'c', 'd'], 3)
 // => [['a', 'b', 'c'], ['d']]
 
 _.chunk(['a', 'b', 'c', 'd'], 5)
 // => [['a', 'b', 'c', 'd']]
 
 _.chunk(['a', 'b', 'c', 'd'], 0)
 // => []