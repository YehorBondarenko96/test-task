const firInp = document.querySelector('.firstInput');
const secInp = document.querySelector('.secondInput');
const button = document.querySelector('.button');
const text = document.querySelector('.text');

let isCtrlPress = false;
let startSelectionX = 0;
let startSelectionY = 0;
let draggedElements = [];
let selectedElements = [];
let isMouseDown = false;
let lastActSp = null;


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


const handelBut = () => { 
    const fInpVal = firInp.value.trim();
    const sInpVal = secInp.value.trim();
    const id = Math.floor(Math.random()*1000000000);
    if (fInpVal !== '' || sInpVal !== '') {
        let newText = null;
        if (fInpVal === '') {
            newText = document.createElement('div');
            newText.innerHTML = `<p id=${id}><b>Second Input:</b> </p>`;
            text.appendChild(newText);
            reorgStr(id, sInpVal);
        } else if (sInpVal === '') {
            newText = document.createElement('div');
            newText.innerHTML = `<p id=${id}><b>First Input:</b> </p>`;
            text.appendChild(newText);
            reorgStr(id, fInpVal);
        } else {
            newText = document.createElement('div');
            newText.innerHTML = `
            <p id=${id}><b>First Input:</b> </p>
            <p id=${id + 1234567}><b>Second Input:</b> </p>`;
            text.appendChild(newText);
            reorgStr(id, fInpVal);
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
    const allLetters = document.querySelectorAll('.letter');
    if (e.target.classList.contains('letter')) {
        if (!isCtrlPress && draggedElements.length < 1) {
            allLetters.forEach(l => l.classList.remove('dragging'));
            allLetters.forEach(l => l.classList.remove('selected'));
            selectedElements = [];
        };
        
        if (draggedElements.find(elem => elem.el === e.target)) {
            if (isCtrlPress) {
                e.target.classList.toggle('dragging');
                e.target.classList.toggle('selected');
                draggedElements = draggedElements.filter(elem => elem.el !== e.target);
            };
        } else {
            e.target.classList.toggle('dragging');
            e.target.classList.add('selected');
            let translateX = 0;
            let translateY = 0;

            if (e.target.hasAttribute('style')) { 
                const translate = e.target.getAttribute('style').match(/-?\d+/g);
                translateX = Number(translate[0]);
                translateY = Number(translate[1]);
            };

            const drEl = {
            el: e.target,
            startSelectionX: e.clientX,
            startSelectionY: e.clientY,
            translateX: translateX,
            translateY: translateY
            };

            draggedElements.push(drEl);
            draggedElements.sort((a, b) => a.startSelectionY - b.startSelectionY);
            draggedElements.sort((a, b) => a.startSelectionX - b.startSelectionX);
        };
        
        isMouseDown = true;
        draggedElements.forEach(elem => {
            elem.relDispX = e.clientX - elem.startSelectionX;
            elem.relDispY = e.clientY - elem.startSelectionY;
        });

        selectedElements = [...draggedElements];

    const allSelLet = Array.from(document.querySelectorAll('.selected'));

        if (allSelLet.length > 0) {
            const noDrSelEl = allSelLet.filter(elem => !elem.classList.contains('dragging'));
            
            noDrSelEl.forEach(l => l.classList.remove('selected'));
        };

    } else {
        allLetters.forEach(l => l.classList.remove('dragging'));
        allLetters.forEach(l => l.classList.remove('selected'));
        draggedElements = [];
        selectedElements = [];
    };
};

const handleMouseMove = (e) => {
    if (isMouseDown && selectedElements.length > 0 && !isCtrlPress) {
        selectedElements.forEach(elem => {
            const deltaX = e.clientX - elem.relDispX + elem.translateX - elem.startSelectionX;
            const deltaY = e.clientY - elem.relDispY + elem.translateY - elem.startSelectionY;
            elem.el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            elem.el.style.pointerEvents = 'none';
        });
    };
};

const handleMouseUp = () => {
    if (!isCtrlPress) { 
        const allLetters = document.querySelectorAll('.letter');
    if (allLetters.length > 0) { 
        allLetters.forEach(l => l.classList.remove('dragging'));
        draggedElements = [];
        };
        rendNewSpan();
    };
    isMouseDown = false;
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
        span.innerHTML = l === ' ' ? g : l;
        span.addEventListener('mouseover', handelHoverSpan);
        console.log(actSp);
    });
};

text.addEventListener('mousedown', handleMouseDown);
text.addEventListener('mousemove', handleMouseMove);
text.addEventListener('mouseup', handleMouseUp);

