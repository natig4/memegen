'use strict';
var gElCanvas
var gCtx

const gTouchEvs = ['touchstart', 'touchmove', 'touchend']





function onImg(imgId) {
    updateSelectedMeme(imgId, { x: 32, y: 20 })
    renderCanvas(imgId)
    toggleView()
    resizeCanvas()
}


function onSetLineTxt(txt) {
    if (txt.length > 32) return
    setLineTxt(txt);
    renderCanvas()
}

function onChangeColor(type, color) {
    changeColor(type, color);
    renderCanvas();
}

function onChangeFontSize(diff) {
    changeFontSize(diff);
    renderCanvas();
}

function onChangeFontFamily(font) {
    changeFontFamily(font);
    renderCanvas();
}

function onChangeLine() {
    const line = changeLine();
    onSetLineTxt(line.txt);
    renderCanvas();
}

function onMoveLine(direction) {
    const diff = direction === 'up' ? -5 : 5;
    moveLine(diff, 'y');
    renderCanvas();
}

function onCreateLine(pos) {
    if (getLinesAmount() === 0) onAddLine();
}

function onAddLine() {
    const font = document.querySelector('.select-font-family').value;
    addLine(font);
    renderCanvas();
}

function onRemoveLine() {
    removeLine();
    renderCanvas();
}

function onChangeAlign(direction) {
    changeAlign(direction);
    renderCanvas();
}

function renderTextInput() {
    const line = getCurrentLine();
    if (!line) return;
    document.querySelector('.str-input').value = line.txt;
}

function drawText() {

    const lines = getLines();
    if (!lines) return;
    lines.forEach((line) => {
        gCtx.font = line.size + 'px ' + line.fontFamily
        gCtx.strokeStyle = line.strokeColor;
        gCtx.textAlign = line.align;
        gCtx.fillStyle = line.color
        gCtx.beginPath();
        gCtx.moveTo(line.pos.x, line.pos.y);
        if (line.align === 'left') {
            gCtx.fillText(line.txt, 30, line.size + line.pos.y);
            // gCtx.rect(line.pos.x - 10, line.pos.y - 10, gCtx.measureText(line.txt).width + 15, line.size + 20)
        } else if (line.align === 'right') {
            gCtx.fillText(line.txt, gElCanvas.width - 30, line.size + line.pos.y);
            // gCtx.rect(gElCanvas.width - 30, currLine.pos.y - 10, gCtx.measureText(currLine.txt).width + 15, currLine.size + 20);
        } else if (line.align === 'center') {
            gCtx.fillText(line.txt, gElCanvas.width / 2, line.size + line.pos.y);
            // gCtx.rect(gElCanvas.width / 2, currLine.pos.y - 10, gCtx.measureText(currLine.txt).width + 15, currLine.size + 20);
        }
        gCtx.stroke();
    });
}

function renderCanvas(imgId) {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    if (!imgId) imgId = getImgId()
    var img = new Image;
    img.src = './img/meme-imgs/' + imgId + '.jpg'
    img.onload = function() {
        gCtx.drawImage(img, (gElCanvas.width / 2) - (img.width / 2), 0, img.width, gElCanvas.height);
        drawText();
        renderTextInput();
    }
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}