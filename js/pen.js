const player1 = {
    id: 'player1',
    name: 'Player 1',
    weapon: {
        damage: 10,
        name: 'knife'
    },
    health: 100,
    position: {
        x: 1,
        y: 0
    }
}

const weapon1 = {
    id: 'weapon1',
    name: 'something',
    damage: 20,
    position: {
        x: 1,
        y: 0,
    }
}

const map = [
    [[], [player1, weapon1], []],
    [[], [], []],
    [[], [], []],
]

const { y, x } = player1.position

const foundPlayer = map[y][x].find(item => item.id === player1.id)

let playerFound
for (let i = 0; i < map[y][x].length; i++) {
    const item = map[y][x][i]

    if (item.id === player1.id) {
        playerFound = item
        break
    }
}

console.log(foundPlayer)

function Game(height, width) {
    this.grid = []

    for (let y = 0; y < height; y++) {
        this.grid.push([])

        for (let x = 0; x < width; x++) {
            this.grid[y].push([])
        }
    }
}

Game.prototype.addItem = function (item, position) {

}


// const game = new Game(100, 4)

// console.log(game)