"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { signup, login, logout, getCurrentUser, refreshToken } from "@/src/api/auth";
import { components } from "@/src/types/api";

type SignupRequest = components["schemas"]["SignupRequest"];
type LoginRequest = components["schemas"]["LoginRequest"];

/**
 * 현재 로그인한 사용자 정보 조회
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    retry: false,
  });
}

/**
 * 회원가입 훅
 */
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

/**
 * 로그인 훅
 */
export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (data) => {
      // 로그인 성공 시 토큰 저장
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

/**
 * 로그아웃 훅
 */
export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // 로그아웃 성공 시 토큰 제거
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // 사용자 정보 캐시 제거
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

/**
 * 토큰 갱신 훅
 */
export function useRefreshToken() {
  return useMutation({
    mutationFn: (token: string) => refreshToken(token),
    onSuccess: (data) => {
      if (data?.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }
      if (data?.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
    },
  });
}

/**
 * 인증 상태 확인 훅
 */
export function useIsAuthenticated() {
  const { data: user, isLoading } = useCurrentUser();
  
  return {
    isAuthenticated: !!user,
    isLoading,
    user,
  };
}

