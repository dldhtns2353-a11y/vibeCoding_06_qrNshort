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
        // 1차 시도: allorigins 프록시 + TinyURL (가장 호환성이 높으나 프록시 서버가 불안정할 수 있음)
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent('https://tinyurl.com/api-create.php?url=' + encodeURIComponent(url))}`;
        
        // 8초 타임아웃
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        const response = await fetch(proxyUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        if (data.contents && data.contents.startsWith('http')) {
            shortUrlInput.value = data.contents;
            shortenBtn.textContent = '단축하기';
            shortenBtn.disabled = false;
            return; // 성공 시 종료
        }
        throw new Error('Invalid URL');
    } catch (error) {
        console.warn('1차 API 실패, 2차 API(is.gd JSONP) 시도...', error);
        
        // 2차 시도: is.gd API with JSONP (프록시 없이 직접 통신하나 일부 URL을 거부할 수 있음)
        const callbackName = 'isgdCallback_' + Math.round(100000 * Math.random());
        
        const jsonpTimeoutId = setTimeout(() => {
            if (window[callbackName]) {
                alert('URL 단축에 실패했습니다. (유효하지 않은 주소이거나 일시적인 네트워크 오류입니다.)');
                shortenBtn.textContent = '단축하기';
                shortenBtn.disabled = false;
                delete window[callbackName];
                
                const scriptElement = document.getElementById(callbackName);
                if (scriptElement) document.body.removeChild(scriptElement);
            }
        }, 5000); // 5초 타임아웃

        window[callbackName] = function(data) {
            clearTimeout(jsonpTimeoutId);
            delete window[callbackName];
            const scriptElement = document.getElementById(callbackName);
            if (scriptElement) document.body.removeChild(scriptElement);
            
            if (data && data.shorturl) {
                shortUrlInput.value = data.shorturl;
            } else {
                alert('URL 단축에 실패했습니다. 정확한 URL인지 확인해주세요.');
            }
            shortenBtn.textContent = '단축하기';
            shortenBtn.disabled = false;
        };
        
        const script = document.createElement('script');
        script.id = callbackName;
        script.src = `https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}&callback=${callbackName}`;
        
        script.onerror = function() {
            clearTimeout(jsonpTimeoutId);
            alert('오류가 발생했습니다. 네트워크 상태를 확인해주세요.');
            shortenBtn.textContent = '단축하기';
            shortenBtn.disabled = false;
            delete window[callbackName];
        };
        
        document.body.appendChild(script);
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
