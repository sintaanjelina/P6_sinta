class Player{
    constructor(name) {
        this.id = 'player';
        this.name = name;
        this.health = 100
        this.rangeLimit=3
        this.position = {
            x: '',
            y: ''
        };
        this.weapon = {
            id: 'weapon',
            name: 'hand',
            damage: 10,
            position: this.position
        }
     
    }

}

class Weapon{
    constructor(name,damage) {
        this.id =  'weapon'
        this.name = name
        this.damage = damage
        this.position = {
            x: '',
            y: ''
        }
    }
}

class Block{
    constructor(name) {
        this.id = 'block'
        this.name = name
        this.position = {
            x: '',
            y: ''
        }
    }
    showPosition() {
        console.log(this.position)
        return this.position
    }
}

class Cell {
    constructor() {
        this.blocked = false;
        this.item = [];
    }
    findItem(name) {
        return this.item.find(element => element.name == name)
    }
}

class Game extends Cell {
    constructor(height, width) {
        super()
        this.grid = []
        this.height = height
        this.width = width
    }

    startGame(playerObject) {
        // $("div#map > div").removeClass('range2');
        if (playerObject.name === 'player1') {
            this.playerOnTurn = playerObject
            this.playerWaiting = 'player2'
        } else {
            this.playerOnTurn = playerObject
            this.playerWaiting = 'player1'
        }
        const path = this.pathFinder(playerObject.position, playerObject.rangeLimit)
        this.pathGenerator(path)
    }

    generateGrid() {
        for (let y = 0; y < this.height; y++) {
            this.grid.push([])
            for (let x = 0; x < this.width; x++) {
                this.grid[y].push(new Cell())
            }
        }
    }

    pathFinder(position, length) {
        const { x, y } = position
        this.path = {
            up: [],
            down: [],
            left: [],
            right: []
        }
 
        Object.entries(this.path).forEach(([direction, value]) => {
            let newY = y
            let newX = x
            for (let i = 0; i < length; i++) {

                console.log('test',this.grid.length)
                switch (direction) {
                    case 'up':
                        --newY
                        //if blocked true then return false to stop iterating over  that direction value array 
                        if (newY >= 0 && newY < this.grid.length && this.grid[newY][x].blocked == false) {
                            value.push({ y: newY, x: x })
                            console.log('up', value)
                        } else {
                            return false
                        }
                        break;
                    case 'down':
                        ++newY
                        if (newY >= 0 && newY < this.grid.length && this.grid[newY][x].blocked == false) {
                                value.push({ y: newY, x })
                        } else {
                            return false
                        }
                        break;

                    case 'right':
                        ++newX
                        if (newX >= 0 && newX < this.grid.length && this.grid[y][newX].blocked == false) {
                                value.push({ y, x: newX })
                        } else {
                            return false
                        }
                        break;

                    case 'left':
                        --newX
                        if (newX >= 0 && newX < this.grid.length && this.grid[y][newX].blocked == false) {
                                value.push({ y, x: newX })
                        } else {
                            return false
                        }
                        break;
                }
            }
        })
        console.log(this.path)
        return this.path
    }

    pathGenerator(range) {
        Object.entries(range).forEach(([direction, value]) => {
            console.log('vl', value.length)
            console.log('v', value)
            if (value.length >= 0) {
                for (let i = 0; i < value.length; i++) {
                    addClassName(value[i], 'range2')
                    
                    console.log('value range add', value[i])
                }
            }
        })
    }

    removeItem(y, x, item) {
        this.grid[y][x].blocked = false

        if (this.grid[y][x].item && this.grid[y][x].item.length) {
            if (this.grid[y][x].item[0].name == item.name) {
                this.grid[y][x].item.splice(0, 1)                
            }
        }
    }
    addItem(y, x, item) {
        if (item.id === 'weapon') {
            this.grid[y][x].blocked = false
        }
        else if(item.id === 'block' || item.id === 'player') {
            this.grid[y][x].blocked = true
        } else {
            
        }

        if (!(this.grid[y][x].item && this.grid[y][x].item.length)) {
            this.grid[y][x].item.push(item)

            item.position.y = y; 
            item.position.x = x;

            addClassName({y: y, x: x}, item.name)
            console.log('addItem grid', this.grid[y][x])
            console.log('addItem Block', this.grid[y][x].blocked)
            console.log('addItem', item)

            
            return true
        }
        return false
    }

    getRandomCell() {
        var randIntY = Math.floor(Math.random() * Math.floor(this.height));
        var randIntX = Math.floor(Math.random() * Math.floor(this.width));

        return ({ y: randIntY, x: randIntX })
    }

    createItem(itemObject, amount) {
        let numavailableCell = 0;
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                if (this.grid[y][x].item.length <= 0) {
                    numavailableCell++;
                }
            }
        }
        if (amount <= numavailableCell) {
            while (amount != 0) {
                var randIndex = this.getRandomCell()
                console.log('rand', randIndex)
                var addItemResult = this.addItem(randIndex.y, randIndex.x, itemObject)
                if ( addItemResult== true) {
                    amount--
                }
                else {
                    console.log('addItem',false)
                }
            }
        } else if (amount > numavailableCell) {
            // alert("All " + amount + " "+Objtype.name + " cannot be generated - no space left ")
            console.log(Error("All " + amount + itemObject.name + " cannot be generated - no space left " + "Amount item: " + amount + " is greater then numavailableCell: " + numavailableCell));
        }
    }
    createMaps() {
        const maps = document.getElementById('map')
        maps.classList.add('container', 'd-flex','flex-column')
        for (let y = 0; y < this.grid.length; y++) {
            const row = document.createElement('div')
            row.classList.add('row')
            for (let x = 0; x < this.grid[y].length; x++) {
                const column = document.createElement('div')
                column.classList.add('col' ,'p-3', 'border')
                column.id = 'col-' + y + x
                column.textContent = 'col-' + y + x
                row.appendChild(column)
            }
            maps.appendChild(row)
        }
    }


    findItems(Objtype) {
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                const item = this.grid[y][x].findItem(Objtype.name)
                // console.log('Not find', item)
                // console.log('weapon', y, x)
                if (item) {
                    console.log('find', item, item.position.y[0], item.position.x[0])
                    console.log('weapon',y, x)
                }
            }
        }
    }

}

let numberOfBlocks = 20;
const player1 = new Player('player1')
const player2 = new Player('player2')
const weapon1 = new Weapon('mushroom1', 50)
const weapon2 = new Weapon('mushroom2', 40)
const weapon3 = new Weapon('mushroom3', 30)
const weapon4 = new Weapon('mushroom4', 15)
const game = new Game(10, 10)

game.generateGrid()
console.table(game.grid)
game.createMaps()
// game.createItem(new Block('block'), numberOfBlocks)
game.createItem(player1, 1)
game.createItem(player2, 1)
game.createItem(weapon1, 1)
game.createItem(weapon2, 1)
game.createItem(weapon3, 1)
game.createItem(weapon4, 1)

while (numberOfBlocks != 0) {
    var randIndex = game.getRandomCell()
    console.log('rand', randIndex)
    var block = new Block('block')
    if (game.addItem(randIndex.y, randIndex.x, block) == true) {
        numberOfBlocks--
    }
}

game.startGame(player1)
var cell = $("div#map > div>div")

function addClassName(coordinates, objClass) {
        
        var element = $('#col-'.concat(coordinates.y, coordinates.x));
        if (!element.hasClass(objClass)) {
            element.addClass(objClass);
            console.log(element)
            const class1 = element.get(0).className
            const class2 = element.get(0).id    
            console.log("okay", class1, class2)
            return true;
        }
        // else if (element.hasClass(objClass)) {
            // element.addClass(objClass)
        //     // element.removeClass(objClass)
        //     const class1 = element.get(0).className
        //     const class2 = element.get(0).id
        //     console.log("not okay", class1, class2)
        // } else {
        //     console.log('why not okay?')
        // }
    
}

function removeClassName(coordinates, objClass) {
        var element = $('#col-'.concat(coordinates.y, coordinates.x));
        if (element.hasClass(objClass)) {
            element.removeClass(objClass);
            const class1 = element.get(0).className
            const class2 = element.get(0).id
            console.log("remove okay", class1, class2)
            return true
        }
};

// var element = $('#col-'+ coordinates.y +''+ coordinates.x);
// var element = $(`#col-${coordinates.y}${coordinates.x}`);

cell.on("click", function () {
    var classnya = $(this).attr("class")
    console.log('this', classnya ,$(this).hasClass('range2'))
    
    if (!$(this).hasClass('range2')) {
        return
    }

    const { x, y } = game.playerOnTurn.position
    let newX = x
    let newY = y
    
    const path = game.pathFinder(game.playerOnTurn.position, game.playerOnTurn.rangeLimit)
    console.log("path before", path)
    
    Object.entries(path).forEach(([direction, value]) => {
        if (value.length >= 0) {
            for (let i = 0; i < value.length; i++) {                  
                let possibleStepCol = 'col-'.concat(value[i].y, value[i].x)
                const cellElement = $(`#${possibleStepCol}`);

                cellElement.classList.remove('range2')
   
                game.removeItem(newY, newX, game.playerOnTurn)
                const prevCellElement = $(`#col-${newY}${newX}`)

                prevCellElement.classList.remove(game.playerOnTurn.name)

                let addItemResult = game.addItem(value[i].y, value[i].x, game.playerOnTurn)
                if (addItemResult == true) {
                    // addClassName(game.playerOnTurn.position.y, game.playerOnTurn.position.x, game.playerOnTurn.name)
                    console.log('add',addItemResult)

                    var pathUpdate = game.pathFinder(game.playerOnTurn.position, game.playerOnTurn.rangeLimit)

                    console.log('path after value[i] ', pathUpdate)
                    game.pathGenerator(pathUpdate)

                
                }

                Object.entries(pathUpdate).forEach(([updateDirection, updateValue]) => {
                    for (let j = 0; j < updateValue.length; j++) {
                        console.log('updateValue ', updateValue[j])
                        console.log('value', value[i])
                        console.log('value compare', updateValue[j].x == value[i].x && updateValue[j].y == value[i].y)

                        if (updateValue[j].x == value[i].x && updateValue[j].y == value[i].y) {
                            addClassName(value[j], 'range2')
                            console.log('value add class range2', value[j].y, value[j].x)
                        }
                        // else {
                        //     removeClassName(value[i], 'range2')
                        //     console.log('value remove class range2', value[j].y, value[j].x)
                        // }
                    }
                })

  
            }
        }
    })
})


             
 


//                 // // switch (direction) {
//                 // //     case 'up':
//                 // //         let possibleStepCol = 'col-'.concat(value[i].y, value[i].x)

//                 // //         if (this.id == possibleStepCol) {
//                 // //             if (game.addItem(value[i].y, value[i].x, game.playerOnTurn) === true) {
//                 // //                 // addClassName(game.playerOnTurn.position.y, game.playerOnTurn.position.x, game.playerOnTurn.name)
                                
//                 // //                 const pathUpdate = pathFinder(this.grid, game.playerOnTurn.position, game.playerOnTurn.rangeLimit)
//                 // //                 pathGenerator(pathUpdate)
//                 // //             }
//                 // //         }
//                 // //         break
//                 // //     case 'down':
//                 // //         // removeClassName(value[i], 'range2')
//                 // //         break
//                 // //     case 'right':
//                 // //         // removeClassName(value[i], 'range2')
//                 // //         break;
//                 // //     case 'left':
//                 // //         // removeClassName(value[i], 'range2')
//                 // //         break;
//                 // }


// //     for (var i = 0; i < game.possibleRangeMovements.length; i++) {
// //         possibleStepCol = 'col-'.concat(game.possibleRangeMovements[i][0], game.possibleRangeMovements[i][1])
// //         // console.log(possibleStepCol, this.id)
// //         if (this.id == possibleStepCol) {

            
// //             removeClassName([game.playerOnTurn.position.y[0], game.playerOnTurn.position.x[0]], game.playerOnTurn.name)

// //             let showDisplay = game.addItem(game.possibleRangeMovements[i][0], game.possibleRangeMovements[i][1], game.playerOnTurn)
// //             console.log(showDisplay)
// //             if (showDisplay !== false) {
// //                 addClassName([game.playerOnTurn.position.y[0], game.playerOnTurn.position.x[0]], game.playerOnTurn.name)  
// //                 game.rangemovements(game.playerOnTurn)
// //             }
        
// //         }

// //     }
// // })