# QR 코드 생성기 작업 목록 (Task List)

QR 코드 생성기 웹 애플리케이션을 개발하면서 완료된 상세 작업 내역입니다.

## 1. 초기 설정 및 뼈대 구성
- [x] 프로젝트 디렉토리 내 필수 파일 생성 (`index.html`, `style.css`, `script.js`)
- [x] `index.html` 기본 HTML5 구조 작성 및 외부 리소스(CSS, JS, 웹 폰트) 링크 연결
- [x] CDN을 통한 `qrcode.js` 라이브러리 스크립트 태그 추가

## 2. 레이아웃 및 기본 UI 요소 구현
- [x] 화면 상단 좌측에 제공된 로고(`img/logo.png`) 이미지 배치
- [x] 화면 정중앙에 사용자 입력 폼(URL 입력창 및 '생성' 버튼) 초기 위치 설정
- [x] QR 코드가 나타날 컨테이너 영역 구성 및 초기 상태에서 보이지 않도록 숨김 처리
- [x] 입력창과 버튼의 모서리 둥글기(border-radius), 여백(padding), 그림자(box-shadow) 등 현대적인 웹 스타일 적용

## 3. 핵심 기능 (JavaScript) 연동
- [x] '생성' 버튼 클릭 및 입력창 내부 `Enter` 키 입력 이벤트 리스너 추가
- [x] 입력된 URL 값이 없을 때 경고창(Alert)을 띄우는 예외 처리
- [x] `qrcode.js`를 호출하여 입력받은 URL을 기반으로 `#qrcode` 요소 내부에 QR 코드 생성
- [x] QR 코드가 생성될 때마다 기존에 있던 QR 코드를 지우고 새로 그리도록 초기화 로직 추가

## 4. 인터랙션 및 애니메이션 추가
- [x] QR 코드가 성공적으로 생성되면 HTML `<body>`에 `.generated` 클래스를 부여하는 로직 추가
- [x] CSS 트랜지션을 사용하여 `.generated` 상태 시 중앙의 입력 폼이 화면 아래로 부드럽게 이동하도록 애니메이션 구현
- [x] 입력 폼이 이동한 후, 화면 정중앙에 생성된 QR 코드가 서서히(Fade-in) 나타나도록 트랜지션 처리

## 5. 이미지 다운로드 기능 고도화
- [x] 생성된 QR 코드 영역 클릭 시 다운로드 함수가 실행되도록 클릭 이벤트 바인딩
- [x] 단순 PNG 다운로드 시 투명 배경으로 인한 스캔 오류를 방지하기 위해, JavaScript 내에 가상의 `<canvas>` 렌더링 도입
- [x] 가상 캔버스에 흰색 배경(`ctx.fillStyle = '#FFFFFF'`)을 먼저 칠한 뒤, 그 위에 QR 이미지를 덮어쓰도록 처리
- [x] 최종 합성된 이미지를 `.jpg` 파일(`qrcode.jpg`)로 강제 다운로드시키는 로직 구현

## 6. 테마 및 시각 효과 (Visual Effects) 고도화
- [x] 전체 웹사이트 배경을 칙칙한 단색에서 밝고 화사한 선형 그라데이션(Linear Gradient)으로 변경
- [x] JavaScript에 `mousemove` 이벤트를 추가하여 사용자의 마우스 좌표 위치를 퍼센트(%) 값으로 실시간 계산
- [x] 계산된 마우스 위치를 CSS 변수(`--mouse-x`, `--mouse-y`)로 실시간 주입
- [x] CSS `::before` 가상 요소에 원형 방사형 그라데이션(Radial Gradient)을 적용하여, 파스텔 톤 색상이 마우스를 따라다니는 빛 번짐(Glow) 효과 완성

## 7. URL 단축 기능 (`urlShort/` 구현)
- [x] URL 단축 화면 UI 구성 (입력 필드, '단축하기' 버튼, 읽기 전용 결과 상자, '복사' 버튼)
- [x] 입력창의 값 유무에 따른 '단축하기' 버튼 활성화/비활성화 상태 제어 (disabled 속성 조작)
- [x] 클립보드 복사(Clipboard API) 및 '복사하였습니다' 팝업(Toast) 알림 구현
- [x] 무료 URL 단축 API(TinyURL, is.gd) 연동 및 CORS 우회를 위한 프록시 적용
- [x] **API 안정성 강화**: 1차 프록시 서버(TinyURL) 타임아웃 8초 설정 및 실패 시 2차(is.gd JSONP) 자동 전환하는 Dual-API Fallback 로직 완성

## 8. 최종 통합 및 오류 수정 (Troubleshooting)
- [x] 최상위 디렉토리에 허브 `index.html` 생성 및 `url2qr/`, `urlShort/` 독립 기능 폴더 라우팅 연결
- [x] GitHub Pages 배포 환경에서의 상위 폴더 이동(`../`) 라우팅 문제 수정
- [x] 브라우저 캐시로 인해 구버전 스크립트가 실행되는 문제를 방지하기 위한 Cache Busting (`script.js?v=2`) 강제 적용
