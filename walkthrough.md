# QR 코드 생성기 프로젝트 코드 워크스루

이 문서는 QR 코드 생성기 웹 애플리케이션의 핵심 로직과 파일들이 어떻게 상호작용하며 동작하는지 상세하게 설명합니다.

---

## 1. 프로젝트 구조

프로젝트는 3개의 핵심 파일로 구성되어 있습니다.
- `index.html`: 웹 페이지의 뼈대와 마크업
- `style.css`: UI/UX 디자인 및 애니메이션 효과
- `script.js`: QR 코드 생성 로직 및 인터랙티브 효과 처리

---

## 2. 뼈대 구성: `index.html`

`index.html`은 웹 브라우저가 화면을 그리기 위해 가장 먼저 읽는 파일입니다.

```html
<!-- 상단 로고 영역 -->
<header>
    <img src="img/logo.png" alt="Logo" class="logo">
</header>

<!-- 메인 컨텐츠 영역 -->
<main class="container">
    <!-- QR 코드가 생성되어 나타날 공간 (초기엔 투명하게 숨겨져 있음) -->
    <div id="qr-container">
        <div id="qrcode" title="클릭하여 다운로드"></div>
        <p class="instruction">QR 코드를 클릭하여 JPG로 다운로드하세요</p>
    </div>

    <!-- URL을 입력받는 공간 (초기 화면 중앙) -->
    <div class="input-container" id="input-container">
        <input type="text" id="url-input" placeholder="URL을 입력하세요 (예: https://example.com)" />
        <button id="generate-btn">생성</button>
    </div>
</main>
```

- **외부 라이브러리 연동**: 하단에서 `<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>`를 통해 QR 코드를 쉽게 그려주는 외부 라이브러리를 불러옵니다.

---

## 3. 아름다운 디자인과 애니메이션: `style.css`

사용자 경험을 극대화하기 위해 다이내믹한 배경과 부드러운 애니메이션을 적용했습니다.

### 3.1. 동적 그라데이션 배경
마우스 커서를 따라다니는 배경을 위해 `:before` 가상 요소를 활용합니다.
```css
body::before {
    /* 마우스 위치(--mouse-x, --mouse-y)를 실시간으로 받아와 그라데이션의 중심점을 변경 */
    background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
                                rgba(255, 182, 193, 0.4), 
                                rgba(173, 216, 230, 0.3), transparent 60%);
    /* 애니메이션이 뚝뚝 끊기지 않고 부드럽게 이어지도록 처리 */
    transition: background 0.1s ease;
}
```

### 3.2. 상태 변화 애니메이션 (QR 생성 시)
사용자가 URL을 입력하고 '생성'을 누르면 `<body>` 태그에 `.generated` 클래스가 추가됩니다. CSS는 이 클래스가 추가되었을 때 레이아웃을 부드럽게 바꿉니다.

```css
/* QR 생성이 완료되면 입력창을 200px 아래로 부드럽게 이동시킴 */
body.generated .input-container {
    top: calc(50% + 200px); 
}

/* 숨겨져 있던 QR 코드 영역이 서서히 나타남 */
body.generated #qr-container {
    opacity: 1;
    visibility: visible;
    transform: translate(-50%, -50%) scale(1);
}
```

---

## 4. 핵심 로직 제어: `script.js`

`script.js`는 웹페이지에 생명력을 불어넣는 역할을 합니다. 크게 세 부분으로 나뉩니다.

### 4.1. QR 코드 생성 로직
'생성' 버튼 클릭이나 'Enter' 키 입력 시 동작합니다.
```javascript
function generateQR() {
    const url = urlInput.value.trim(); // 1. 입력된 URL 가져오기
    if (!url) { return alert('URL을 입력해주세요.'); }

    qrcodeElement.innerHTML = ''; // 2. 기존 QR 초기화
    
    // 3. qrcode.js 라이브러리를 사용하여 새로운 QR 코드 그리기
    qrcode = new QRCode(qrcodeElement, {
        text: url,
        width: 256,
        height: 256,
        colorDark : "#1e293b",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    // 4. body에 'generated' 클래스를 추가하여 CSS 애니메이션 트리거
    document.body.classList.add('generated');
}
```

### 4.2. 마우스 추적 (배경 이펙트)
화면 위에서 마우스가 움직일 때마다 위치를 계산하여 CSS에게 알려줍니다.
```javascript
document.addEventListener('mousemove', (e) => {
    // 화면 전체 너비/높이 대비 마우스의 현재 위치를 퍼센트(%)로 계산
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    
    // 계산된 값을 CSS 변수로 전달
    document.documentElement.style.setProperty('--mouse-x', `${x}%`);
    document.documentElement.style.setProperty('--mouse-y', `${y}%`);
});
```

### 4.3. QR 코드 JPG 다운로드
생성된 QR을 이미지로 저장하는 기능입니다. PNG 투명 배경으로 저장되면 인식률이 떨어질 수 있어, 강제로 흰색 배경을 칠한 JPG로 변환하여 다운로드합니다.
```javascript
function downloadImage(dataUrl) {
    const canvas = document.createElement('canvas'); // 가상의 도화지 생성
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = function() {
        // 도화지에 흰색 배경을 칠함
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 흰색 배경 위에 QR 코드 이미지를 그림
        ctx.drawImage(img, padding, padding);
        
        // 최종 합성된 이미지를 JPG 형태의 URL로 변환
        const jpegUrl = canvas.toDataURL('image/jpeg', 1.0);
        
        // 가상의 <a> 링크 태그를 만들어 다운로드 실행
        const a = document.createElement('a');
        a.href = jpegUrl;
        a.download = 'qrcode.jpg';
        a.click();
    };
    img.src = dataUrl;
}
```
