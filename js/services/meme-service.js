'use strict';

var gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    lines: []
}
var gNextLineHeight = 20;
var gIsFirstLine = false;


function getImgId() {
    return gMeme.selectedImgId
}

function updateSelectedMeme(imgId, pos) {
    gMeme = {
        selectedImgId: imgId,
        selectedLineIdx: 0,
        lines: [
            createLine(pos)
        ]
    }
}




function setLineTxt(txt) {
    const line = getCurrentLine();
    line.txt = txt;
}



function createLine(pos) {
    var line = {
        pos: { x: 20, y: 20 },
        txt: ' ',
        size: 40,
        fontFamily: 'Impact',
        align: 'left',
        color: 'white',
        strokeColor: 'black',
        isDrag: false
    }
    if (!gIsFirstLine) {
        gIsFirstLine = true;
        return line
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
    else gMeme.lines[gMeme.selectedLineIdx].stroke = color;
}

function changeFontSize(diff) {
    getCurrentLine().size += diff;
}

function changeFontFamily(font) {
    getCurrentLine().font = font;
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
            line.pos.x = 0;
            break;
        case 'center':
            line.pos.x = gElCanvas.width / 2;
            break;
        case 'right':
            line.pos.x = gElCanvas.width;
            break;
    }
}

function addLine(font) {
    if (gMeme.lines.length === 1) {
        createLine({ x: 20, y: gElCanvas.height - 50 })
    } else if (gMeme.lines.length === 2) {
        createLine({ x: 20, y: gElCanvas.height / 2 })
    } else {
        createLine({ x: 20, y: 30 + gNextLineHeight })
        gNextLineHeight += 20;
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







function isLineClicked(clickedPos) {
    const line = getCurrentLine()
    const { pos } = line
    const distance = Math.sqrt((pos.x - clickedPos.x) ** 2 + (pos.y - clickedPos.y) ** 2)
    return distance <= line.size
}


function setLineDrag(isDrag) {
    getCurrentLine().isDrag = isDrag
}

function moveCircle(dx, dy) {
    getCurrentLine().pos.x += dx
    getCurrentLine().pos.y += dy
}