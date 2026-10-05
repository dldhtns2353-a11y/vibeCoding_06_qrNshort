const longUrlInput = document.getElementById('long-url');
const shortUrlInput = document.getElementById('short-url');
const shortenBtn = document.getElementById('shorten-btn');
const copyBtn = document.getElementById('copy-btn');
const toast = document.getElementById('toast');

// Enable/disable button based on input
longUrlInput.addEventListener('input', () => {
    if (longUrlInput.value.trim() !== '') {
        shortenBtn.removeAttribute('disabled');
    } else {
        shortenBtn.setAttribute('disabled', 'true');
    }
});

// Shorten URL
shortenBtn.addEventListener('click', async () => {
    const url = longUrlInput.value.trim();
    if (!url) return;
    
    shortenBtn.textContent = '단축 중...';
    shortenBtn.disabled = true;
    
    try {
        // TinyURL API bypassed via allorigins CORS proxy to support all URLs (even fake domains)
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent('https://tinyurl.com/api-create.php?url=' + encodeURIComponent(url))}`;
        const response = await fetch(proxyUrl);
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        if (data.contents && data.contents.startsWith('http')) {
            shortUrlInput.value = data.contents;
        } else {
            alert('URL 단축에 실패했습니다. 올바른 URL인지 확인해주세요.');
        }
    } catch (error) {
        console.error('Error shortening URL:', error);
        alert('오류가 발생했습니다. 네트워크 상태를 확인하시거나 잠시 후 다시 시도해주세요.');
    } finally {
        shortenBtn.textContent = '단축하기';
        shortenBtn.disabled = false;
    }
});

// Copy to clipboard
copyBtn.addEventListener('click', () => {
    if (!shortUrlInput.value) return;
    
    navigator.clipboard.writeText(shortUrlInput.value)
        .then(() => {
            showToast();
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            alert('복사에 실패했습니다.');
        });
});

// Show toast notification
function showToast() {
    toast.className = 'toast show';
    setTimeout(() => {
        toast.className = toast.className.replace('show', '');
    }, 3000);
}
