## [2026-08-12] GNB 드롭다운 키보드 접근성 개선

### 진행상황
- [x] 데스크톱 GNB 드롭다운에 `:focus-within` 추가 — 키보드(Tab)만으로 하위 메뉴 접근 가능
- [x] `aria-haspopup`/`aria-expanded`/`role=menu,menuitem` 속성 추가 (스크린리더 지원)
- [x] 모바일 드로어 아코디언 버튼에 `aria-expanded`/`aria-controls` 추가
- [x] URL 마스킹 여부 점검 — 방문자에게는 label/title만 노출되고 href는 표준 방식대로만 사용 중이라 별도 수정 불필요로 판단

### 결과
- 외부에서 받은 개선 요청 문서가 React/Next.js 기준으로 작성되어 그대로 적용 불가 → 실제 스택(바닐라 JS)에 맞게 의도를 재해석해 적용
- 변경된 파일: [menu.js](menu.js), [styles.css](styles.css)

---

## [2026-08-12] 관리자 메뉴 관리 URL 자동완성 개선

### 진행상황
- [x] 관리자가 "교회 일정"(schedule.html) 메뉴를 직접 추가·저장 완료 (전체 저장 기능 정상 작동 확인)
- [x] 메뉴 관리 탭의 URL 입력창에 datalist 자동완성 추가 — 홈/교회소개/교회일정/앨범/주보/부서별 페이지를 클릭으로 선택 가능, 직접 입력도 계속 지원
- [ ] 연혁(`church_history`)·섬김이(`serving_team` 테스트데이터 "ㅇㅇㅇ") 실제 정보 입력

### 결과
- 사용자가 매번 `about.html`, `department.html?slug=...` 같은 정확한 URL을 외워서 입력해야 하는 번거로움을 datalist 기반 자동완성으로 해결. 부서 목록은 `departments` 테이블에서 동적으로 불러와 옵션에 자동 반영됨.
- 변경된 파일: [admin/index.html](admin/index.html)
- GitHub 커밋 `1c22b7c` 푸시 → Vercel 자동 배포 확인 완료

---

## [2026-08-12] 청주 온누리감리교회 홈페이지 구축 및 고도화

### 진행상황
- [x] Supabase 연동 및 Vercel 배포 파이프라인 구축 (GitHub push 자동 반영)
- [x] Supabase CLI 마이그레이션 자동화 (`supabase db push`)
- [x] 공개 페이지 8종 제작: 홈/앨범/주보/부서소개/일정/교회소개/관리자/템플릿
- [x] 관리자 CMS 11개 탭 구축 (문구/앨범/주보/메뉴/테마/설교영상/팝업/부서/일정/교회소개관리)
- [x] 메가메뉴, 사이트맵 모달, 모바일 드로어, 하단 고정 네비 구현
- [x] 사이트 커스터마이징(배너색/폰트/히어로스타일/배경사진) 구현
- [x] 유튜브 설교 자동 동기화, 이미지 압축, 주보 OCR 일괄업로드 구현
- [x] 카카오맵/네이버맵 연동, 스크롤 애니메이션, SEO 메타태그 적용
- [ ] 관리자가 메뉴 관리 탭에서 "교회소개"/"교회 일정" 링크 추가 및 저장 (안내 완료, 미실행)
- [ ] 연혁/섬김이/일정 테스트 데이터를 실제 정보로 교체

### 결과
- 청주 온누리감리교회 자체 홈페이지가 없어서 바닐라 HTML/CSS/JS + Supabase 조합으로 신규 구축. 이후 여러 교회 사이트 UI/UX를 구조적으로 참고(실명 콘텐츠 미복제)하여 디자인·기능을 지속 고도화함.
- 전체 작업 상세 내역: [개발_작업내역.md](개발_작업내역.md)
- 배포: https://onnuri-church-nu.vercel.app/ · 저장소: https://github.com/choenhoyung/onnuri-church
