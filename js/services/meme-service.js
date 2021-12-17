'use strict';
var gNextIdStickers = 0;
const gStickers = [
    { id: idMakerStickers(), src: './img/stickers/flirty-smiley.png' },
    { id: idMakerStickers(), src: './img/stickers/nerd-emoji.png' },
    { id: idMakerStickers(), src: './img/stickers/pirate-emoji.png' },
];
var gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    lines: [],
    stickers: []
}
var gNextLineHeight = 20;
var gIsFirstLine = false;
var gMemes = getSavedMemes();


function getImgId() {
    return gMeme.selectedImgId
}

function updateSelectedMeme(imgId) {
    gMeme = {
        selectedImgId: imgId,
        selectedLineIdx: 0,
        lines: [],
        stickers: []
    }
}

function setLineTxt(txt) {
    const line = getCurrentLine();
    line.txt = txt;
}

function createLine(pos, font) {
    var line = {
        pos: { x: 20, y: 20 },
        txt: ' ',
        size: 40,
        fontFamily: font,
        align: 'left',
        color: 'white',
        strokeColor: 'black',
        isDrag: false
    }
    if (!gIsFirstLine || !gMeme.lines[0]) {
        gIsFirstLine = true
        gMeme.lines[0] = line
        return
    } else if (gMeme.lines.length !== 0) {
        line = {
            pos: pos,
            txt: 'Enter Text here',
            size: gMeme.lines[gMeme.selectedLineIdx].size,
            fontFamily: gMeme.lines[gMeme.selectedLineIdx].fontFamily,
            align: gMeme.lines[gMeme.selectedLineIdx].align,
            color: gMeme.lines[gMeme.selectedLineIdx].color,
            strokeColor: gMeme.lines[gMeme.selectedLineIdx].strokeColor,
            isDrag: false
        }
    }
    gMeme.lines.push(line)
}

function getCurrentLine() {
    return gMeme.lines[gMeme.selectedLineIdx]
}

function getLines() {
    return gMeme.lines;
}

function getLinesAmount() {
    return gMeme.lines.length;
}

function changeColor(type, color) {
    if (type === 'font') gMeme.lines[gMeme.selectedLineIdx].color = color;
    else gMeme.lines[gMeme.selectedLineIdx].strokeColor = color;
}

function changeFontSize(diff) {
    getCurrentLine().size += diff;
}

function changeFontFamily(font) {
    getCurrentLine().fontFamily = font;
}

function moveLine(diff, dir) {

    getCurrentLine().pos[dir] += diff;
}

function changeLine() {
    const lines = getLines();
    if (!lines.length) return;
    if (gMeme.selectedLineIdx + 1 === lines.length) gMeme.selectedLineIdx = 0;
    else gMeme.selectedLineIdx++;
    _updateLineIdx(gMeme.selectedLineIdx);
    return lines[gMeme.selectedLineIdx];
}

function changeAlign(alignDir) {
    const line = getCurrentLine();
    line.align = alignDir;
    switch (alignDir) {
        case 'left':
            line.pos.x = 20;
            break;
        case 'center':
            line.pos.x = gElCanvas.width / 2;
            break;
        case 'right':
            line.pos.x = gElCanvas.width - 20;
            break;
    }
}

function addLine(font) {
    if (gMeme.lines.length === 0) {
        createLine({ x: 20, y: 30 }, font)
    } else if (gMeme.lines.length === 1) {
        createLine({ x: gMeme.lines[gMeme.selectedLineIdx].pos.x, y: gElCanvas.height - 50 }, font)
    } else if (gMeme.lines.length === 2) {
        createLine({ x: gMeme.lines[gMeme.selectedLineIdx].pos.x, y: gElCanvas.height / 2 }, font)
    } else {
        createLine({ x: gMeme.lines[gMeme.selectedLineIdx].pos.x, y: 30 + gNextLineHeight }, font)
        gNextLineHeight += 20;
        if (gNextLineHeight > 540) gNextLineHeight = 0
    }
    _updateLineIdx(gMeme.lines.length - 1);
}

function removeLine() {
    const lines = getLines();
    if (!lines.length) return;
    lines.splice(gMeme.selectedLineIdx, 1);
    _updateLineIdx(0);
}

function _updateLineIdx(idx) {
    gMeme.selectedLineIdx = idx;
}




function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    };
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault();
        ev = ev.changedTouches[0];
        pos = {
            x: ev.pageX - ev.target.offsetLeft,
            y: ev.pageY - ev.target.offsetTop,
        };
    }
    return pos;
}

function isLineClicked(clickedPos) {
    const lines = getLines();
    const clickedLineIdx = lines.findIndex((line) => {
        const lineWidth = gCtx.measureText(line.txt).width;
        const lineHeight = line.size;
        return (
            clickedPos.x >= line.pos.x - lineWidth / 2 - 10 &&
            clickedPos.x <= line.pos.x + lineWidth + 20 &&
            clickedPos.y >= line.pos.y - 10 &&
            clickedPos.y <= line.pos.y + lineHeight + 20
        );
    });
    if (clickedLineIdx !== -1) {
        _updateLineIdx(clickedLineIdx);
        return lines[clickedLineIdx];
    }
}

function setLineDrag(isDrag) {
    const line = getCurrentLine();
    line.isDrag = isDrag;
}

function saveMeme(meme) {
    gMemes.push(meme);
    _saveMemesToStorage();
}

function getSavedMemes() {
    var memes = loadFromStorage(STORAGE_KEY);
    if (!memes) return []
    else return memes;
}

function _saveMemesToStorage() {
    saveToStorage(STORAGE_KEY, gMemes);
}

function addSticker(id, src) {
    const newSticker = _createSticker(id, src);
    gMeme.stickers.push(newSticker);
}

function _createSticker(id, src) {
    const newPos = { x: gElCanvas.width / 2, y: gElCanvas.height / 2 };
    return {
        id,
        src,
        size: 20,
        pos: { x: newPos.x, y: newPos.y },
        isDrag: false,
    };
}


function getStickers() {
    return gStickers;
}

function getMemeStickers() {
    return gMeme.stickers;
}


function idMakerStickers() {
    return ++gNextIdStickers
}