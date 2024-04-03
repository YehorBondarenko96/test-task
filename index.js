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


const reorgStr = (str) => {
    const pText = document.querySelector('.pText');
    const g = '&nbsp;';
    const arrLetters = str.split("");
    const reorgArrLet = arrLetters.map(l => {
        const span = document.createElement('span');
        span.classList.add('letter');
        span.innerHTML = l === ' ' ? g : l;
        span.addEventListener('mouseover', () => {
            console.log('Курсор наведено на <span>!');
        });
        console.log(1);
        pText.appendChild(span);
        // return span.outerHTML;
    });
    // return
    // reorgArrLet.join('');
};


const handelBut = () => { 
    const fInpVal = firInp.value.trim();
    const sInpVal = secInp.value.trim();
    const id = Math.floor(Math.random()*1000000000);
    console.log('id: ', id);
    if (fInpVal !== '' || sInpVal !== '') {
        let newText = null;
        if (fInpVal === '') {
            newText = document.createElement('p');
            newText.innerHTML = `<p class="pText"><b>Second Input:</b> </p>`
            // newText = `<p><b>Second Input:</b> ${reorgStr(sInpVal)}</p>`;
        } else if (sInpVal === '') {
            // newText = `<b>First Input:</b> ${reorgStr(document.createElement('p'), fInpVal)}`;
            
        } else {
            newText = `
            <p><b>First Input:</b> ${reorgStr(fInpVal)}</p>
            <p><b>Second Input:</b> ${reorgStr(sInpVal)}</p>`;
        }
        text.appendChild(newText);
        reorgStr(sInpVal);
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
            e.target.classList.toggle('selected');
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

            draggedElements.push(drEl)
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
    };
    isMouseDown = false;
    selectedElements = [];
};

text.addEventListener('mousedown', handleMouseDown);
text.addEventListener('mousemove', handleMouseMove);
text.addEventListener('mouseup', handleMouseUp);

