const urlInput = document.getElementById('url-input');
const generateBtn = document.getElementById('generate-btn');
const qrcodeElement = document.getElementById('qrcode');
let qrcode = null;

generateBtn.addEventListener('click', generateQR);
urlInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        generateQR();
    }
});

function generateQR() {
    const url = urlInput.value.trim();
    if (!url) {
        alert('URL을 입력해주세요.');
        return;
    }

    // Clear previous QR code
    qrcodeElement.innerHTML = '';
    
    // Generate new QR code
    qrcode = new QRCode(qrcodeElement, {
        text: url,
        width: 256,
        height: 256,
        colorDark : "#1e293b", // Slate 800 for better aesthetic
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    // Trigger animations
    document.body.classList.add('generated');
}

// Download QR code on click
qrcodeElement.addEventListener('click', function() {
    const img = qrcodeElement.querySelector('img');
    const canvas = qrcodeElement.querySelector('canvas');
    
    if (img && img.src && img.src.startsWith('data:image')) {
        downloadImage(img.src);
    } else if (canvas) {
        const imageURL = canvas.toDataURL("image/jpeg", 1.0);
        downloadImage(imageURL);
    } else {
        // Fallback if image generation takes a moment
        setTimeout(() => {
            const imgEl = qrcodeElement.querySelector('img');
            if (imgEl && imgEl.src) downloadImage(imgEl.src);
        }, 100);
    }
});

function downloadImage(dataUrl) {
    // Create a new canvas to ensure white background (JPEG doesn't support transparency)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = function() {
        // Add padding around the QR code for better scanning and aesthetics
        const padding = 20;
        canvas.width = img.width + (padding * 2);
        canvas.height = img.height + (padding * 2);
        
        // Fill white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw the QR code with padding
        ctx.drawImage(img, padding, padding);
        
        const jpegUrl = canvas.toDataURL('image/jpeg', 1.0);
        
        const a = document.createElement('a');
        a.href = jpegUrl;
        a.download = 'qrcode.jpg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
    img.src = dataUrl;
}

// Add mouse tracking for dynamic background gradient
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--mouse-x', `${x}%`);
    document.documentElement.style.setProperty('--mouse-y', `${y}%`);
});
