# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

"Gather" — 초대 링크 하나로 5-30명 규모의 일회성 이벤트(생일 파티, 워크샵 등)를 관리하는 모바일 퍼스트 플랫폼 MVP. 현재 코드는 Next.js + Supabase 스타터 킷(`create-next-app -e with-supabase`) 상태이며, 이를 Gather로 바꿔가는 중이다. 기획/진행 상황은 [docs/PRD.md](docs/PRD.md), [docs/ROADMAP.md](docs/ROADMAP.md), [docs/tasks/](docs/tasks/)에 있다 (작업은 ROADMAP의 Task 단위로 진행하고, 완료 시 ROADMAP에 ✅ 표시).

## 명령어

```bash
npm run dev     # 개발 서버
npm run build   # 프로덕션 빌드
npm run lint    # eslint .
```

테스트 러너는 설정되어 있지 않다 (ROADMAP은 Playwright MCP 기반 E2E 테스트를 전제로 함).

## 아키텍처

- **Next.js App Router, 루트 디렉토리 구조** (`src/` 없음). `@/*` 경로 별칭은 프로젝트 루트를 가리킨다. React 19, Tailwind 3, shadcn/ui (`components/ui/`, 설정은 [components.json](components.json)).
- **Supabase 인증 (`@supabase/ssr`, 쿠키 기반)**
  - [proxy.ts](proxy.ts)는 Next.js 16의 `middleware` 대체 파일이며 [lib/supabase/proxy.ts](lib/supabase/proxy.ts)의 `updateSession`을 호출한다. 여기서 세션을 갱신하고, 비로그인 사용자를 `/`, `/auth/*`, `/login*` 외 모든 경로에서 `/auth/login`으로 리다이렉트한다. 공개 라우트를 추가하려면 이 조건을 수정해야 한다 (예: 초대 링크 `/join/[code]`).
  - `createServerClient`와 `getClaims()` 사이에 코드를 넣지 말 것 (세션이 랜덤하게 끊길 수 있음). 반환하는 `supabaseResponse`의 쿠키를 그대로 유지해야 한다.
  - Supabase 클라이언트는 전역 변수에 두지 말고 매 호출/요청마다 새로 생성한다: 서버는 [lib/supabase/server.ts](lib/supabase/server.ts)의 `createClient()` (async), 브라우저는 [lib/supabase/client.ts](lib/supabase/client.ts).
  - [lib/supabase/database.types.ts](lib/supabase/database.types.ts)는 생성된 DB 타입이다 (Supabase MCP의 `generate_typescript_types`로 갱신).
- 인증 페이지는 `app/auth/*` (로그인, 가입, 비밀번호 재설정, `confirm/route.ts`로 이메일 OTP 확인), 로그인 필요 영역은 `app/protected/`.
- `hasEnvVars` ([lib/utils.ts](lib/utils.ts))로 환경변수 유무를 확인한다. 필요한 변수: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (`.env.local`).
- `components/tutorial/`, `deploy-button.tsx`, `hero.tsx` 등은 스타터 킷 잔재로, 정리 대상이다 (`.claude/agents/dev/starter-cleaner.md` 참고).

## 개발 도구 설정

- [.mcp.json](.mcp.json): supabase(프로젝트 전용 HTTP), context7, sequential-thinking, shadcn, shrimp-task-manager MCP 서버.
- `.claude/agents/`, `.claude/commands/`에 프로젝트 전용 서브에이전트와 git/docs 명령어가 있다.
- `docs/guides/`의 가이드(특히 `project-structure.md`)는 `src/` 구조를 가정하고 있어 현재 루트 구조와 다르다. 실제 코드 구조를 우선할 것.
- 응답과 설명은 한국어로 작성한다.
