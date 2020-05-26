const WALL = '#';
const TARGET = '.';
const PERSON = '@';
const BOX = '$';
const BOX_ON_TARGET = '*';
const PERSON_ON_TARGET = '+';
const PATH = ' ';
let games = [];
let currentGame;

function loadRandomGame() {
    currentGame = loadGame();
    let markup = '<table>';
    let rows = 10;
    let columns = 10;
    for (let i = 0; i < rows; i++) {
        markup += createRow(columns);

    }
    markup += '</table>'
    document.getElementById('board').innerHTML = markup;

}

function createRow(columns) {
    if (columns < 1) return;
    let markup = '<tr>';
    for (let j = 0; j < columns; j++) {
        markup += '<td style="width:40px; height:40px">';
        markup += '<img src="./wall.png" alt="hình" width="40" heigth="40" />';
        markup += '</td>';
    }
    markup += '</tr>';
    return markup;
}

function loadGame() {
    let rawData = boards[0].split(';');
    const len = rawData.length;
    let currentIndex = 0;
    while (currentIndex + 1 < 2) {
        let data = rawData[currentIndex].split('\n').filter(item => item.trim()!=='');
        console.log(data);
        let max = 0;
        data.shift();
        data.forEach(e => {
            if (e.length > max) {
                max = e.length;
            }
        })
        console.log('max:', max);
        currentIndex++;

    }
    return boards;
}