function pathFinder(grid, position, length) {
    const { x, y } = position
    const path = {
        up: [],
        down: [],
        left: [],
        right: []
    }

    Object.entries(path).forEach(([direction, value]) => {
        let newY = y
        let newX = x
        // console.log('d',value)
        // console.log('entries : ',length)
        for (let i = 0; i < length; i++) {
            // console.log('for foreach : ', length)
            // console.log('i : ', i)
            // console.log('grid length', grid.length)
            // console.log('length ', length)
            switch (direction) {
                case 'up':
                    // console.log('b',newY)
                    --newY  
                    // console.log('a',newY)
                    if (newY >= 0 && newY < grid.length) {
                        if (grid[newY][x].blocked == false && grid[newY][x].item.length <= 0) {
                            value.push({ y: newY, x })
                            console.log('up', value)
                        } else {
                            return false;
                        }
                    }
                    break;
                case 'down':
                    ++newY
                    if (newY >= 0 && newY < grid.length) {
                       
                        if (grid[newY][x].blocked == false && grid[newY][x].item.length <= 0) {
                            
                            value.push({ y: newY, x })
                        }
                        else {
                            return false
                        }
                    }
                    break;
                
                case 'right':
                    ++newX
                    if (newX >= 0 && newX < grid.length) {
                        if (grid[y][newX].blocked == false && grid[y][newX].item.length <= 0) {
                            value.push({ y, x: newX })
                        } else {
                            return false
                        }
                    }
                    break;
                
                case 'left':
                    console.log('b', newX)
                    --newX
                    console.log('a', newX)

                    if (newX >= 0 && newX < grid.length) {  
                        if (grid[y][newX].blocked == false && grid[y][newX].item.length <=0) {
                            value.push({y, x: newX })
                        } else {
                            return false; 
                        }
                    }
                    break;
            }
        }
    })
    console.log(path)
    return path
}

const grid = [
    [
        {
            blocked: false,
            item: []
        },
        {
            blocked: false,
            item: [{
                id: 'weapon',
                name: 'weapon1',
                damage: 40,
                position: {
                    x: 1,
                    y: 0
                }
            }]
        },
        {
            blocked: true,
            item: [{
                id: 'block',
                name: 'block',
                position: {
                    x: [9, 6, 3, 2, 2, 5, 1, 4, 1, 6, 4, 2, 8, 5, 0, 3, 2, 7, 7, 6],
                    y: [4, 8, 6, 2, 5, 2, 8, 6, 1, 7, 1, 0, 0, 4, 3, 3, 4, 1, 8, 2]
                }
            }]
        }
    ],
    [
        {
            blocked: false,
            item: []
        },
        {
            blocked: true,
            item: [{
                id: 'block',
                name: 'block',
                position: {
                    x: [9, 6, 3, 2, 2, 5, 1, 4, 1, 6, 4, 2, 8, 5, 0, 3, 2, 7, 7, 6],
                    y: [4, 8, 6, 2, 5, 2, 8, 6, 1, 7, 1, 0, 0, 4, 3, 3, 4, 1, 8, 2]
                }
            }]
        },
        {
            blocked: true,
            item: [{
                id: 'player',
                name: 'player1',
                health: 100,
                rangeLimit : 3,
                position: {
                    y: 1,
                    x: 2
                },
                weapon: {
                    id: 'weapon',
                    name: 'hand',
                    damage: 10,
                    position: this.position
                }
            }]
        }
    ],
    [
        {
            blocked: true,
            item: [{
                id: 'player',
                name: 'player2',
                health: 100,
                rangeLimit: 3,
                position: {
                    y: 2,
                    x: 0
                },
                weapon: {
                    id: 'weapon',
                    name: 'hand',
                    damage: 10,
                    position: this.position
                }
            }]
        },
        {
            blocked: false,
            item: []
        },
        {
            blocked: false,
            item: []
        }
    ]
]


function findWithAttr(array, attr, value) {
    for (var y = 0; y < array.length; y++) {
        for (var x = 0; x < array[y].length; x++) {
            const item = array[y][x].item
            if ((item && item.length)) {
                
                const attribute = item[0][attr]
                console.log(attribute)
                if (attribute === value) {
                    console.log('found')
                    return { y, x };
                }
                console.log(item[0].attr === value)
            }
            // console.log(item)
 
        }
    }
    console.log('not found')
    return -1;
}

const position = findWithAttr(grid, 'name', 'player1')
// const position = {
//     y: 1,
//     x: 2
// }

// const position= grid.findIndex(item => )
console.table(grid)
const range = pathFinder(grid, position, 2)


function addClassName(coordinates, objClass) {
    if (coordinates.x >= 0 && coordinates.y >= 0) {
        var element = $('#col-'.concat(coordinates.y, coordinates.x));
        if (!element.hasClass(objClass)) {
            element.addClass(objClass);
            console.log(element)
        }
        console.log("okay")
    }
}

Object.entries(range).forEach(([direction, value]) => {

    switch (direction) {
        
        case 'up':
            if (value.length > 0) {
                
                // addClassName(value[index],'range2')
                // console.log(value)                    
            }
            break
        case 'down':
            if (value.length > 0) {
                for (let i = 0; i < value.length; i++) {
                    addClassName(value[i], 'range2')
                }        
                // addClassName(value, 'range2')
                // console.log('t',value)    
            }
            break
    }
})

// Object.entries(range).forEach(([direction, value]) => {
//     if (value.length > 0) {
//         console.log(value.length)
//         for (let i = 0; i < value.length; i++) {
//             switch (direction) {
//                 case 'up':
//                     addClassName(value[i], 'range2')
//                     break
//                 case 'down':
//                     addClassName(value[i], 'range2')
//                     break
//                 case 'right':
//                     addClassName(value[i], 'range2')
//                     break;
//                 case 'left':
//                     addClassName(value[i], 'range2')
//                     break;
//             }
//         }
//     }
// })