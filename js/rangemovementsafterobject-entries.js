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
        return this.position
    }
}

class Cell{
    constructor() {
        this.blocked = false;
        this.item = [];
    }
    findItem(name) {
        return this.item.find(element => element.name == name)
    }
}


function distance(x1, y1, x2, y2) {
    // console.log('distance: ' ,Math.abs(x1 - x2) + Math.abs(y1 - y2))
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}


class Game extends Cell {
    constructor(height, width) {
        super()
        this.grid = []
        this.height = height
        this.width = width
    }

    startGame(playerObject) {
        $("div#map > div").removeClass('range2');
        if (playerObject.name === 'player1') {
            this.playerOnTurn = playerObject
            this.playerWaiting = 'player2'
        } else {
            this.playerOnTurn = playerObject
            this.playerWaiting = 'player1'
        }
        const path = this.pathFinder(this.grid, playerObject.position, playerObject.rangeLimit)
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

    pathFinder(grid, position, length) {
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
                            if (grid[newY][x].blocked == false) {
                                value.push({ y: newY, x: x })
                                console.log('up', value)
                            } else {
                                return false;
                            }
                        }
                        break;
                    case 'down':
                        ++newY
                        if (newY >= 0 && newY < grid.length) {

                            if (grid[newY][x].blocked == false ) {

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
                            if (grid[y][newX].blocked == false ) {
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
                            if (grid[y][newX].blocked == false) {
                                value.push({ y, x: newX })
                            } else {
                                return false;
                            }
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
            if (value.length > 0) {
                for (let i = 0; i < value.length; i++) {
                    switch (direction) {
                        case 'up':
                            addClassName(value[i], 'range2')
                            break
                        case 'down':
                            addClassName(value[i], 'range2')
                            break
                        case 'right':
                            addClassName(value[i], 'range2')
                            break;
                        case 'left':
                            addClassName(value[i], 'range2')
                            break;
                    }
                }
            }
        })
    }

    getRandomInt(max) {
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
        
        return Math.floor(Math.random() * Math.floor(max));
    }



    addItem(y, x, item) {
        if (item.id == 'block' || item.id == 'player') {
            this.grid[y][x].blocked = true
        } else if (item.id == 'weapon') {
            this.grid[y][x].blocked = false
        }

        if (!(this.grid[y][x].item && this.grid[y][x].item.length)) {
            this.grid[y][x].item.push(item)
            // item.position.y.splice(0, 1, y);
            // item.position.x.splice(0, 1, x);
            // item.position.y.push(y);
            // item.position.x.push(x);
            item.position.y= y; 
            item.position.x= x;
            console.log('add item')
            return true
        }
        return false
    }
    addItems(Objtype, amount) {
        let numavailableCell = 0;
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                if (this.grid[y][x].item.length <= 0) {
                    numavailableCell++;
                }
            }
        }   

        // console.log('nC', numavailableCell);
        if (amount <= numavailableCell) {
            while(amount!=0) {
                // console.log("amount-num", amount, numavailableCell);
                const randIntY = this.getRandomInt(this.grid.length);
                const randIntX = this.getRandomInt(this.grid[randIntY].length);
                if (!(this.grid[randIntY][randIntX].item && this.grid[randIntY][randIntX].item.length)) {
                    this.addItem(randIntY, randIntX, Objtype);
                    let ObjtypeBox = document.getElementById('col-' + randIntY + randIntX); 
                    // console.log(Objtype.id, Objtype.name)
                    ObjtypeBox.classList.add(Objtype.name);
                    // console.log("isi", randIntY, randIntX);
                    amount--;
                    //numavailableCell--;
                }
            }       
        } else if (amount > numavailableCell) {
            // alert("All " + amount + " "+Objtype.name + " cannot be generated - no space left ")
            console.log(Error("All " + amount + Objtype.name + " cannot be generated - no space left " + "Amount item: " + amount + " is greater then numavailableCell: " + numavailableCell));
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

const block = new Block('block')
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
game.addItems(player1, 1)
game.addItems(player2, 1)
game.addItems(block, 20)
game.addItems(weapon1, 1)
game.addItems(weapon2, 1)
game.addItems(weapon3, 1)
game.addItems(weapon4, 1)
game.startGame(player1)
game.findItems(weapon1)

let position = block.showPosition()
console.log(position)
console.log(game.playerOnTurn.name)
var cell = $("div#map > div>div")

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


function removeClassName (coordinates, objClass) {
    var element = $('#col-'.concat(coordinates[0], coordinates[1]));
    if (element.hasClass(objClass)) {
        element.removeClass(objClass);
    }
};

cell.on("click", function () {
    for (var i = 0; i < game.possibleRangeMovements.length; i++) {
        removeClassName([game.possibleRangeMovements[i][0], game.possibleRangeMovements[i][1]], 'range2')
    }

    for (var i = 0; i < game.possibleRangeMovements.length; i++) {
        possibleStepCol = 'col-'.concat(game.possibleRangeMovements[i][0], game.possibleRangeMovements[i][1])
        // console.log(possibleStepCol, this.id)
        if (this.id == possibleStepCol) {

            
            removeClassName([game.playerOnTurn.position.y[0], game.playerOnTurn.position.x[0]], game.playerOnTurn.name)

            let showDisplay = game.addItem(game.possibleRangeMovements[i][0], game.possibleRangeMovements[i][1], game.playerOnTurn)
            console.log(showDisplay)
            if (showDisplay !== false) {
                addClassName([game.playerOnTurn.position.y[0], game.playerOnTurn.position.x[0]], game.playerOnTurn.name)  
                game.rangemovements(game.playerOnTurn)
            }
        
        }

    }
})