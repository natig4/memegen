'use strict';


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

function toggleActive(element, arr) {
    console.log(element, arr)
    var lis = document.querySelectorAll(`${arr}`)
    lis.forEach(li => {
        li.classList.remove('active')
    });
    if (element) {
        element.classList.add('active');
        console.log(element)
    }
}