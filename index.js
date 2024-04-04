const firInp = document.querySelector('.firstInput');
const secInp = document.querySelector('.secondInput');
const button = document.querySelector('.button');
const text = document.querySelector('.text');

let isCtrlPress = false;
let startSelectionX = 0;
let startSelectionY = 0;
let firstDraggedElements = [];
let secondDraggedElements = [];
let selectedElements = [];
let isMouseDown = false;
let lastActSp = null;
let startSelAreaX = 0;
let startSelAreaY = 0;
let finishSelAreaX = 0;
let finishSelAreaY = 0;
let finishedSelect = false;


const reorgStr = (id, str) => {
    const pText = document.getElementById(`${id}`);
    const g = '&nbsp;';
    const arrLetters = str.split("");
    arrLetters.forEach(l => {
        const span = document.createElement('span');
        span.setAttribute('id', `${Math.floor(Math.random() * 1000000000000)}`);
        span.classList.add('letter');
        span.innerHTML = l === ' ' ? g : l;
        span.addEventListener('mouseover', handelHoverSpan);
        pText.appendChild(span);
    });
};

const rendTitleText = (id, str) => {
    const bText = document.getElementById(`${id}`);
    const span = document.createElement('span');
    span.setAttribute('id', `${Math.floor(Math.random() * 1000000000000)}`);
    span.classList.add('bold');
    span.innerHTML = `${str}`;
    span.addEventListener('mouseover', handelHoverSpan);
    bText.appendChild(span);
};


const handelBut = () => { 
    const fInpVal = firInp.value.trim();
    const sInpVal = secInp.value.trim();
    const titleSecText = `Second Input:${'&nbsp;'}`;
    const titleFirText = `First Input:${'&nbsp;'}`;
    const id = Math.floor(Math.random()*1000000000);
    if (fInpVal !== '' || sInpVal !== '') {
        let newText = null;
        if (fInpVal === '') {
            newText = document.createElement('div');
            newText.innerHTML = `<p id=${id}></p>`;
            text.appendChild(newText);
            rendTitleText(id, titleSecText);
            reorgStr(id, sInpVal);
        } else if (sInpVal === '') {
            newText = document.createElement('div');
            newText.innerHTML = `<p id=${id}></p>`;
            text.appendChild(newText);
            rendTitleText(id, titleFirText);
            reorgStr(id, fInpVal);
        } else {
            newText = document.createElement('div');
            newText.innerHTML = `
            <p id=${id}></p>
            <p id=${id + 1234567}></p>`;
            text.appendChild(newText);
            rendTitleText(id, titleFirText);
            reorgStr(id, fInpVal);
            rendTitleText(id + 1234567, titleSecText);
            reorgStr(id + 1234567, sInpVal);
        };
    };
    firInp.value = '';
    secInp.value = '';
};

button.addEventListener('click', handelBut);
window.addEventListener('keydown', e => { 
    if (e.key === 'Enter') {
        handelBut();
    };
    if (e.key === 'Ctrl' || e.key === 'Meta') {
        isCtrlPress = true;
    };
});
window.addEventListener('keyup', e => {
    if (e.key === 'Ctrl' || e.key === 'Meta') {
        isCtrlPress = false;
    };
});

const handleMouseDown = (e) => {
    isMouseDown = true;
    const allLetters = document.querySelectorAll('.letter');
    if (e.target.classList.contains('letter')) {
        if (!isCtrlPress && firstDraggedElements.length < 1 && secondDraggedElements.length < 1) {
            allLetters.forEach(l => l.classList.remove('dragging'));
            allLetters.forEach(l => l.classList.remove('selected'));
        };
        
        if (firstDraggedElements.find(elem => elem.el === e.target) ||
            secondDraggedElements.find(elem => elem.el === e.target)) {
            if (isCtrlPress) {
                e.target.classList.toggle('dragging');
                e.target.classList.toggle('selected');
                firstDraggedElements = firstDraggedElements.filter(elem => elem.el !== e.target);
                secondDraggedElements = secondDraggedElements.filter(elem => elem.el !== e.target);
            };
        } else {
            e.target.classList.toggle('dragging');
            e.target.classList.add('selected');
            addNewEl(e.target, firstDraggedElements);
        };
        
        firstDraggedElements.forEach(elem => {
            elem.relDispX = e.clientX - elem.startSelectionX;
            elem.relDispY = e.clientY - elem.startSelectionY;
        });
        secondDraggedElements.forEach(elem => {
            elem.relDispX = e.clientX - elem.startSelectionX;
            elem.relDispY = e.clientY - elem.startSelectionY;
        });

        selectedElements = [...firstDraggedElements, ...secondDraggedElements];

    const allSelLet = Array.from(document.querySelectorAll('.selected'));

        if (allSelLet.length > 0) {
            const noDrSelEl = allSelLet.filter(elem => !elem.classList.contains('dragging'));
            
            noDrSelEl.forEach(l => l.classList.remove('selected'));
        };

    } else {
        if (!isCtrlPress) {
            allLetters.forEach(l => l.classList.remove('dragging'));
        allLetters.forEach(l => l.classList.remove('selected'));
        firstDraggedElements = [];
        selectedElements = [];
        };
        finishedSelect = false;
    };
    startSelAreaX = e.clientX;
    startSelAreaY = e.clientY;
    
};

const handleMouseMove = (e) => {
    if (isMouseDown && selectedElements.length > 0 && !isCtrlPress && finishedSelect) {
        selectedElements.forEach(elem => {
            const deltaX = e.clientX - elem.relDispX + elem.translateX - elem.startSelectionX;
            const deltaY = e.clientY - elem.relDispY + elem.translateY - elem.startSelectionY + 20;
            elem.el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            elem.el.style.pointerEvents = 'none';
        });
    };

    if (isMouseDown && !finishedSelect) { 
        finishSelAreaX = e.clientX;
        finishSelAreaY = e.clientY;

        const allLetters = document.querySelectorAll('.letter');
        allLetters.forEach(elem => {
            const posElem = elem.getBoundingClientRect();
            const leftElem = posElem.left;
            const topElem = posElem.top;
            if (
                (leftElem >= startSelAreaX && leftElem <= finishSelAreaX &&
                    topElem >= startSelAreaY && topElem <= finishSelAreaY) ||
                (leftElem <= startSelAreaX && leftElem >= finishSelAreaX &&
                    topElem >= startSelAreaY && topElem <= finishSelAreaY) ||
                (leftElem >= startSelAreaX && leftElem <= finishSelAreaX &&
                    topElem <= startSelAreaY && topElem >= finishSelAreaY) ||
                (leftElem <= startSelAreaX && leftElem >= finishSelAreaX &&
                    topElem <= startSelAreaY && topElem >= finishSelAreaY)
            ) {
                if (!secondDraggedElements.find(el => el.el === elem)) {
                    elem.classList.add('selected');
                    elem.classList.add('dragging');
                    addNewEl(elem, secondDraggedElements);
            secondDraggedElements.forEach(elem => {
            elem.relDispX = leftElem - elem.startSelectionX;
            elem.relDispY = topElem - elem.startSelectionY;
            });
                };
            } else {
                if (!firstDraggedElements.some(el => el.el === elem)) {
                    elem.classList.remove('selected');
                    elem.classList.remove('dragging');
                    secondDraggedElements = secondDraggedElements.filter(el => el.el !== elem);
                }
            };
        selectedElements = [...firstDraggedElements, ...secondDraggedElements];
        });
    };
};

const handleMouseUp = (e) => {
    if (!isCtrlPress && finishedSelect) { 
        const allLetters = document.querySelectorAll('.letter');
    if (allLetters.length > 0) { 
        allLetters.forEach(l => l.classList.remove('dragging'));
        firstDraggedElements = [];
        secondDraggedElements = [];
        };
        if (e.target.classList.contains('letter') || e.target.classList.contains('bold')) {
            selectedElements = selectedElements.reduce((arr, elem) => {
                if (arr.length === 0) {
                    return [elem]
                } else if (arr.length > 0 && !arr.some(el => el.el === elem.el)) {
                    return [...arr, elem]
                } else {
                    return [...arr]
                }
            }, []);
            rendNewSpan();
        };
    };
    isMouseDown = false;
    finishedSelect = true;
    selectedElements.forEach(elem => {
        elem.el.style.pointerEvents = 'auto';
    });
    selectedElements = [];
};

const handelHoverSpan = (e) => {
    lastActSp = e.target;
};

const rendNewSpan = () => {
    const idActSp = lastActSp.getAttribute('id');
    const actSp = document.getElementById(`${idActSp}`);
    selectedElements.forEach(elem => {
        const l = elem.el.textContent;
        const g = '&nbsp;';
        const span = document.createElement('span');
        span.setAttribute('id', `${Math.floor(Math.random() * 1000000000000)}`);
        span.classList.add('letter');
        span.classList.add('selected');
        if (actSp.hasAttribute('style')) {
            const translate = actSp.getAttribute('style').match(/-?\d+/g);
            if (translate && translate.length > 0) {
                const translateX = Number(translate[0]);
                const translateY = Number(translate[1]);
                span.style.transform = `translate(${translateX}px, ${translateY}px)`;
            };
        };

        span.innerHTML = l === ' ' ? g : l;
        span.addEventListener('mouseover', handelHoverSpan);
        actSp.after(span);
        const idOldEl = elem.el.id;
        const oldEl = document.getElementById(`${idOldEl}`);
        oldEl.remove();
    });
};

const addNewEl = (elem, draggedElements) => {
    if (elem.classList.contains('letter')) {
        let translateX = 0;
        let translateY = 0;
    
        const posElem = elem.getBoundingClientRect();
        const leftElem = posElem.left;
        const topElem = posElem.top;

        if (elem.hasAttribute('style')) {
            const translate = elem.getAttribute('style').match(/-?\d+/g);
            if (translate && translate.length > 0) {
                translateX = Number(translate[0]);
                translateY = Number(translate[1]);
            };
        };
        const drEl = {
            el: elem,
            startSelectionX: leftElem,
            startSelectionY: topElem,
            translateX: translateX,
            translateY: translateY,
            top: elem.offsetTop,
            left: elem.offsetLeft
        };

        draggedElements.push(drEl);
        draggedElements.sort((a, b) => b.left - a.left);
        draggedElements.sort((a, b) => b.top - a.top);
    }
};

window.addEventListener('mousedown', handleMouseDown);
window.addEventListener('mousemove', handleMouseMove);
window.addEventListener('mouseup', handleMouseUp);

