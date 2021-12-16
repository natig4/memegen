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
    document.querySelector('.str-input').value = ""
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
        gCtx.textAlign = line.align;
        gCtx.fillStyle = line.color
        gCtx.beginPath();
        gCtx.moveTo(line.pos.x, line.pos.y);
        if (line.align === 'left') {
            gCtx.fillText(line.txt, 30, line.size + line.pos.y);
        } else if (line.align === 'right') {
            gCtx.fillText(line.txt, gElCanvas.width - 30, line.size + line.pos.y);
        } else if (line.align === 'center') {
            gCtx.fillText(line.txt, gElCanvas.width / 2, line.size + line.pos.y);
        }
        gCtx.stroke();
    });
}

function drawBorder() {
    const line = getCurrentLine();
    if (!line) return;
    gCtx.beginPath();
    gCtx.rect(line.pos.x + 15, line.pos.y, gCtx.measureText(line.txt).width, line.size + 2);
    gCtx.strokeStyle = line.strokeColor;
    gCtx.stroke();
    gCtx.closePath();
}

function renderCanvas(imgId) {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    if (!imgId) imgId = getImgId()
    var img = new Image;
    img.src = './img/meme-imgs/' + imgId + '.jpg'
    img.onload = function() {
        var scale = Math.max(gElCanvas.width / img.width, gElCanvas.height / img.height);
        var x = (gElCanvas.width / 2) - (img.width / 2) * scale;
        var y = (gElCanvas.height / 2) - (img.height / 2) * scale;
        gCtx.drawImage(img, x, y, img.width * scale, img.height * scale)
        drawText();
        drawBorder();
        renderTextInput();
    }
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}

function onDownloadMeme(elLink) {
    const memeContent = gElCanvas.toDataURL();
    elLink.href = memeContent;
}