# P6_sinta (Validated)
### Openclassroom Project 6 
#### Build Turn-Based board game in javascript for "Open Classroom Front-End Developer Path offered By DevC Medan and powered by OpenClassroom Workplace Facebook"

## Game Site : https://sintaanjelina.github.io/P6_sinta
# Project Summary 
##### Game item in the board defined and worked as follows:
- at least 4 weapons in the game
- 2 players play the game
- block or obstacles (no amount required listed so it is self-defined in code) placed in the game cannot be passed
- All items have visual image and name and other specific attributes like damage or health. 
- All items are Randomly generated into the game map/ board cell and not being place together in the same cellbox.
- there are cell with no item placed called empty cell
- there are unavailable cell which has block or obstacles item in it that player cannot passed so no range movement path passing the brick.
- Player can move 1  to 3 box horizontally and vertically for eaach direction LEFT RIGHT AND UP BOTTOM. 
- 2 players play each turn one after another
- Player default weapon has 10 points of damage
- Player can collect weapon on path if player pass the path. So player default weapon becomes weapon on path. 
- If player previously has taken weapon from game map and then player pass another box containing weapon player will replace their weapon with new one from the path and drop their previous weapon on site.
- In adjacent position : battle mode will be activated and each player directed to battle action modals here in turn whether to attack or to defend. If attack player damage attack depends on player weapon damage if player choose to defend they sustain 50% less damage than normal if being attacked in the next turn
A player will win when opponent health is zero. Game end and winning message will be shown in this modal and player can choose to play again and reset the game.

##### Technologies : 
- HTML + Bootstrap4
- Self-custom CSS 
- Javascript + jQuery

##### Game Board Design Key :
- Flexbox column direction for row maps and column generated inside every row with javascript
- Item Class name in css equals object id in js to place Object Item in randomize position cell by adding and removing class name
