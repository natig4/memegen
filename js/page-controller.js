'use strict';

function onInit() {
    renderImgs()
}

function renderImgs() {
    const imgs = getImgs()
    const strHtmls = imgs.map(function(img) {
        return `<div class="img-container" >
        <img class="img img${img.id}" onclick="onImg(${img.id})" src="./img/meme-imgs/${img.id}.jpg" alt=""></div>`
    })
    document.querySelector('.gallery-container').innerHTML = strHtmls.join('')
}

function toggleView() {
    var main = document.querySelector('.main-content')
    main.classList.remove('flex')
    main.classList.add('hide')
    var memes = document.querySelector('.meme-container')
    memes.classList.remove('hide')
    memes.classList.add('flex')
}

function onNav(elLi) {
    toggleNav(elLi)
}

function toggleNav(elLi) {
    var lis = document.querySelectorAll('ul li')
    lis.forEach(li => {
        li.classList.remove('active')
    });
    if (elLi) elLi.classList.add('active');
}