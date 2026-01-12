const firebaseConfig = { databaseURL: "https://m-legacy-5cf2b-default-rtdb.firebaseio.com/" };
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const mover = document.getElementById('canvas-mover');
const mCanvas = document.getElementById('mainCanvas');
const mCtx = mCanvas.getContext('2d');

mCanvas.width = 32000; mCanvas.height = 32000;
let scale = 0.04, posX = 0, posY = 0, isDragging = false, startX, startY;
let pixelData = {};

function drawGrid() {
    mCtx.strokeStyle = "#DDD"; mCtx.lineWidth = 0.5 / scale;
    for(let x=0; x<=32000; x+=200){ mCtx.beginPath(); mCtx.moveTo(x,0); mCtx.lineTo(x,32000); mCtx.stroke(); }
    for(let y=0; y<=32000; y+=200){ mCtx.beginPath(); mCtx.moveTo(0,y); mCtx.lineTo(32000,y); mCtx.stroke(); }
}

function updatePos() { mover.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`; }
updatePos();

document.getElementById('pixel-viewport').onwheel = (e) => {
    e.preventDefault();
    scale *= e.deltaY > 0 ? 0.9 : 1.1;
    scale = Math.max(0.015, Math.min(scale, 1.5));
    updatePos(); render();
};

document.getElementById('pixel-viewport').onmousedown = (e) => { isDragging = true; startX = e.clientX-posX; startY = e.clientY-posY; };
window.onmouseup = () => isDragging = false;
window.onmousemove = (e) => { if (isDragging) { posX = e.clientX - startX; posY = e.clientY - startY; updatePos(); } };

function render() {
    mCtx.clearRect(0,0,32000,32000); drawGrid();
    Object.keys(pixelData).forEach(id => {
        let p = pixelData[id], img = new Image(); img.src = p.imageUrl;
        img.onload = () => mCtx.drawImage(img, ((id-1)%160)*200, Math.floor((id-1)/160)*200, 200, 200);
    });
}
db.ref('pixels').on('value', s => { pixelData = s.val() || {}; render(); });
