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
    const arrLetters = str.split("").map(l => `<span class="letter">${l}</span>`);
    return arrLetters.join('');
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
            const translate = e.target.getAttribute('style').match(/\d+/g);
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
    };
};

const handleMouseMove = (e) => {
    if (isMouseDown && draggedElements.length > 0 && !isCtrlPress) {
        draggedElements.forEach(elem => {
            const deltaX = e.clientX + (e.clientX - elem.startSelectionX) + elem.translateX - elem.startSelectionX;
            const deltaY = e.clientY + (e.clientY - elem.startSelectionY) + elem.translateY - elem.startSelectionY;
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

