'use strict';
var gNextIdStickers = 0;
const gStickers = [
    { id: 1, src: './img/stickers/flirty-smiley.png' },
    { id: 2, src: './img/stickers/nerd-emoji.png' },
    { id: 3, src: './img/stickers/pirate-emoji.png' },
];
var gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    selectedStcikerIdx: 0,
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
        selectedStcikerIdx: 0,
        lines: [],
        stickers: []
    }
}

function setLineTxt(txt) {
    const line = getCurrentLine();
    if (!line) return;
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
            txt: '',
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

function getCurrentSticker() {
    return gMeme.stickers[gMeme.selectedStcikerIdx]
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
    const input = document.querySelector('.str-input')
    input.style.fontFamily = font
    if (!getCurrentLine()) return
    getCurrentLine().fontFamily = font;

}

function moveElement(diff, dir) {
    const line = getCurrentLine();
    if (!line || !line.isDrag) {
        getCurrentSticker().pos[dir] += diff
        return
    }
    line.pos[dir] += diff
}

function changeLine() {
    const lines = getLines();
    if (lines.length === 0 || !lines) return;
    if (gMeme.selectedLineIdx + 1 === lines.length) gMeme.selectedLineIdx = 0;
    else gMeme.selectedLineIdx++;
    _updateLineIdx(gMeme.selectedLineIdx);
    return lines[gMeme.selectedLineIdx];
}

function changeSticker() {
    const stickers = getMemeStickers();
    if (stickers.length === 0 || !stickers) return;
    if (gMeme.selectedStcikerIdx + 1 === stickers.length) gMeme.selectedStcikerIdx = 0;
    else gMeme.selectedStcikerIdx++;
    _updateStickerIdx(gMeme.selectedStcikerIdx)
    return stickers[gMeme.selectedStcikerIdx];
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
        createLine({ x: gMeme.lines[gMeme.selectedLineIdx].pos.x, y: gElCanvas.height - 75 }, font)
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

function removeSticker() {
    const stickers = getMemeStickers();
    if (!stickers.length) return;
    stickers.splice(gMeme.selectedStcikerIdx, 1);
    _updateStickerIdx(0);
}

function _updateLineIdx(idx) {
    gMeme.selectedLineIdx = idx;
}

function _updateStickerIdx(idx) {
    gMeme.selectedStcikerIdx = idx;
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
    var difference = 0;
    const clickedLineIdx = lines.findIndex((line) => {
        const lineWidth = gCtx.measureText(line.txt).width;
        const lineHeight = line.size;
        if (line.align === 'right') difference = -lineWidth
        else if (line.align === 'center') difference = -lineWidth / 2
        return (
            clickedPos.x >= line.pos.x + difference &&
            clickedPos.x <= line.pos.x + lineWidth &&
            clickedPos.y >= line.pos.y - 20 &&
            clickedPos.y <= line.pos.y + lineHeight + 20
        );
    });
    if (clickedLineIdx !== -1) {
        _updateLineIdx(clickedLineIdx);
        return lines[clickedLineIdx];
    }
}

function isStcikeriClicked(clickedPos) {
    const stickers = getMemeStickers();
    const clickedStickerIdx = stickers.findIndex((sticker) => {
        const stickerWidth = gCtx.measureText(sticker.txt).width;
        const stickerHeight = sticker.size;
        return (
            clickedPos.x >= sticker.pos.x - stickerWidth / 2 - 10 &&
            clickedPos.x <= sticker.pos.x + stickerWidth + 20 &&
            clickedPos.y >= sticker.pos.y - 10 &&
            clickedPos.y <= sticker.pos.y + stickerHeight + 20
        );
    });
    if (clickedStickerIdx !== -1) {
        _updateStickerIdx(clickedStickerIdx);
        return stickers[clickedStickerIdx];
    }
}

function setLineDrag(isDrag) {
    const line = getCurrentLine();
    line.isDrag = isDrag;
}

function setStickerDrag(isDrag) {
    const sticker = getCurrentSticker();
    sticker.isDrag = isDrag;
}

function saveMeme(meme) {
    gMemes.push(meme);
    _saveMemesToStorage();
}

function getSavedMemes() {
    var memes = loadFromStorage(STORAGE_KEY);
    if (!memes || memes.length === 0) return []
    else return memes;
}

function _saveMemesToStorage() {
    saveToStorage(STORAGE_KEY, gMemes);
}

function addSticker(src) {
    const newSticker = _createSticker(src);
    gMeme.stickers.push(newSticker);
}

function _createSticker(src) {
    const newPos = { x: gElCanvas.width / 2, y: gNextLineHeight };
    gNextLineHeight += 20
    if (gNextLineHeight > gElCanvas.height - 300) gNextLineHeight = 0
    return {
        id: idMakerStickers(),
        src,
        size: 20,
        pos: { x: newPos.x, y: newPos.y + gNextLineHeight },
        isDrag: false,
    };

}

function getAllStickers() {
    return gStickers;
}

function getMemeStickers() {
    return gMeme.stickers;
}


function idMakerStickers() {
    return ++gNextIdStickers
}