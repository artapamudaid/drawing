const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const backgroundImage = document.getElementById('backgroundImage');
const penToolButton = document.getElementById('penTool');
const undoButton = document.getElementById('undo');
const downloadButton = document.getElementById('download');
let isPenToolActive = false;
let isDrawing = false;
let points = [];
let currentStep = -1;

backgroundImage.onload = function() {
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
};

canvas.addEventListener('mousedown', (e) => {
    if (isPenToolActive) {
        isDrawing = true;
        points.push([]);
        currentStep++;
    }
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    if (isPenToolActive) {
        points[currentStep] = points[currentStep].slice(); // Clone the points array
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    if (isPenToolActive) {
        const x = e.clientX - canvas.offsetLeft;
        const y = e.clientY - canvas.offsetTop;
        points[currentStep].push({ x, y });

        context.lineWidth = 2;
        context.lineCap = 'round';
        context.strokeStyle = 'black';

        if (points[currentStep].length > 1) {
            context.beginPath();
            context.moveTo(points[currentStep][points[currentStep].length - 2].x, points[currentStep][points[currentStep].length - 2].y);
            context.lineTo(x, y);
            context.stroke();
        }
    }
});

penToolButton.addEventListener('click', () => {
    isPenToolActive = true;
    isDrawing = false;
});

undoButton.addEventListener('click', () => {
    if (currentStep >= 0) {
        points.pop(); // Remove the last step
        currentStep--;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        for (let i = 0; i <= currentStep; i++) {
            drawStep(points[i]);
        }
    }
});

downloadButton.addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/png');
    downloadButton.href = dataURL;
});

function drawStep(step) {
    for (let i = 1; i < step.length; i++) {
        context.lineWidth = 2;
        context.lineCap = 'round';
        context.strokeStyle = 'black';
        context.beginPath();
        context.moveTo(step[i - 1].x, step[i - 1].y);
        context.lineTo(step[i].x, step[i].y);
        context.stroke();
    }
}