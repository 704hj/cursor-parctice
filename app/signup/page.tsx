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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const { mutate: signup, isPending, isSuccess, error } = useSignup();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup({ email, password, name });
  };

  return (
    <main
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
      }}
    >
      <h1 style={{ marginBottom: "30px" }}>회원가입</h1>

      {isSuccess && (
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
      )}

      {error && (
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
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            이메일
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="user@example.com"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            placeholder="최소 8자"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "14px",
            }}
          />
          <small style={{ color: "#666", fontSize: "12px" }}>
            최소 8자 이상 입력해주세요
          </small>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            이름
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            placeholder="홍길동"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "14px",
            }}
          />
          <small style={{ color: "#666", fontSize: "12px" }}>
            최소 2자 이상 입력해주세요
          </small>
        </div>

        <button
          type="submit"
          disabled={isPending}
          style={{
            width: "100%",
            padding: "15px",
            backgroundColor: isPending ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: isPending ? "not-allowed" : "pointer",
          }}
        >
          {isPending ? "가입 중..." : "회원가입"}
        </button>
      </form>

      <div style={{ marginTop: "20px", textAlign: "center", fontSize: "14px" }}>
        이미 계정이 있으신가요?{" "}
        <a href="/login" style={{ color: "#007bff", textDecoration: "none" }}>
          로그인
        </a>
      </div>
    </main>
  );
}
