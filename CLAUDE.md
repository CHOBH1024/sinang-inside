# CLAUDE.md — 신앙인사이드 - 나의 신앙 성향 및 심정 스펙트럼 진단 (Sinang Radar)

## 프로젝트 개요

- 이름: 신앙인사이드 - 나의 신앙 성향 및 심정 스펙트럼 진단 (Sinang Radar)
- 폴더: sinang-inside
- 스택: React + TypeScript + Vite
- 배포: Vercel → https://sinang-inside.vercel.app
- Survey ID: sinang-test

## 핵심 데이터 파일

- `src/data/surveys.ts` — 12문항, 페르소나 5개 (자동 생성됨)
- `src/data/personaData.ts` — 페르소나 상세 (자동 생성됨)
- `src/theme.ts` — 기본색 #0d5c3a

## 수정 방법

이 프로젝트는 generate-site.js로 생성됨.
문항/페르소나 수정은 sinang-inside-config.json 수정 후 재생성하거나 직접 surveys.ts를 편집하세요.

## 팀 워크플로우

공통 팀 구성은 루트 `../CLAUDE.md` 참고.
