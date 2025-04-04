# 📚 Learn Alive - LMS 프로젝트

> 채용연계 풀스택 개발자 부트캠프(스프링&리액트) 27회차 최종 프로젝트  
> 팀명: **Learn-Alive**  
> 프로젝트 기간: 2025.04  
> 팀원: 김윤성(팀장), 노현주, 배한빈, 이나리, 유명식  

---

## 📌 프로젝트 소개

**Learn Alive**는 대학 및 직무 교육 현장에서 실제로 사용될 수 있는 개선된 **LMS(Learning Management System)** 웹 애플리케이션입니다.  
기존 LMS의 단점을 보완하고, 사용자 경험을 향상시키기 위해 **데이터 기반의 관리**, **시각화**, **출석/시험 자동화**, **역할 기반 권한 분리** 등을 주요 기능으로 구현하였습니다.

### 🎯 프로젝트 목적

- 교수자, 학습자, 관리자 각각의 역할을 명확히 구분하여 시스템 내 편의성 제공
- 기존 LMS에서 부족했던 **데이터 분석, 시각화, 자동화 기능** 강화
- LMS 내에서 대부분의 학습 및 관리가 가능하도록 **외부 도구 의존도 최소화**
- 실제 교육 현장에서 자주 사용되는 기능들(QR 출석, 팀 편성, 마일스톤 등)을 반영한 시스템 구축

---

## 🧩 핵심 기능 요약

### ✅ 공통
- 로그인/로그아웃 및 세션 관리
- 역할 기반 페이지 접근 제어 (관리자 / 교수자 / 학부생)
- 게시판 CRUD + 댓글/대댓글 기능
- 마이페이지 + 정보 조회/비밀번호 변경
- 좋아요 기능, 페이지네이션, 파일 첨부/다운로드
- 웹소켓 알림, OpenAPI 식단표 제공

### ✅ 관리자
- 강의실 및 교수자 배정 관리
- 관리자 전용 공지사항 작성
- 단과대학/학과/교수자 CRUD

### ✅ 교수자
- 강의실 학생 관리, 강의 목차 CRUD
- 출석 데이터 정렬 및 엑셀 다운로드
- 시험 출제 + 자동 채점 및 성적 집계
- 통합 분석 페이지 (Google Chart 기반 시각화)

### ✅ 학부생
- QR 출석, 출결 현황 확인
- 본인 게시글, 팀원 모집 관리
- 마일스톤 기반 교수자와의 소통
- 수강 신청 편의 기능 (프리셋, 요일별 필터링)
- F학점 경고 시스템

---

## 🏗 아키텍처 및 기술 스택

### 🔧 Frontend
- **React**, **React API**, **Node.js**
- **WebSocket** (실시간 알림), **Google Chart**

### 🛠 Backend
- **Java**, **Spring Boot**, **Spring Security**
- **JWT 인증/인가**, **Tomcat**, **WebSocket**

### 🗃 Database
- **MySQL**
- **MyBatis** (Mapper 기반 쿼리 처리)
- **JawsDB (Heroku 연동)**

### ☁ 기타 협업 도구
- GitHub, Notion, Figma, Heroku, Naver Cloud, Ngrok

---

## 📊 시스템 설계

### 📍 사용자 권한 구조
- `관리자`: 전체 강의 관리, 교수자 배정, 대학/학과 정보 설정
- `교수자`: 강의실 운영, 출결 관리, 시험 출제, 게시판 제어
- `학부생`: 수강 신청, 출석 참여, 게시판 활동, 팀 프로젝트 관리

### 📁 ERD / 요구사항 명세 / 플로우차트
👉 [ERD 및 요구사항 명세 보기](https://www.figma.com/design/WOBNLCfkcLOltITfUSnO3Z/Untitled?m=dev&t=unpGOldBTlfgy3fj-1)  
👉 [WBS - 작업 분장 및 일정](https://www.figma.com/design/WOBNLCfkcLOltITfUSnO3Z/Untitled?m=dev&t=unpGOldBTlfgy3fj-1)

---

## 🔍 주요 특징

### 📈 데이터 시각화 및 분석
- Google Chart 활용한 출석률/성적 시각화
- 게시글 좋아요 수 기반 인기 게시판 제공
- 설문 게시판 막대/파이차트 시각화 자동 생성

### 🧠 객체 지향 모델링 (User 중심)
- User 모델에 공통 필드(id, email 등) 통합
- `ROLE_ADMIN`, `ROLE_PROFESSOR`, `ROLE_STUDENT` 분리
- OOP 기반 역할 관리 → 유지보수/확장 용이

### ⏱ 향후 구현 예정
- QR 코드 생성 기반 출석 기능 고도화
- 관리자 전용 공지사항 게시판 기능 추가

---

## 💡 배운 점 & 프로젝트 회고

- 역할 기반 권한 분리를 통해 Spring Security + JWT를 실제로 구현
- 팀 협업에서 Git / Notion / Ngrok / Heroku를 활용하여 효율적인 피드백 루프 구성
- React에서의 컴포넌트 분리, 재사용, 전역 상태 관리에 대한 이해
- 실시간 WebSocket 알림 시스템의 기초 구현 경험

---

## 🙌 프로젝트를 마치며

이 프로젝트는 실제 교육 현장에서의 문제를 깊이 분석하고, 이를 해결하는 기능 중심의 설계와 구현을 목표로 하였습니다. 사용자 편의성과 데이터 활용도를 모두 잡은 이 시스템이, 다양한 교육기관에 실제로 적용될 수 있기를 기대합니다.

---

## 📎 관련 링크

- 🔗 [Figma 디자인 시안](https://www.figma.com/design/WOBNLCfkcLOltITfUSnO3Z/Untitled?m=dev&t=unpGOldBTlfgy3fj-1)
- 📘 [Notion 협업 페이지 (선택사항)]
- 🐙 GitHub 링크: `https://github.com/learn-alive-lms`

