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
    console.log(currentGame);
    let markup = '<table>';
    let rows = currentGame.height;
    let columns = currentGame.maxWidth;
    let width = Math.floor((window.innerWidth - 100) / columns);
    const height = window.innerHeight > 600 ? window.innerHeight - 100 : window.innerHeight;
    while (width * rows > height) {
        width -= 10;
    }
    for (let row = 0; row < rows; row++) {
        markup += createRow(columns, width);

    }
    markup += '</table>'
    document.getElementById('board').innerHTML = markup;

}

function createRow(columns, width) {
    if (columns < 1) return;
    let markup = '<tr>';
    for (let col = 0; col < columns; col++) {
        markup += `<td style="width:${width}px; height:${width}px">`;
        markup += `<img src="./wall.png" alt="hình" width="${width}" heigth="${width}" />`;
        markup += '</td>';
    }
    markup += '</tr>';
    return markup;
}

function loadGame() {
    let rawData = boards[0].split(';');
    const len = rawData.length;
    let currentIndex = 0;
    while (currentIndex + 1 < len) {
        let data = rawData[currentIndex].split('\n').filter(item => item.trim() !== '');
        let max = 0;
        data.shift();
        data.forEach(e => {
            if (e.length > max) {
                max = e.length;
            }
        });
        let game = {
            level: rawData[currentIndex + 1].split('\n')[0].trim(),
            height: data.length,
            maxWidth: max,
            data: data,

        };
        games.push(game);

        currentIndex++;

    }

    const gameNo = Math.floor(Math.random() * (games.length - 1));
    return games[gameNo];
}