const firInp = document.querySelector('.firstInput');
const secInp = document.querySelector('.secondInput');
const button = document.querySelector('.button');
const text = document.querySelector('.text');

let isCtrlPress = false;
let startSelectionX = 0;
let startSelectionY = 0;
let draggedElements = [];
let isMouseDown = false;


const reorgStr = (str) => {
    const g = '&nbsp;';
    const arrLetters = str.split("");
    const reorgArrLet = arrLetters.map(l => {
        return l === ' ' ? `<span class="letter">${g}</span>` : `<span class="letter">${l}</span>`
    });
    return reorgArrLet.join('');
};

const handelBut = () => { 
    const fInpVal = firInp.value.trim();
    const sInpVal = secInp.value.trim();
    if (fInpVal !== '' || sInpVal !== '') {
        let newText = '';
        if (fInpVal === '') {
            
            newText = `<p><b>Second Input:</b> ${reorgStr(sInpVal)}</p>`;
        } else if (sInpVal === '') {
            newText = `<p><b>First Input:</b> ${reorgStr(fInpVal)}</p>`;
            
        } else {
            newText = `
            <p><b>First Input:</b> ${reorgStr(fInpVal)}</p>
            <p><b>Second Input:</b> ${reorgStr(sInpVal)}</p>`;
        }
        text.insertAdjacentHTML("beforeend", `${newText}`);
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
            draggedElements = [];
        };
        e.target.classList.toggle('dragging');

        let translateX = 0;
        let translateY = 0;

        if (e.target.hasAttribute('style')) { 
            const translate = e.target.getAttribute('style').match(/-?\d+/g);
            console.log(e.target.getAttribute('style'));
            console.log('translate: ', translate);
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
        isMouseDown = true;
        draggedElements.forEach(elem => {
            elem.relDispX = e.clientX - elem.startSelectionX;
            elem.relDispY = e.clientY - elem.startSelectionY;
        });
    };
};

const handleMouseMove = (e) => {
    if (isMouseDown && draggedElements.length > 0 && !isCtrlPress) {
        draggedElements.forEach(elem => {
            const deltaX = e.clientX - elem.relDispX + elem.translateX - elem.startSelectionX;
            console.log('deltaX: ', deltaX);
            console.log('e.clientX: ', e.clientX);
            console.log('elem.relDispX: ', elem.relDispX);
            console.log('elem.translateX: ', elem.translateX);
            console.log('elem.startSelectionX: ', elem.startSelectionX);
            const deltaY = e.clientY - elem.relDispY + elem.translateY - elem.startSelectionY;
            elem.el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
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
    isMouseDown = false;
    };
};

text.addEventListener('mousedown', handleMouseDown);
text.addEventListener('mousemove', handleMouseMove);
text.addEventListener('mouseup', handleMouseUp);

