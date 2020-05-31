const WALL = '#';
const TARGET = '.';
const PERSON = '@';
const BOX = '$';
const BOX_ON_TARGET = '*';
const PERSON_ON_TARGET = '+';
const PATH = ' ';
let lv=0;
// Move
const LEFT = 0;
const RIGHT = 1;
const UP = 2;
const DOWN = 3;

let games = [];
let currentGame;
let gameLoaded = false;

function loadRandomGame() {
    currentGame = loadGame(lv);
    console.log(currentGame.data)
    renderGame(currentGame);
}

function renderGame(currentGame) {
    if (!currentGame || !gameLoaded) return;
    let markup = '<table>';
    let rows = currentGame.height;
    let columns = currentGame.maxWidth;
    let width = Math.floor((window.innerWidth > 500 ? window.innerWidth - 140 : window.innerWidth) / columns);
    const height = window.innerHeight > 500 ? window.innerHeight - 140 : window.innerHeight;
    while (width * rows > height) {
        width -= 10;
    }
    for (let row = 0; row < rows; row++) {
        markup += createRow(row, columns, width, currentGame);

    }
    markup += '</table>'
    document.getElementById('board').innerHTML = markup;
}

function createRow(row, columns, width, currentGame) {
    if (columns < 1) return;
    let markup = '<tr>';
    let hitWall= false;
    for (let col = 0; col < columns; col++) {
        markup += `<td style="width:${width}px; height:${width}px">`;
        switch (currentGame.data[row][col]) {
            case WALL:
                {
                    hitWall=true;
                    markup += `<img class="rounded" src="./images/wall.png" alt="wall" width="${width}" heigth="${width}" />`;

                    break;
                }
            case TARGET:
                {
                    markup += `<img src="./images/target.png" alt="target" width="${width}" heigth="${width}" />`;

                    break;
                }
            case PERSON:
                {
                    markup += `<img src="./images/person.png" alt="target" width="${width}" heigth="${width}" />`;

                    break;
                }
            case PERSON_ON_TARGET:
                {
                    markup += `<img src="./images/person.png" alt="target" width="${width}" heigth="${width}" />`;

                    break;
                }
            case BOX:
                {
                    markup += `<img src="./images/box.png" alt="target" width="${width}" heigth="${width}" />`;

                    break;
                }
            case BOX_ON_TARGET:
                {
                    markup += `<img src="./images/box_on_target.jpeg" alt="target" width="${width}" heigth="${width}" />`;

                    break;
                }
            case PATH:
                {
                    if(hitWall)
                    markup += `<img  class="rounded" src="./images/floor.png" alt="target" width="${width}" heigth="${width}" />`;

                    break;
                }
            default:
                break;
        }
        markup += '</td>';
    }
    markup += '</tr>';
    return markup;
}

function loadGame(lv) {
    let rawData = boards[0].split(';');
    const len = rawData.length;
    let currentIndex = 0;

    while (currentIndex + 1 < len) {
        let data = rawData[currentIndex].split('\n').filter(item => item.trim() !== '');
        let max = 0;
        let targets = 0;
        let boxes = 0;
        let boxesOnTargets = 0;
        let currentRow = 0;
        let personRow = 0;
        let personColumn = 0;
        data.shift();
        data.forEach((element) => {
            if (element.length > max)
                max = element.length;
            targets += element.split(TARGET).length - 1;
            targets += element.split(BOX_ON_TARGET).length - 1;
            targets += element.split(PERSON_ON_TARGET).length - 1;
            boxes += element.split(BOX).length - 1;
            boxes += element.split(BOX_ON_TARGET).length - 1;

            boxesOnTargets += element.split(BOX_ON_TARGET).length - 1;

            let i = element.indexOf(PERSON);
            if (i < 0) {
                i = element.indexOf(PERSON_ON_TARGET);
            } else {
                personRow = currentRow;
                personColumn = i
            }
            currentRow++;
        });
        let game = {
            level: rawData[currentIndex + 1].split('\n')[0].trim(),
            height: data.length,
            maxWidth: max,
            data: data,
            targets: targets,
            boxes: boxes,
            boxesOnTargets: boxesOnTargets,
            personRow: personRow,
            personColumn: personColumn


        };
        games.push(game);

        currentIndex++;

    }

    const gameNo = Math.floor(Math.random() * (games.length - 1));
    gameLoaded = true;
    return games[gameNo+lv];
}

document.onkeydown = function(e) {
    if (!gameLoaded) return;
    switch (e.keyCode) {
        case 37:
            {
                doMove(LEFT);
                break;

            }
        case 38:
            {
                doMove(UP);
                break;

            }
        case 39:
            {
                doMove(RIGHT);
                break;

            }
        case 40:
            {
                doMove(DOWN);
                break;

            }
    }

}

function doMove(direction) {
    if (!currentGame || !gameLoaded) return;
    let x0 = currentGame.personRow;
    let y0 = currentGame.personColumn;

    let x1 = 0;
    let y1 = 0;
    switch (direction) {
        case LEFT:
            {
                y1--;
                break;
            }
        case RIGHT:
            {
                y1++;
                break;
            }
        case UP:
            {
                x1--
                break;
            }
        case DOWN:
            {
                x1++
                break;
            }
    }
    // 1. Movement on blank block
    if (currentGame.data[x0 + x1][y0 + y1] === PATH ||
        currentGame.data[x0 + x1][y0 + y1] === TARGET) {
        // Update previous row (before moving)
        currentGame.data[x0] =
            currentGame.data[x0].substr(0, y0) +
            (currentGame.data[x0][y0] === PERSON_ON_TARGET ? TARGET : PATH) +
            currentGame.data[x0].substr(y0 + 1);
        // Update current row (after moving)

        currentGame.data[x0 + x1] =
            currentGame.data[x0 + x1].substr(0, y0 + y1) +
            (currentGame.data[x0 + x1][y0 + y1] === TARGET ?
                PERSON_ON_TARGET :
                PERSON) +
            currentGame.data[x0 + x1].substr(y0 + y1 + 1);
        // update position of person
        currentGame.personColumn = y0 + y1;
        currentGame.personRow = x0 + x1;
        renderGame(currentGame);
    }

    // 2. Pushing the boxes
    else if (currentGame.data[x0 + x1][y0 + y1] === BOX || currentGame.data[x0 + x1][y0 + y1] === BOX_ON_TARGET) {
        if (currentGame.data[x0 + x1 * 2][y0 + y1 * 2] === PATH || currentGame.data[x0 + x1 * 2][y0 + y1 * 2] === TARGET) {
            if (currentGame.data[x0 + x1 * 2][y0 + y1 * 2] === TARGET) {
                currentGame.boxesOnTargets++;
            }
            if (currentGame.data[x0+x1][y0 + y1] === BOX_ON_TARGET) {
                currentGame.boxesOnTargets--;
            }
            // 2.1 update previous position
            currentGame.data[x0] = currentGame.data[x0].substr(0, y0) +
                (currentGame.data[x0][y0] === PERSON_ON_TARGET ? TARGET : PATH) +
                currentGame.data[x0].substr(y0 + 1);
            // 2.2 update current row (after moving)
            currentGame.data[x0 + x1] = currentGame.data[x0 + x1].substr(0, y0 + y1) +
                (currentGame.data[x0 + x1][y0 + y1] === BOX_ON_TARGET ? PERSON_ON_TARGET : PERSON) +
                currentGame.data[x0 + x1].substr(y0 + y1 + 1);
            // 2.3 update box position
            currentGame.data[x0 + x1 * 2] = currentGame.data[x0 + x1 * 2].substr(0, y0 + y1 * 2) +
                (currentGame.data[x0 + x1 * 2][y0 + y1 * 2] === TARGET ? BOX_ON_TARGET : BOX) +
                currentGame.data[x0 + x1 * 2].substr(y0 + y1 * 2 + 1);
            // 2.4 update position of person
            currentGame.personColumn = y0 + y1;
            currentGame.personRow = x0 + x1;
            renderGame(currentGame);
            if (currentGame.boxesOnTargets === currentGame.boxes) {
                // Complete chalenge
                // do something
                lv++;
                document.getElementById('level').innerHTML= `Level: ${lv}`;
                loadRandomGame(lv);
            }
        }

    }

}