/******************** Player object blueprint ****************/
class Player {
	//initialize player properties
	constructor(id, name) {
		this.id = id
		this.name = name
		this.type = 'player'
		this.health = 100
		this.rangeLimit = 3
		this.position = {
			x: '',
			y: ''
		}
		this.weapon = {
			id: 'default',
			name: 'hand',
			type: 'weapon',
			damage: 10,
			position: this.position
		}
		this.previousWeapon = {}
	}
}

/******************** Weapon object blueprint ****************/
class Weapon {
	//initialize weapon properties
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

/******************** Block object blueprint ****************/
class Block {
	//initialize block properties
	constructor(name) {
		this.id = 'block'
		this.name = name
		this.type = 'block'
		this.position = {
			x: '',
			y: ''
		}
	}
}

/******************** Cell object blueprint ****************/
class Cell {
	//Describe status of each box(cell) and item inside box in the board
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

/******************** Game object blueprint ****************/
// define game map (board) and every process happened in the game map
class Game extends Cell {
	//game map properties
	constructor(height, width) {
		super()
		this.grid = []
		this.height = height
		this.width = width
		this.turn = 0;
	}

	//condition when player given turn
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

		this.battleDecisionModal()
	}

	//generate game board data
	generateGrid() {
		for (let y = 0; y < this.height; y++) {
			this.grid.push([])
			for (let x = 0; x < this.width; x++) {
				this.grid[y].push(new Cell())
			}
		}
	}

	//get array of available path in up down left right direction for player movement range in its positiom
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
				switch (direction) {
					case 'up':
						--newY
						if (newY >= 0 && newY < this.grid.length && !blocked) {
							const cellBlocked = this.grid[newY][x].blocked
							if (!cellBlocked) {
								value.push({
									y: newY,
									x: x
								})
							} else {
								blocked = true
							}
						}
						break;
					case 'down':
						++newY
						if (newY >= 0 && newY < this.grid.length && !blocked) {
							const cellBlocked = this.grid[newY][x].blocked
							if (!cellBlocked) {
								value.push({
									y: newY,
									x
								})
							} else {
								blocked = true
							}
						}
						break;

					case 'right':
						++newX
						if (newX >= 0 && newX < this.grid[y].length && !blocked) {
							const cellBlocked = this.grid[y][newX].blocked
							if (!cellBlocked) {
								value.push({
									y,
									x: newX
								})
							} else {
								blocked = true
							}
						}
						break;

					case 'left':
						--newX
						if (newX >= 0 && newX < this.grid[y].length && !blocked) {
							const cellBlocked = this.grid[y][newX].blocked
							if (!cellBlocked) {
								value.push({
									y,
									x: newX
								})
							} else {
								blocked = true
							}
						}
						break;
				}
			}
		})
		return path
	}

	//add new movement path to game map
	pathGenerator(newPath) {
		Object.values(newPath).forEach((positions) => {
			for (let i = 0; i < positions.length; i++) {
				addClassName(positions[i], 'range2')
			}
		})
	}

	// get opponent in adjacent position to player
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
								return cellOpponent
							}
						}
					}
					break;
				case 'right':
					++newX
					if (newX >= 0 && newX < this.grid[y].length) {
						if ((this.grid[y][newX].item && this.grid[y][newX].item.length)) {
							const cellOpponent = this.grid[y][newX].findItemByType('player')
							if (cellOpponent) {
								return cellOpponent
							}
						}
					}
					break;

				case 'left':
					--newX
					if (newX >= 0 && newX < this.grid[y].length) {
						if ((this.grid[y][newX].item && this.grid[y][newX].item.length)) {
							const cellOpponent = this.grid[y][newX].findItemByType('player')
							if (cellOpponent) {
								return cellOpponent
							}
						}
					}
					break;
			}

		}

		return false
	}

	// remove previous path movement from game map
	pathRemover(oldPath) {
		Object.values(oldPath).forEach((positions) => {
			for (let i = 0; i < positions.length; i++) {
				removeClassName(positions[i], 'range2')
			}
		})
	}

	//remove item at position y and x from game map
	removeItem(y, x, item) {
		this.grid[y][x].blocked = false

		if (this.grid[y][x].item && this.grid[y][x].item.length) {
			if (this.grid[y][x].item[0].id == item.id) {
				this.grid[y][x].item.splice(0, 1)
				removeClassName({
					y: y,
					x: x
				}, item.id)
			}
		}
	}

	// add item at position y and x to game map
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
			addClassName({
				y: y,
				x: x
			}, item.id)

			return true
		}
		return false
	}

	//get random number y and x for random placement of item in game map
	getRandomCell() {
		var randIntY = Math.floor(Math.random() * Math.floor(this.height));
		var randIntX = Math.floor(Math.random() * Math.floor(this.width));

		return ({ y: randIntY, x: randIntX })
	}

	//create item by getting random number for position and add item in the position with condition
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
					var adjacentOpponent = this.opponentFinder(randIndex)
					if (!adjacentOpponent) {
						var addItemResult = this.addItem(randIndex.y, randIndex.x, itemObject)
						if (addItemResult == true) {
							amount--
						}
					}
				} else {
					var addItemResult = this.addItem(randIndex.y, randIndex.x, itemObject)
					if (addItemResult == true) {
						amount--
					}
				}

			}
		} else if (amount > numavailableCell) {
			console.log(Error("All " + amount + itemObject.name + " cannot be generated - no space left " + "Amount item: " + amount + " is greater then numavailableCell: " + numavailableCell));
			alert(Error("All " + amount + itemObject.name + " cannot be generated - no space left " + "Amount item: " + amount + " is greater then numavailableCell: " + numavailableCell));
		}
	}

	//generate game maps
	createMaps() {
		const maps = document.getElementById('map')
		maps.classList.add('container', 'd-flex', 'flex-column', 'justify-content-left')
		for (let y = 0; y < this.grid.length; y++) {
			const row = document.createElement('div')
			row.classList.add('row')
			for (let x = 0; x < this.grid[y].length; x++) {
				const column = document.createElement('div')

				//add data attributes to set the y and x value of the cell
				column.setAttribute('data-pos-y', y)
				column.setAttribute('data-pos-x', x)

				column.classList.add('col', 'p-3', 'border')
				column.id = 'col-' + y + x
				column.textContent = 'col-' + y + x
				row.appendChild(column)
			}
			maps.appendChild(row)
		}
	}

	//player do attack action condition and process
	attack() {
		const playerInBattleMode = this.playerOnTurn
		const opponentInBattleMode = this.opponentFinder(this.playerOnTurn.position)

		let damageReceived = playerInBattleMode.weapon.damage

		//if player click attack their defend status is false
		playerInBattleMode.defend = false

		//if opponent click on defend before (defend status true) the player attack damage is 50% of player weapon total damage
		if (opponentInBattleMode.defend == true) {
			damageReceived /= 2
		}

		//decrease opponent health by player weapon damage 
		opponentInBattleMode.health -= damageReceived

		//close modal
		$('#battleDecisionModal').removeClass('show d-block')

		//if opponent health is negative integer then change to zero (no minus health)
		if (opponentInBattleMode.health < 0) {
			opponentInBattleMode.health = 0
		}

		//change health in opponent health information
		$(`#${opponentInBattleMode.id}Health`).text(opponentInBattleMode.health)

		//if opponent health equals zero then show battleWinner modal contains who won
		if (opponentInBattleMode.health == 0) {
			$('#battleWinnerModal .modal-title').text(playerInBattleMode.name + ' won!')
			$('#battleWinnerModal .modal-body').text(playerInBattleMode.name + ' killed ' + opponentInBattleMode.name)
			$('#battleWinnerModal').modal('show');
		}

		//opponent turn to play game
		this.startGame(opponentInBattleMode)

	}

	// condition happen to game when player do defend action
	defend() {
		const playerInBattleMode = this.playerOnTurn
		const opponentInBattleMode = this.opponentFinder(this.playerOnTurn.position)

		// player defend status is true
		playerInBattleMode.defend = true

		//close modal
		$('#battleDecisionModal').removeClass('show d-block')

		//opponent turn to play
		this.startGame(opponentInBattleMode)
	}

	//show battle decision modal when opponent is in adjacent position  
	battleDecisionModal() {
		const opponentInFightingRange = this.opponentFinder(this.playerOnTurn.position)
		if (opponentInFightingRange) {
			$('#battleDecisionModal .modal-body').text(this.playerOnTurn.name + ' Turn! Select your action!' + this.playerOnTurn.position.y + this.playerOnTurn.position.x + 'found' + opponentInFightingRange.position.y + opponentInFightingRange.position.x + opponentInFightingRange.name)

			$('#battleDecisionModal').addClass('show d-block')
		}
	}
}

//inisialise game with maps size 10x10
const game = new Game(10, 10)

//generate game maps
game.generateGrid()
game.createMaps()

//generate blocks
let numberOfBlocks = 20;
while (numberOfBlocks != 0) {
	var randIndex = game.getRandomCell()
	const block = new Block('block')
	if (game.addItem(randIndex.y, randIndex.x, block) == true) {
		numberOfBlocks--
	}
}

//inisialize object player1 , player2, defaultWeapon, weapon1, weapon2, weapon3, and weapon 4
const player1 = new Player('player1', 'Mario')
const player2 = new Player('player2', 'Luigi')
const defaultWeapon = new Weapon('default', 'hand', '10')
const weapon1 = new Weapon('mushroom1', 'Mushroom 1', 50)
const weapon2 = new Weapon('mushroom2', 'Mushroom 2', 40)
const weapon3 = new Weapon('mushroom3', 'Mushroom 3', 30)
const weapon4 = new Weapon('mushroom4', 'Mushroom 4', 15)

//create those items to game maps
game.createItem(player1, 1)
game.createItem(player2, 1)
game.createItem(weapon1, 1)
game.createItem(weapon2, 1)
game.createItem(weapon3, 1)
game.createItem(weapon4, 1)

// Player 1 start game
game.startGame(player1)

/******************** Battle Mode Modal Attack Defend Reset Action Event Listener ****************/
$('#attackButton').on('click', function () {
	game.attack()
	game.battleDecisionModal()
})
$('#defendButton').on('click', function () {
	game.defend()
	game.battleDecisionModal()
})
$('#resetButton').on('click', function () {
	location.reload()
})


var cell = $("div#map > div>div")
/****************************************** Game Cycle ******************************************/
cell.on("click", function () {

	//clickable cell is the range path cell and playerWaiting or opponent player
	if (!$(this).hasClass('range2') && !$(this).hasClass(game.playerWaiting)) {
		return
	}

	//if player click on opponent generate battle decision modal
	if ($(this).hasClass(game.playerWaiting)) {
		game.battleDecisionModal()
	}

	//else player move to range cell click
	else {

		//remove old path range
		const oldPath = game.pathFinder(game.playerOnTurn.position, game.playerOnTurn.rangeLimit)
		game.pathRemover(oldPath)

		//remove player in previous position
		game.removeItem(game.playerOnTurn.position.y, game.playerOnTurn.position.x, game.playerOnTurn)

		//get x and y of player newposition
		const newPosition = {
			y: parseInt(this.getAttribute('data-pos-y')),
			x: parseInt(this.getAttribute('data-pos-x'))
		}

        //player on turn origin place
		const playerOnTurnOrigin = game.playerOnTurn
		
		//get weapon in new position
		const weaponOnPath = game.grid[newPosition.y][newPosition.x].findItemByType('weapon')

		//drop player previous weapon if exist into cell and remove player in that cell
		if (game.playerOnTurn.previousWeapon.id !== undefined) {
			game.grid[game.playerOnTurn.position.y][game.playerOnTurn.position.x] = new Cell()
			game.removeItem(game.playerOnTurn.position.y, game.playerOnTurn.position.x, game.playerOnTurn)
			game.addItem(game.playerOnTurn.position.y, game.playerOnTurn.position.x, game.playerOnTurn.previousWeapon)
			game.playerOnTurn.previousWeapon = {}
		}

		//change weapon on path to player weapon
        if (weaponOnPath) {
            //if player weapon is default no previous weapon added only remove weapon on path and add player to newPosition
			if (game.playerOnTurn.weapon.id == 'default') {
				game.removeItem(weaponOnPath.position.y, weaponOnPath.position.x, weaponOnPath)
				removeClassName(newPosition.y, newPosition.x, weaponOnPath)

				game.playerOnTurn.weapon = weaponOnPath

				game.addItem(newPosition.y, newPosition.x, playerOnTurnOrigin)

            }
            //change player weapon to previous weapon and weapon on path player weapon and push temp weapon to cell 
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

        //change player position to new position 
		game.playerOnTurn.position = newPosition

        //change player weapon position to player position 
		game.playerOnTurn.weapon.position = game.playerOnTurn.position
        
        //add player to game maps item in the new position
        game.addItem(game.playerOnTurn.position.y, game.playerOnTurn.position.x, game.playerOnTurn)

        //update the information of player damage and weapon image
		$(`#${game.playerOnTurn.id}Damage`).text(game.playerOnTurn.weapon.damage)
		$(`#${game.playerOnTurn.id}WeaponImage`).attr('src', `img/${game.playerOnTurn.weapon.id}.png`)

        //change player turn to player waiting / opponent        
		if (game.playerWaiting == 'player2') {
			game.startGame(player2)
		} else {
			game.startGame(player1)
		}

        //check if player is in adjacent position with opponent to show battle decision modal
		game.battleDecisionModal()
    }
    
    //turn counter plus 1
	game.turn += 1
	$('#turnCounter').text(game.turn)

})


/********************* Global Functions *********************/
//add object class name in cell element if not exist
function addClassName(coordinates, objClass) {
	const { y, x } = coordinates
	const cellId = `#col-${y}${x}`
	const cellElement = $(cellId)
	if (!cellElement.hasClass(objClass)) {
		cellElement.addClass(objClass);
		return true;
	}
}

//remove object class name in cell element if exist
function removeClassName(coordinates, objClass) {
	const { y, x } = coordinates
	const cellId = `#col-${y}${x}`
	const cellElement = $(cellId)
	if (cellElement.hasClass(objClass)) {
		cellElement.removeClass(objClass);
		return true;
	}
}

console.table(game.grid)
