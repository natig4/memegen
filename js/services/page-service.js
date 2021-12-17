'use strict';
var gImgs = []

const STORAGE_KEY = 'memesDB';
var gNextId = 0;
var gFillterWord = 'all';
var gFilter = true;
_createImgs()


const gKeywords = {
    all: gImgs.length,
    funny: countWords('funny'),
    animal: countWords('animal'),
    awkard: countWords('awkard'),
    happy: countWords('happy'),
    angry: countWords('angry'),
    people: countWords('people'),
    baby: countWords('baby'),
    political: countWords('political'),
    cute: countWords('cute'),
    crazy: countWords('crazy')
};



function _createImg(imgUrl, keywords) {
    return {
        id: idMaker(),
        imgUrl: `<img src="img/${imgUrl}.png" />`,
        keywords: keywords
    }
}

function _createImgs() {
    var imgs = loadFromStorage('imgsDB')
    if (!imgs || !imgs.length) {
        imgs = [
            _createImg('./img/meme-imgs/1.jpg', ['funny', 'happy', 'cute']),
            _createImg('./img/meme-imgs/2.jpg', ['happy', 'cute']),
            _createImg('./img/meme-imgs/3.jpg', ['political', 'funny', 'people']),
            _createImg('./img/meme-imgs/4.jpg', ['happy', 'cute', 'animal']),
            _createImg('./img/meme-imgs/5.jpg', ['happy', 'cute', 'baby']),
            _createImg('./img/meme-imgs/6.jpg', ['happy', 'funny', 'baby']),
            _createImg('./img/meme-imgs/7.jpg', ['animal', 'cute', 'happy']),
            _createImg('./img/meme-imgs/8.jpg', ['people', 'happy', 'awkard', 'crazy']),
            _createImg('./img/meme-imgs/9.jpg', ['baby', 'funny', 'awkard', 'crazy']),
            _createImg('./img/meme-imgs/10.jpg', ['people', 'awkard']),
            _createImg('./img/meme-imgs/11.jpg', ['people', 'awkard', 'crazy']),
            _createImg('./img/meme-imgs/12.jpg', ['political', 'people', 'awkard']),
            _createImg('./img/meme-imgs/13.jpg', ['baby', 'awkard', 'crazy']),
            _createImg('./img/meme-imgs/14.jpg', ['political', 'funny', 'people']),
            _createImg('./img/meme-imgs/15.jpg', ['baby', 'awkard', 'funny']),
            _createImg('./img/meme-imgs/16.jpg', ['animal', 'awkard', 'funny']),
            _createImg('./img/meme-imgs/17.jpg', ['political', 'funny', 'people']),
            _createImg('./img/meme-imgs/18.jpg', ['political', 'funny', 'people']),
            _createImg('./img/meme-imgs/19.jpg', ['sport', 'people']),
            _createImg('./img/meme-imgs/20.jpg', [, 'funny', 'people']),
            _createImg('./img/meme-imgs/21.jpg', ['funny', 'people']),
            _createImg('./img/meme-imgs/22.jpg', ['people']),
            _createImg('./img/meme-imgs/23.jpg', ['people']),
            _createImg('./img/meme-imgs/24.jpg', ['people']),
            _createImg('./img/meme-imgs/25.jpg', ['political', 'funny', 'people']),
        ]
    }
    gImgs = imgs
    _saveImgsToStorage()
}


function _saveImgsToStorage() {
    saveToStorage('imgsDB', gImgs)
}

function getImgs() {
    if (gFillterWord === 'all') return gImgs;
    return gImgs.filter((img) => img.keywords.includes(gFillterWord));
}

function addImg(imgUrl) {
    gImgs.unshift(_createImg(imgUrl))
    _saveImgsToStorage()
}

function getImgById(imgId) {
    const img = gImgs.find(function(img) {
        return img.id === imgId
    })
    return img
}


function getUrlById(imgId) {
    const img = gImgs.find(function(img) {
        return img.id === imgId
    })
    return img.imgUrl
}

function getImgId() {
    return gMeme.selectedImgId
}



function fillterBySearch(word) {
    gFillterWord = word;
    if (word !== 'all') {
        gKeywords[word] = (gKeywords[word]) ? ++gKeywords[word] : 10;
    }
}

function getKeywords() {
    if (!gFilter) return gKeywords;
    else {
        const { all, funny, animal, awkard, happy, angry } = gKeywords;
        return { all, funny, animal, awkard, happy, angry };
    }
}

function gIsFiltered() {
    return gFilter
}

function ToggleMore() {
    gFilter = !gFilter
}

function countWords(word) {
    var count = 0;
    gImgs.forEach(element => {
        for (const keyWord in element.keywords) {
            if (element.keywords.includes(word)) count++;
        }
    });
    return count !== 0 ? count : 5;
}

function idMaker() {
    return ++gNextId
}