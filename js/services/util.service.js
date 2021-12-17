'use strict';

function idMaker() {
    return ++gNextId
}

function $(selectorOrEl) {
    var el = selectorOrEl;
    if (typeof selectorOrEl === 'string') {
        el = document.querySelector(selectorOrEl);
    }
    const $el = {
        addClass(className) {
            el.classList.add(className)
            return $el
        },
        removeClass(className) {
            el.classList.remove(className)
            return $el
        }
    }
    return $el;
}