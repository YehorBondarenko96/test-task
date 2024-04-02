const firInp = document.querySelector('.firstInput');
const secInp = document.querySelector('.secondInput');
const button = document.querySelector('.button');
const text = document.querySelector('.text');

let isMouseDown = false;
let startSelectionX = 0;
let startSelectionY = 0;
let draggedElement = null;

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
window.addEventListener('keypress', e => { 
    if (e.key === 'Enter') {
        handelBut();
    };
});

const handleMouseDown = (e) => {
    if (event.target.classList.contains('letter')) {
        isMouseDown = true;
        draggedElement = e.target;
        startSelectionX = e.clientX;
        startSelectionY = e.clientY;
        draggedElement.classList.add('dragging');
    }
};

const handleMouseUp = (e) => {
    if (isMouseDown && draggedElement) {
        isMouseDown = false;
        draggedElement.classList.remove('dragging');
        draggedElement.style.transform = '';
        const elementsUnderCursor = document.elementsFromPoint(e.clientX, e.clientY);
        const dropTarget = elementsUnderCursor.find(element => element !== draggedElement && element.classList.contains('letter'));
        if (dropTarget) {
            text.insertBefore(draggedElement, dropTarget);
        } else {
            text.appendChild(draggedElement);
        }
        draggedElement = null;
    }
};

const handleMouseMove = (e) => {
    if (isMouseDown && draggedElement) {
        const deltaX = e.clientX - startSelectionX;
        const deltaY = e.clientY - startSelectionY;
        const rect = draggedElement.getBoundingClientRect();
        draggedElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    }
};

text.addEventListener('mousedown', handleMouseDown);
text.addEventListener('mousemove', handleMouseMove);
text.addEventListener('mouseup', handleMouseUp);