'use strict';

function onInit() {
    createKeyWords()
    renderImgs()
    renderKeywords()
}

function renderImgs() {
    const imgs = getImgs()
    var imgsContainer = document.querySelector('.gallery-container')
    if (!imgsContainer.classList.contains('grid')) imgsContainer.classList.add('grid');
    if (imgs.length === 0) {
        imgsContainer.classList.remove('grid');
        imgsContainer.innerHTML = `<h1>No memes with this tags sor far, sorry 🙂</h1>`
        return
    }
    const strHtmls = imgs.map(function(img) {
        return `<div class="img-container" >
        <img class="img img${img.id}" onclick="onImg(${img.id})" src="./img/meme-imgs-different-sizes/${img.id}.jpg" alt=""></div>`
    })
    imgsContainer.innerHTML = strHtmls.join('')

}

function toggleView(flexView) {
    const viewNames = ['.main-content', '.meme-container', '.memes-gallery']
    viewNames.forEach(element => {
        if (element === flexView) {
            $(element).removeClass('hide')
            $(element).addClass('flex')
        } else {
            $(element).removeClass('flex')
            $(element).addClass('hide')
        }
    });
}



function onNav(elLi) {
    toggleActive(elLi, 'ul li')
    switch (elLi.innerHTML) {
        case 'Gallery':
            toggleView('.main-content')
            break;
        case 'Memes':
            toggleView('.memes-gallery')
            renderMyMemes()
            break;
    }
}


function renderMyMemes() {
    const memes = getSavedMemes();
    var strHtmls;
    const memeSize = memes.length;
    if (memeSize) {
        strHtmls = memes.map((meme) => {
            return `<a href="${meme}"  " download="meme.jpg"><img src="${meme}"/></a>`;
        });
    } else {
        strHtmls = `<h1>No saved Memes Go ahead and create one 🙂</h1>`;
    }
    const elGallery = document.querySelector('.memes-gallery');
    if (memeSize) elGallery.innerHTML = strHtmls.join('');
    else elGallery.innerHTML = strHtmls;
}

function onSearch(ev) {
    ev.preventDefault();
    const elSearch = document.querySelector('input[name="search"]');
    fillterBySearch(elSearch.value);
    elSearch.value = '';
    renderKeywords();
    renderImgs();
}

function onKeyFillter(li, txt) {
    fillterBySearch(txt);
    renderKeywords();
    renderImgs();
}

function renderKeywords(txt = 'More...') {
    const isViewAllKeys = gIsFiltered() ? true : false;
    const keywords = getKeywords(isViewAllKeys);
    var strHtmls = '';
    for (const word in keywords) {
        strHtmls += `
      <li class="keyword"><a href="#" style="font-size: ${keywords[word]/15}em;"
      onclick="onKeyFillter(this,'${word}')">${word}</a></li>`;
    }
    document.querySelector('.search-indexes').innerHTML = strHtmls + `<div class="btn-more" onclick="onToggleMore(this) ">${txt}</div>`;
}

function onToggleMore(elBtn) {
    elBtn.innerText = elBtn.innerText === 'More...' ? 'Less...' : 'More...';
    ToggleMore()
    renderKeywords(elBtn.innerText);
}