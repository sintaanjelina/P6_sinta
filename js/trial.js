class Player{
    constructor(id, name) {
        this.id = id
        this.name = name
        this.type = 'player'
        this.health = 100
        this.rangeLimit=3
        this.position = {
            x: '',
            y: ''
        };
        this.weapon = {
            id: 'default',
            name: 'hand',
            type: 'weapon',
            damage: 10,
            position: this.position
        }
        this.previousWeapon = {
            // id: '',
            // name: '',
            // type: '',
            // damage: 0,
            // position: ''
        }
    }
}

class Weapon{
    constructor(id, name, damage) {
        this.id = id
        this.name = name
        this.type = 'weapon'
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
        this.type = 'block'
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
    findItemById(id) {
        return this.item.find(element => element.id == id)
    }
    findItemByType(type) {
        return this.item.find(element => element.type == type)        
    }
}

class Game extends Cell {
    constructor(height, width) {
        super()
        this.grid = []
        this.height = height
        this.width = width
        this.turn = 0;
    }

    startGame(playerObject) {
        $("div#map > div>div").removeClass('range2');
        if (playerObject.id === 'player1') {
            this.playerOnTurn = playerObject
            this.playerWaiting = 'player2'

        } else {
            this.playerOnTurn = playerObject
            this.playerWaiting = 'player1'
        }

        $(`#${this.playerOnTurn.id}InfoCard`).addClass('text-white bg-dark')
        $(`#activePlayerName`).text(`${this.playerOnTurn.name}`)
        $(`#${this.playerWaiting}InfoCard`).removeClass('text-white bg-dark')

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
        const path = {
            up: [],
            down: [],
            left: [],
            right: []
        }
 
        Object.entries(path).forEach(([direction, value]) => {
            let newY = y
            let newX = x
            let blocked = false
            for (let i = 0; i < length; i++) {
                
                console.log('test',this.grid.length)
                switch (direction) {
                    case 'up':
                        --newY
                        if (newY >= 0 && newY < this.grid.length && !blocked) {
                            const cellBlocked = this.grid[newY][x].blocked
                            if (!cellBlocked) {
                                value.push({ y: newY, x: x })
                            }
                            else {
                                blocked = true
                            }
                        }
                        break;
                    case 'down':
                        ++newY
                        if (newY >= 0 && newY < this.grid.length && !blocked) {
                            const cellBlocked = this.grid[newY][x].blocked
                            if (!cellBlocked) {
                                value.push({ y: newY, x }) 
                            } else {
                                blocked = true
                            }
                        }
                        break;

                    case 'right':
                        ++newX
                        if (newX >= 0 && newX < this.grid.length && !blocked) {
                            const cellBlocked = this.grid[y][newX].blocked
                            if (!cellBlocked) {
                                value.push({ y, x: newX })
                            } else {
                                blocked = true
                            }
                        }
                        break;

                    case 'left':
                        --newX
                        if (newX >= 0 && newX < this.grid.length && !blocked) {
                            const cellBlocked = this.grid[y][newX].blocked
                            if (!cellBlocked) {
                                value.push({ y, x: newX })
                            } else {
                                blocked= true
                            }
                        }
                        break;
                }
            }
        })
        console.log(path)
        return path
    }


    pathGenerator(newPath) {
        Object.values(newPath).forEach((positions) => {
            for (let i = 0; i < positions.length; i++) {
                // const { y, x } = positions[i]
                addClassName(positions[i], 'range2')
            }
        })
    }

    opponentFinder(playerPosition, fightingRange = 1) {
        const { x, y } = playerPosition
        const opponent = {
            up: [],
            down: [],
            left: [],
            right: []
        }

        for (var direction of Object.keys(opponent)) {
            let newY = y
            let newX = x
            switch (direction) {
                case 'up':
                    --newY
                    if (newY >= 0 && newY < this.grid.length) {
                        if ((this.grid[newY][x].item && this.grid[newY][x].item.length)) {
                            const cellOpponent = this.grid[newY][x].findItemByType('player')
                            if (cellOpponent) {
                                console.log('opponent up', opponent)
                                return cellOpponent
                            }
                        }
                    }
                    break;
                case 'down':
                    ++newY
                    if (newY >= 0 && newY < this.grid.length) {
                        if ((this.grid[newY][x].item && this.grid[newY][x].item.length)) {
                            const cellOpponent = this.grid[newY][x].findItemByType('player')
                            if (cellOpponent) {
                                console.log('opponent down', opponent)
                                return cellOpponent
                            }
                        }
                    }
                    break;
                case 'right':
                    ++newX
                    if (newX >= 0 && newX < this.grid.length) {
                        if ((this.grid[y][newX].item && this.grid[y][newX].item.length)) {
                            const cellOpponent = this.grid[y][newX].findItemByType('player')
                            if (cellOpponent) {
                                console.log('opponent right', opponent)
                                return cellOpponent
                            }
                        }
                    }
                    break;

                case 'left':
                    --newX
                    if (newX >= 0 && newX < this.grid.length) {
                        if ((this.grid[y][newX].item && this.grid[y][newX].item.length)) {
                            const cellOpponent = this.grid[y][newX].findItemByType('player')
                            if (cellOpponent) {
                                console.log('opponent left', opponent)
                                return cellOpponent
                            }
                        }
                    }
                    break;
            }

        }
            
        return false
    }

    battleDecision(opponentInFightingRange, clickTarget) {
        alert('click on opponent place if you want to attack or defend')
        const {x,y} = opponentInFightingRange.position
        Object.values(newPath).forEach((positions) => {
            for (let i = 0; i < positions.length; i++) {
                if (clickTarget.x == x && clickTarget.y == y) {
                    
                }   
            }
        })
    }
    
    pathRemover(oldPath) {
        Object.values(oldPath).forEach((positions) => {
            for (let i = 0; i < positions.length; i++) {
                // const { y, x } = positions[i]
                removeClassName(positions[i], 'range2')
            }
        })
    }


    removeItem(y, x, item) {
        this.grid[y][x].blocked = false

        if (this.grid[y][x].item && this.grid[y][x].item.length) {
            // console.log('remove',this.grid[y][x].item[0].id )
            if (this.grid[y][x].item[0].id == item.id) {
                this.grid[y][x].item.splice(0, 1)  
                removeClassName({ y: y, x: x }, item.id)
                // return true
            }
        }
    }

    addItem(y, x, item) {     

        if (!(this.grid[y][x].item && this.grid[y][x].item.length)) {
            item.position.y = y;
            item.position.x = x;    

            if (item.type === 'weapon') {
                this.grid[y][x].blocked = false

            }
            if (item.type === 'block' || item.type === 'player') {
                    this.grid[y][x].blocked = true
            } 

            this.grid[y][x].item.push(item)
            addClassName({y: y, x: x}, item.id)
            
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
                if (itemObject.type == 'player') {
                    var adjacentOpponent = this.opponentFinder(randIndex, 1)
                    if (!adjacentOpponent) {
                        var addItemResult = this.addItem(randIndex.y, randIndex.x, itemObject)
                        if (addItemResult == true) {
                            amount--
                        }
                    }
                }
                else {
                    var addItemResult = this.addItem(randIndex.y, randIndex.x, itemObject)
                    if (addItemResult == true) {
                        amount--
                    }
                }

            }
        } else if (amount > numavailableCell) {
            // alert("All " + amount + " "+Objtype.name + " cannot be generated - no space left ")
            console.log(Error("All " + amount + itemObject.name + " cannot be generated - no space left " + "Amount item: " + amount + " is greater then numavailableCell: " + numavailableCell));
        }
    }
    createMaps() {
        const maps = document.getElementById('map')
        maps.classList.add('container', 'd-flex','flex-column', 'justify-content-left')
        for (let y = 0; y < this.grid.length; y++) {
            const row = document.createElement('div')
            row.classList.add('row')
            for (let x = 0; x < this.grid[y].length; x++) {
                const column = document.createElement('div')

                //add data attributes to set the y and x value of the cell
                column.setAttribute('data-pos-y', y)
                column.setAttribute('data-pos-x', x)

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
                const item = this.grid[y][x].findItemById(Objtype.id)
                if (item) {
                    console.log('find', item, item.position.y, item.position.x)
                    console.log('weapon',y, x)
                }
            }
        }
    }

    attack() {
        const playerInBattleMode = this.playerOnTurn
        const opponentInBattleMode = this.opponentFinder(this.playerOnTurn.position)
        let damageReceived = playerInBattleMode.weapon.damage

        playerInBattleMode.defend= false
        if (opponentInBattleMode.defend == true) {
           damageReceived/=2
        }
        console.log('attack game player', this.playerOnTurn)
        console.log('attack ',  playerInBattleMode, 'kek op',opponentInBattleMode)
        opponentInBattleMode.health -= damageReceived
        $('#battleDecisionModal').modal('hide')
        $(`#${opponentInBattleMode.id}Health`).text(opponentInBattleMode.health)
        
        alert(playerInBattleMode.id + '- waiting' + this.playerWaiting + '- playeronturn' + opponentInBattleMode.id)
        this.startGame(opponentInBattleMode)
    }
    defend() {
        // const playerInBattleMode = this.grid[this.playerOnTurn.position.y][this.playerOnTurn.position.x].findItemById(this.playerOnTurn.id)
        const playerInBattleMode = this.playerOnTurn
        const opponentInBattleMode = this.opponentFinder(this.playerOnTurn.position)
        playerInBattleMode.defend = true
        $('#battleDecisionModal').modal('hide')
        alert(this.playerOnTurn.defend + ' ' + playerInBattleMode + '=' + this.playerOnTurn + ' ' + opponentInBattleMode)
        this.startGame(opponentInBattleMode)
    }

}

let numberOfBlocks = 20;
const player1 = new Player('player1','Mario')
const player2 = new Player('player2', 'Luigi')
const defaultWeapon = new Weapon('default', 'hand', '10')
const weapon1 = new Weapon('mushroom1', 'Mushroom 1' , 50)
const weapon2 = new Weapon('mushroom2', 'Mushroom 2' , 40)
const weapon3 = new Weapon('mushroom3', 'Mushroom 3' , 30)
const weapon4 = new Weapon('mushroom4', 'Mushroom 4' , 15)
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
    var block = new Block('block')
    if (game.addItem(randIndex.y, randIndex.x, block) == true) {
        numberOfBlocks--
    }
}

game.startGame(player1)
var cell = $("div#map > div>div")

function addClassName(coordinates, objClass) {
    const { y, x } = coordinates
    const cellId = `#col-${y}${x}`
    const cellElement = $(cellId)
    if (!cellElement.hasClass(objClass)) {
        cellElement.addClass(objClass);        
        return true;
    }
}

function removeClassName(coordinates, objClass) {
    const { y, x } = coordinates
    const cellId = `#col-${y}${x}`
    const cellElement = $(cellId)
    if (cellElement.hasClass(objClass)) {
        cellElement.removeClass(objClass);
        return true;
    }
};


$('#attackButton').on('click', function () {
    game.attack()
})
$('#defendButton').on('click', function () {
    game.defend()
})

cell.on("click", function () {
    if (!$(this).hasClass('range2') && !$(this).hasClass(game.playerWaiting) ) {
        return 
    }

    if ($(this).hasClass(game.playerWaiting)) {
        const opponentInFightingRange1 = game.opponentFinder(game.playerOnTurn.position)
        console.log('i found/not found something', opponentInFightingRange1)
        const playerInBattleMode1 = opponentInFightingRange1
        const opponentInBattleMode1 = game.playerOnTurn


        $('#battleDecisionModal .modal-body').text(game.playerOnTurn.name + ' Turn! Select your action!' + game.playerOnTurn.position.y + game.playerOnTurn.position.x + 'found' + opponentInFightingRange1.position.y + opponentInFightingRange1.position.x + opponentInFightingRange1.name)

        $('#battleDecisionModal').modal('show')
    }
    else {

        const oldPath = game.pathFinder(game.playerOnTurn.position, game.playerOnTurn.rangeLimit)

        game.pathRemover(oldPath)

        const newPosition = {
            y: parseInt(this.getAttribute('data-pos-y')),
            x: parseInt(this.getAttribute('data-pos-x'))
        }

        game.removeItem(game.playerOnTurn.position.y, game.playerOnTurn.position.x, game.playerOnTurn)

        const playerOnTurnOrigin = game.playerOnTurn

        const weaponOnPath = game.grid[newPosition.y][newPosition.x].findItemByType('weapon')

        if (game.playerOnTurn.previousWeapon.id !== undefined) {
            game.grid[game.playerOnTurn.position.y][game.playerOnTurn.position.x] = new Cell()
            game.removeItem(game.playerOnTurn.position.y, game.playerOnTurn.position.x, game.playerOnTurn)
            game.addItem(game.playerOnTurn.position.y, game.playerOnTurn.position.x, game.playerOnTurn.previousWeapon)
            game.playerOnTurn.previousWeapon = {}
        }
        console.log('test', weaponOnPath)
        if (weaponOnPath) {
            if (game.playerOnTurn.weapon.id == 'default') {
                game.removeItem(weaponOnPath.position.y, weaponOnPath.position.x, weaponOnPath)

                $(this).removeClass(weaponOnPath.id)
                game.playerOnTurn.weapon = weaponOnPath
        
                console.log('weapon on path', weaponOnPath)
                removeClassName(newPosition.y, newPosition.x, weaponOnPath)
                game.addItem(newPosition.y, newPosition.x, playerOnTurnOrigin)

            }
            else {
                let tempWeapon = game.playerOnTurn.weapon
                game.playerOnTurn.previousWeapon = tempWeapon
                tempWeapon.position = newPosition

                game.playerOnTurn.weapon = weaponOnPath
        
                game.removeItem(newPosition.y, newPosition.x, weaponOnPath)

                game.addItem(newPosition.y, newPosition.x, playerOnTurnOrigin)

                game.grid[newPosition.y][newPosition.x].item.push(tempWeapon)
            }
        }

        game.playerOnTurn.position = newPosition

        game.playerOnTurn.weapon.position = game.playerOnTurn.position
        game.addItem(game.playerOnTurn.position.y, game.playerOnTurn.position.x, game.playerOnTurn)

        $(`#${game.playerOnTurn.id}Damage`).text(game.playerOnTurn.weapon.damage)
        $(`#${game.playerOnTurn.id}WeaponImage`).attr('src', `img/${game.playerOnTurn.weapon.id}.png`)

        if (game.playerWaiting == 'player2') {
            game.startGame(player2)
        }
        else {
            game.startGame(player1)
        }

        // const opponentInFightingRange = game.opponentFinder(game.playerOnTurn.position)
        // console.log('i found/not found something', opponentInFightingRange)
        // const playerInBattleMode = opponentInFightingRange
        // const opponentInBattleMode = game.playerOnTurn


        // console.log('attack dionclick bawah', playerInBattleMode)
        // console.log('attack opponent dionclick bawah', opponentInBattleMode)
        // // game.target = { x: newPosition.x, y: newPosition.y }

        // if (opponentInFightingRange) {
        //     $('#battleDecisionModal .modal-body').text(game.playerOnTurn.name + ' Turn! Select your action!' + game.playerOnTurn.position.y + game.playerOnTurn.position.x + 'found' + opponentInFightingRange.position.y + opponentInFightingRange.position.x + opponentInFightingRange.name)

        //     $('#battleDecisionModal').modal('show')
        // }
    }
    game.turn += 1
    $('#turnCounter').text(game.turn)

   
    // const newPath = game.pathFinder(newPosition, game.playerOnTurn.rangeLimit)

    // game.pathGenerator(newPath)


console.table(game.grid)

})
