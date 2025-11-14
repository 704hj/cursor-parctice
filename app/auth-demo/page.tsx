"use client";

import { useState } from "react";
import {
  useSignup,
  useLogin,
  useLogout,
  useCurrentUser,
  useIsAuthenticated,
} from "@/src/hooks/useAuth";

export default function AuthDemoPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const { data: currentUser } = useCurrentUser();
  const { isAuthenticated, isLoading } = useIsAuthenticated();
  const signupMutation = useSignup();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === "signup") {
        await signupMutation.mutateAsync({ email, password, name });
        alert("회원가입 성공!");
      } else {
        await loginMutation.mutateAsync({ email, password });
        alert("로그인 성공!");
      }
      // 폼 초기화
      setEmail("");
      setPassword("");
      setName("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "오류가 발생했습니다");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      alert("로그아웃 되었습니다");
    } catch (error) {
      alert("로그아웃 실패");
    }
  };

  if (isLoading) {
    return <div style={{ padding: 20 }}>로딩 중...</div>;
  }

  return (
    <main style={{ padding: 40, maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 20 }}>인증 API 데모</h1>
      <p style={{ color: "#666", marginBottom: 30 }}>
        openapi.yaml → AI가 훅 생성 → 여기서 사용!
      </p>

      {isAuthenticated && currentUser ? (
        // 로그인 상태
        <div
          style={{
            border: "2px solid #4CAF50",
            padding: 24,
            borderRadius: 8,
            backgroundColor: "#f1f8f4",
          }}
        >
          <h2 style={{ marginTop: 0, color: "#4CAF50" }}>로그인됨</h2>
          <div style={{ marginBottom: 16 }}>
            <strong>ID:</strong> {currentUser.id}
          </div>
          <div style={{ marginBottom: 16 }}>
            <strong>이메일:</strong> {currentUser.email}
          </div>
          <div style={{ marginBottom: 16 }}>
            <strong>이름:</strong> {currentUser.name}
          </div>
          <div style={{ marginBottom: 24 }}>
            <strong>가입일:</strong>{" "}
            {currentUser.createdAt
              ? new Date(currentUser.createdAt).toLocaleString("ko-KR")
              : "-"}
          </div>
          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            style={{
              padding: "12px 24px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
          </button>
        </div>
      ) : (
        // 로그인 안 된 상태
        <div>
          <div style={{ marginBottom: 24, display: "flex", gap: 8 }}>
            <button
              onClick={() => setMode("login")}
              style={{
                flex: 1,
                padding: "12px",
                backgroundColor: mode === "login" ? "#2196F3" : "#ddd",
                color: mode === "login" ? "white" : "#666",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              로그인
            </button>
            <button
              onClick={() => setMode("signup")}
              style={{
                flex: 1,
                padding: "12px",
                backgroundColor: mode === "signup" ? "#2196F3" : "#ddd",
                color: mode === "signup" ? "white" : "#666",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              회원가입
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{
              border: "1px solid #ddd",
              padding: 24,
              borderRadius: 8,
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              {mode === "login" ? "로그인" : "회원가입"}
            </h2>

            {mode === "signup" && (
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
                >
                  이름
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={2}
                  style={{
                    width: "100%",
                    padding: "10px",
                    fontSize: 16,
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    boxSizing: "border-box",
                  }}
                  placeholder="홍길동"
                />
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label
                style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
              >
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: 16,
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  boxSizing: "border-box",
                }}
                placeholder="user@example.com"
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label
                style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
              >
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={mode === "signup" ? 8 : undefined}
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: 16,
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  boxSizing: "border-box",
                }}
                placeholder={mode === "signup" ? "최소 8자" : "비밀번호"}
              />
            </div>

            <button
              type="submit"
              disabled={signupMutation.isPending || loginMutation.isPending}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              {signupMutation.isPending || loginMutation.isPending
                ? "처리 중..."
                : mode === "login"
                ? "로그인"
                : "회원가입"}
            </button>
          </form>

          <div
            style={{
              marginTop: 24,
              padding: 16,
              backgroundColor: "#fff3cd",
              borderRadius: 6,
              fontSize: 14,
            }}
          >
            <strong>💡 테스트용:</strong>
            <br />
            Mock 서버가 실행 중이면 아무 값이나 입력해도 성공 응답을 받습니다.
          </div>
        </div>
      )}
    </main>
  );
}
