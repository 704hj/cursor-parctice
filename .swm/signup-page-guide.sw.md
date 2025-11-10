---
title: 회원가입 기능 가이드
---

# 👤 회원가입 페이지 구조

이 문서는 회원가입 기능의 전체 구조를 설명합니다. View와 비즈니스 로직을 분리한 클린 아키텍처를 사용합니다.

## 📂 파일 구조

```
app/signup/page.tsx          → View (UI만 담당)
src/hooks/useAuth.ts          → 커스텀 훅 (로직 담당)
src/api/auth.ts               → API 호출
openapi.yaml                  → API 스펙 정의
```

## 🎨 1. View 레이어: SignupPage

<SwmSnippet path="/app/signup/page.tsx" line="1">

---

페이지 컴포넌트는 **순수하게 UI만 담당**합니다.

```typescript
"use client";

import { useSignup } from "@/src/hooks/useAuth";
import { useState } from "react";

/**
 * 회원가입 페이지
 *
 * 이 컴포넌트는 순수하게 View만 담당합니다.
 * 모든 비즈니스 로직은 useSignup 커스텀 훅에서 처리됩니다.
 */
export default function SignupPage() {
```

---

</SwmSnippet>

<SwmSnippet path="/app/signup/page.tsx" line="14">

---

### State 관리

폼 입력값은 로컬 state로 관리합니다.

```typescript
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [name, setName] = useState("");

const { mutate: signup, isPending, isSuccess, error } = useSignup();
```

**핵심 포인트:**

- `email`, `password`, `name`: 폼 입력값
- `useSignup()`: 커스텀 훅에서 회원가입 로직 가져오기
- `mutate`: 회원가입 실행 함수
- `isPending`: 로딩 상태
- `isSuccess`: 성공 여부
- `error`: 에러 정보

---

</SwmSnippet>

<SwmSnippet path="/app/signup/page.tsx" line="20">

---

### 폼 제출 핸들러

실제 API 호출은 `signup` 함수가 처리합니다.

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  signup({ email, password, name });
};
```

**왜 이렇게 간단한가?** → 모든 복잡한 로직(API 호출, 토큰 저장, 에러 처리)은 `useSignup` 훅에 캡슐화되어 있습니다!

---

</SwmSnippet>

<SwmSnippet path="/app/signup/page.tsx" line="32">

---

### 성공/에러 메시지 UI

React Query의 상태를 그대로 UI에 반영합니다.

```typescript
{
  isSuccess && (
    <div
      style={{
        padding: "15px",
        marginBottom: "20px",
        backgroundColor: "#d4edda",
        color: "#155724",
        borderRadius: "5px",
      }}
    >
      ✅ 회원가입이 완료되었습니다!
    </div>
  );
}

{
  error && (
    <div
      style={{
        padding: "15px",
        marginBottom: "20px",
        backgroundColor: "#f8d7da",
        color: "#721c24",
        borderRadius: "5px",
      }}
    >
      ❌ {error.message}
    </div>
  );
}
```

---

</SwmSnippet>

## ⚡ 2. 로직 레이어: useSignup 훅

<SwmSnippet path="/src/hooks/useAuth.ts" line="24">

---

### useSignup 훅의 구조

React Query의 `useMutation`을 사용하여 회원가입 로직을 캡슐화합니다.

```typescript
export function useSignup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignupRequest) => signup(data),
    onSuccess: (data) => {
      // 회원가입 성공 시 토큰 저장
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      // 사용자 정보 캐시 업데이트
      queryClient.setQueryData(["auth", "me"], data.user);
    },
  });
}
```

---

</SwmSnippet>

### 📖 useSignup의 책임

<SwmSnippet path="/src/hooks/useAuth.ts" line="28">

---

#### 1\. API 호출 (`mutationFn`)

```typescript
    mutationFn: (data: SignupRequest) => signup(data),
```

`SignupRequest` 타입은 <SwmPath>[openapi.yaml](/openapi.yaml)</SwmPath>에서 자동 생성됩니다:

```typescript
type SignupRequest = {
  email: string;
  password: string;
  name: string;
};
```

---

</SwmSnippet>

<SwmSnippet path="/src/hooks/useAuth.ts" line="29">

---

#### 2\. 토큰 저장 (`onSuccess`)

회원가입 성공 시 자동으로 실행됩니다:

```typescript
    onSuccess: (data) => {
      // 회원가입 성공 시 토큰 저장
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
```

**왜 중요한가?** → 회원가입 성공 후 즉시 로그인 상태가 됩니다!

---

</SwmSnippet>

<SwmSnippet path="/src/hooks/useAuth.ts" line="38">

---

#### 3\. 캐시 업데이트

React Query 캐시에 사용자 정보를 저장합니다:

```typescript
// 사용자 정보 캐시 업데이트
queryClient.setQueryData(["auth", "me"], data.user);
```

**효과:**

- 다른 컴포넌트에서 `useCurrentUser()`를 호출하면 즉시 사용자 정보를 가져올 수 있음
- 추가 API 호출 불필요!

---

</SwmSnippet>

## 🔗 3. API 레이어

<SwmSnippet path="/src/api/auth.ts" line="1">

---

실제 API 호출 함수

```typescript
import { api } from "./client";
import { components } from "../types/api";

type SignupRequest = components["schemas"]["SignupRequest"];

export async function signup(data: SignupRequest) {
  const { data: result, error } = await api.POST("/auth/signup", {
    body: data,
  });

  if (error) {
    throw new Error(error.message || "회원가입 실패");
  }

  return result;
}
```

**타입 안전:**

- `SignupRequest`는 <SwmPath>[openapi.yaml](/openapi.yaml)</SwmPath>에서 자동 생성
- `api.POST()`의 파라미터와 응답 타입도 자동 추론
- 컴파일 타임에 오류 발견!

---

</SwmSnippet>

## 📋 4. API 스펙 정의

<SwmSnippet path="/openapi.yaml" line="24">

---

회원가입 API 스펙

```yaml
/auth/signup:
  post:
    summary: 회원가입
    tags:
      - Auth
    requestBody:
      required: true
      content:
        application/json:
          schema: { $ref: "#/components/schemas/SignupRequest" }
          examples:
            default:
              value:
                email: "user@example.com"
                password: "password123"
                name: "홍길동"
```

---

</SwmSnippet>

<SwmSnippet path="/openapi.yaml" line="189">

---

### SignupRequest 스키마

```yaml
SignupRequest:
  type: object
  required:
    - email
    - password
    - name
  properties:
    email:
      type: string
      format: email
      description: 이메일 (로그인 ID)
    password:
      type: string
      minLength: 8
      description: 비밀번호 (최소 8자)
    name:
      type: string
      minLength: 2
      description: 사용자 이름
```

**이 정의가 자동으로:**

1. TypeScript 타입 생성
2. API 클라이언트 타입 체크
3. Swagger 문서 생성
4. Mock 서버 응답

---

</SwmSnippet>

## 🔄 전체 데이터 흐름

```
1. 사용자가 폼 입력
   ↓
2. SignupPage에서 handleSubmit 실행
   ↓
3. signup({ email, password, name }) 호출
   ↓
4. useSignup 훅의 mutationFn 실행
   ↓
5. src/api/auth.ts의 signup() 함수 호출
   ↓
6. api.POST("/auth/signup") → 백엔드 API 호출
   ↓
7. 성공 시 onSuccess 콜백 실행:
   - localStorage에 토큰 저장
   - React Query 캐시 업데이트
   ↓
8. SignupPage의 isSuccess가 true로 변경
   ↓
9. 성공 메시지 표시!
```

## ✨ 핵심 패턴: View와 로직 분리

### ❌ 안 좋은 방식 (모든 로직이 컴포넌트에)

```typescript
export default function SignupPage() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
      });
      const data = await response.json();
      localStorage.setItem("token", data.token);
      // ... 복잡한 로직들
    } catch (error) {
      // 에러 처리
    }
  };
}
```

### ✅ 좋은 방식 (커스텀 훅으로 분리)

<SwmSnippet path="/app/signup/page.tsx" line="19">

---

컴포넌트는 단순하게!

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  signup({ email, password, name });
};
```

---

</SwmSnippet>

## 🎯 신규 개발자를 위한 가이드

### 1\. 회원가입 페이지 테스트

```bash
# 1. Mock 서버 시작
npm run mock

# 2. 개발 서버 시작
npm run dev

# 3. 브라우저에서 열기
http://localhost:3000/signup
```

### 2\. API 스펙 변경 시

```bash
# openapi.yaml 수정 후 타입 재생성
npx openapi-typescript openapi.yaml -o src/types/api.d.ts
```

### 3\. 커스텀 훅 사용 예시

```typescript
function MyComponent() {
  const { mutate, isPending, error } = useSignup();

  const handleClick = () => {
    mutate({ email: "test@test.com", password: "12345678", name: "테스트" });
  };

  return (
    <button onClick={handleClick} disabled={isPending}>
      {isPending ? "가입 중..." : "회원가입"}
    </button>
  );
}
```

## 🔍 관련 파일

- <SwmPath>[app/signup/page.tsx](/app/signup/page.tsx)</SwmPath> - 회원가입 페이지 (View)
- <SwmPath>[src/hooks/useAuth.ts](/src/hooks/useAuth.ts)</SwmPath> - 인증 관련 훅
- <SwmPath>[src/api/auth.ts](/src/api/auth.ts)</SwmPath> - API 호출 함수
- <SwmPath>[openapi.yaml](/openapi.yaml)</SwmPath> - API 스펙 정의

## ⚠️ 주의사항

1. **컴포넌트에 직접 API 호출 금지**

   - 항상 커스텀 훅을 통해 API 호출
   - 로직 재사용성 & 테스트 용이성 향상

2. **타입 파일 수동 수정 금지**

   - `src/types/api.d.ts`는 자동 생성 파일
   - 변경 필요 시 `openapi.yaml` 수정 후 재생성

3. **토큰 관리**

   - `useSignup` 훅이 자동으로 토큰 저장
   - 수동으로 localStorage 조작하지 말 것

## 🚀 다음 단계

이 패턴을 이해했다면:

- <SwmPath>[app/login/page.tsx](/app/login/page.tsx)</SwmPath> 로그인 페이지도 동일한 패턴
- `useLogin`, `useLogout` 훅도 같은 구조
- 다른 기능도 이 패턴으로 구현 가능!

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBY3Vyc29yLXBhcmN0aWNlJTNBJTNBNzA0aGo=" repo-name="cursor-parctice"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
