'use strict';
var gElCanvas
var gCtx
var gStartPos
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

function renderCanvas(imgId, bordersType) {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    var img = new Image;
    if (bordersType) img.type = bordersType
    if (!imgId || typeof imgId === 'string') imgId = getImgId()
    img.src = getUrlById(imgId)
    img.onload = function() {
        var scale = Math.max(gElCanvas.width / img.width, gElCanvas.height / img.height);
        var x = (gElCanvas.width / 2) - (img.width / 2) * scale;
        var y = (gElCanvas.height / 2) - (img.height / 2) * scale;
        gCtx.drawImage(img, x, y, img.width * scale, img.height * scale)
        drawText();
        renderTextInput();
        renderMemeStickers();
        if (img.type === 'remove-borders') return
        else if (img.type === 'toggleRemoveBordersButton') {
            toggleViewRemoveBorders('.remove-borders')
            drawBorder('stciker')
        }
        drawBorder();
    }
}

function onRemoveBorders() {
    uploadImg()
    renderCanvas(undefined, 'remove-borders')
    toggleViewButtons('.remove-borders')
}

function toggleViewButtons(view) {
    const viewNames = ['.download', '.save', '.remove-borders', '.share']
    viewNames.forEach(element => {
        if (element === view) {
            $(element).addClass('hide')
        } else {
            $(element).removeClass('hide')
        }
    });
}

function toggleViewRemoveBorders(view) {
    document.querySelector('.save').innerText = 'Save'
    const viewNames = ['.download', '.save', '.remove-borders', '.share']
    viewNames.forEach(element => {
        if (element === view) {
            $(element).removeClass('hide')
        } else {
            $(element).addClass('hide')
        }
    });
}


function addListeners() {
    addMouseListeners();
    addTouchListeners();
    window.addEventListener('resize', () => {
        resizeCanvas();
        renderCanvas();
    });
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove);
    gElCanvas.addEventListener('mousedown', onDown);
    gElCanvas.addEventListener('mouseup', onUp);
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove);
    gElCanvas.addEventListener('touchstart', onDown);
    gElCanvas.addEventListener('touchend', onUp);
}

function onDown(ev) {
    const pos = getEvPos(ev);
    if (isLineClicked(pos)) setLineDrag(true);
    else if (isStcikeriClicked(pos)) {
        setStickerDrag(true);
    } else return
    gStartPos = pos;
    gElCanvas.style.cursor = 'grab';
    renderTextInput();
    renderCanvas(undefined, 'toggleRemoveBordersButton');
}

function onUp() {
    if (getCurrentLine() && getCurrentLine().isDrag) setLineDrag(false);
    else if (getCurrentSticker() && getCurrentSticker().isDrag) setStickerDrag(false)
    gElCanvas.style.cursor = 'grab';
}

function onMove(ev) {
    const line = getCurrentLine();
    const sticker = getCurrentSticker();
    if (!line || !line.isDrag)
        if ((!sticker || !sticker.isDrag)) return
    const pos = getEvPos(ev);
    const dx = pos.x - gStartPos.x;
    const dy = pos.y - gStartPos.y;
    moveElement(dx, 'x');
    moveElement(dy, 'y');
    gElCanvas.style.cursor = 'grabbing';
    gStartPos = pos;
    renderCanvas(undefined, 'toggleRemoveBordersButton')
}

function renderStickers() {
    const stickers = getAllStickers();
    const strHtmls = stickers.map((sticker) => {
        return `<div class="sticker" onclick="onAddSticker('${sticker.src}')"><img src="${sticker.src}" /></div>`;
    });

    const elContainer = document.querySelector('.stickers-container');
    elContainer.innerHTML = strHtmls.join('');
}

function onImg(imgId) {
    document.querySelector('.str-input').value = ''
    updateSelectedMeme(imgId)
    renderStickers()
    renderCanvas(imgId, 'toggleRemoveBordersButton')
    addListeners()
    toggleView('.meme-container')
    resizeCanvas()
}

function onSetLineTxt(txt) {
    setLineTxt(txt);
    renderCanvas(undefined, 'toggleRemoveBordersButton')
}

function onChangeColor(type, color) {
    changeColor(type, color);
    renderCanvas(undefined, 'toggleRemoveBordersButton')
}

function onChangeFontSize(diff) {
    changeFontSize(diff);
    renderCanvas(undefined, 'toggleRemoveBordersButton')
}

function onChangeFontFamily(font) {
    changeFontFamily(font);
    renderCanvas(undefined, 'toggleRemoveBordersButton')
}

function onChangeLine() {
    var line = changeLine();
    if (!line) return;
    onSetLineTxt(line.txt);
    renderCanvas(undefined, 'toggleRemoveBordersButton')
}

function onChangeSticker() {
    var sticker = changeSticker()
    if (!sticker) return;
    renderCanvas(undefined, 'toggleRemoveBordersButton')
}

function onMoveLine(direction) {
    const diff = direction === 'up' ? -5 : 5;
    moveElement(diff, 'y');
    renderCanvas(undefined, 'toggleRemoveBordersButton')
}

function onCreateLine() {
    if (getLinesAmount() === 0) onAddLine();
    renderCanvas(undefined, 'toggleRemoveBordersButton')
}

function onAddLine() {
    const font = document.querySelector('.select-font-family').value;
    addLine(font);
    renderCanvas(undefined, 'toggleRemoveBordersButton')
}

function onRemoveLine() {
    removeLine();
    document.querySelector('.str-input').value = ""
    renderCanvas(undefined, 'toggleRemoveBordersButton')
}

function onRemoveSticker() {
    removeSticker();
    renderCanvas(undefined, 'toggleRemoveBordersButton')
}


function onChangeAlign(direction) {
    changeAlign(direction);
    renderCanvas(undefined, 'toggleRemoveBordersButton')
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
        const txt = line.txt;
        gCtx.lineWidth = 2;
        gCtx.textBaseline = 'top';
        gCtx.textAlign = `${line.align}`;
        gCtx.font = `${line.size/10}em ${line.fontFamily}`;
        gCtx.fillStyle = line.color;
        gCtx.strokeStyle = line.stroke;
        gCtx.fillText(txt, line.pos.x, line.pos.y);
        gCtx.strokeText(txt, line.pos.x, line.pos.y);
    });
}

function drawBorder(sticker) {
    if (sticker) {
        var line = getCurrentSticker()
    } else {
        var line = getCurrentLine();
    }
    if (!line) return;
    gCtx.beginPath();
    if (line.align === 'left') {
        if (window.screen.width > 1000) gCtx.rect(line.pos.x, line.pos.y, gCtx.measureText(line.txt).width + 10, line.size * 1.6);
        else gCtx.rect(line.pos.x, line.pos.y, gCtx.measureText(line.txt).width + 10, line.size);
    } else if (line.align === 'center') {
        if (window.screen.width > 1000) gCtx.rect(line.pos.x - gCtx.measureText(line.txt).width / 2, line.pos.y, gCtx.measureText(line.txt).width + 10, line.size * 1.6);
        else gCtx.rect(line.pos.x - gCtx.measureText(line.txt).width / 2, line.pos.y, gCtx.measureText(line.txt).width + 10, line.size);
    } else if (line.align === 'right') {
        if (window.screen.width > 1000) gCtx.rect(line.pos.x - gCtx.measureText(line.txt).width, line.pos.y, gCtx.measureText(line.txt).width + 10, line.size * 1.6);
        else gCtx.rect(line.pos.x - gCtx.measureText(line.txt).width, line.pos.y, gCtx.measureText(line.txt).width + 10, line.size)
    } else {
        if (window.screen.availWidth > 1000) gCtx.rect(line.pos.x, line.pos.y, 50, 50);
        else gCtx.rect(line.pos.x, line.pos.y, 50, line.size + 30)
    }
    gCtx.lineWidth = 2;
    gCtx.strokeStyle = line.strokeColor;
    gCtx.stroke();
    gCtx.closePath();
}


function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}

function onAddSticker(id, dec) {
    addSticker(id, dec);
    if (getMemeStickers().length > 1) {
        onChangeSticker()
    }
    renderCanvas(undefined, 'toggleRemoveBordersButton')
}

function renderMemeStickers() {
    const stickers = getMemeStickers();
    stickers.forEach((sticker) => {
        const img = new Image();
        img.src = sticker.src;
        gCtx.drawImage(img, sticker.pos.x, sticker.pos.y, 50, 50);

    });
}


function onDownloadMeme(elLink) {
    renderCanvas(undefined, 'remove-borders')
    const memeContent = gElCanvas.toDataURL();
    elLink.href = memeContent;
}

function onSaveMeme(elBtn) {
    renderCanvas(undefined, 'remove-borders')
    const meme = gElCanvas.toDataURL('image/jpeg');
    saveMeme(meme);
    elBtn.innerText = 'Saved'
}