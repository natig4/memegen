'use strict';
var gImgs = []

const STORAGE_KEY = 'memesDB';
var gNextId = 0;

_createImgs()


function _createImg(imgUrl) {
    return {
        id: idMaker(),
        imgUrl: `<img src="img/${imgUrl}.png" />`,
    }
}

function _createImgs() {
    var imgs = loadFromStorage('imgsDB')
    if (!imgs || !imgs.length) {
        imgs = [
            _createImg('./img/meme-imgs/1.jpg'),
            _createImg('./img/meme-imgs/2.jpg'),
            _createImg('./img/meme-imgs/3.jpg'),
            _createImg('./img/meme-imgs/4.jpg'),
            _createImg('./img/meme-imgs/5.jpg'),
            _createImg('./img/meme-imgs/6.jpg'),
            _createImg('./img/meme-imgs/7.jpg'),
            _createImg('./img/meme-imgs/8.jpg'),
            _createImg('./img/meme-imgs/9.jpg'),
            _createImg('./img/meme-imgs/10.jpg'),
            _createImg('./img/meme-imgs/11.jpg'),
            _createImg('./img/meme-imgs/12.jpg'),
            _createImg('./img/meme-imgs/13.jpg'),
            _createImg('./img/meme-imgs/14.jpg'),
            _createImg('./img/meme-imgs/15.jpg'),
            _createImg('./img/meme-imgs/16.jpg'),
            _createImg('./img/meme-imgs/17.jpg'),
            _createImg('./img/meme-imgs/18.jpg'),
            _createImg('./img/meme-imgs/19.jpg'),
            _createImg('./img/meme-imgs/20.jpg'),
            _createImg('./img/meme-imgs/21.jpg'),
            _createImg('./img/meme-imgs/22.jpg'),
            _createImg('./img/meme-imgs/23.jpg'),
            _createImg('./img/meme-imgs/24.jpg'),
            _createImg('./img/meme-imgs/25.jpg'),
        ]
    }
    gImgs = imgs
    _saveImgsToStorage()
}


function _saveImgsToStorage() {
    saveToStorage('imgsDB', gImgs)
}

function getImgs() {
    return gImgs
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


function idMaker() {
    return ++gNextId
}