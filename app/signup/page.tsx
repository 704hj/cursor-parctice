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
    <main className="min-h-screen bg-[#fffdf6] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[412px]">
        {/* 성공 메시지 */}
        {isSuccess && (
          <div className="mb-5 p-4 bg-green-100 text-green-800 rounded-lg text-sm">
            ✅ 회원가입이 완료되었습니다!
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-5 p-4 bg-red-100 text-red-800 rounded-lg text-sm">
            ❌ {error.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 이메일 입력 */}
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="이메일"
              className="w-full h-[47px] px-4 bg-white rounded-[5px] border border-gray-200 text-base text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ddeb9d]"
            />
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="비밀번호 (최소 8자)"
              className="w-full h-[47px] px-4 bg-white rounded-[5px] border border-gray-200 text-base text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ddeb9d]"
            />
            <p className="mt-1 text-xs text-[#b1b1b1]">최소 8자 이상 입력해주세요</p>
          </div>

          {/* 이름 입력 */}
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              placeholder="이름"
              className="w-full h-[47px] px-4 bg-white rounded-[5px] border border-gray-200 text-base text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ddeb9d]"
            />
            <p className="mt-1 text-xs text-[#b1b1b1]">최소 2자 이상 입력해주세요</p>
          </div>

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-[47px] bg-[#ddeb9d] rounded-[5px] text-black text-xl font-normal disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d4e08a] transition-colors"
          >
            {isPending ? "가입 중..." : "회원가입"}
          </button>
        </form>

        {/* 하단 링크 */}
        <div className="mt-8 text-center">
          <div className="flex justify-center gap-4 mb-6">
            <a href="/login" className="text-base text-[#b1b1b1] hover:text-black transition-colors">
              로그인
            </a>
            <span className="text-base text-[#b1b1b1]">|</span>
            <a href="/find-id" className="text-base text-[#b1b1b1] hover:text-black transition-colors">
              아이디 찾기
            </a>
            <span className="text-base text-[#b1b1b1]">|</span>
            <a href="/find-password" className="text-base text-[#b1b1b1] hover:text-black transition-colors">
              비밀번호 찾기
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
