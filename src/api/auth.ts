// src/api/auth.ts
import { api } from "./client";
import { components } from "@/src/types/api";

type SignupRequest = components["schemas"]["SignupRequest"];
type LoginRequest = components["schemas"]["LoginRequest"];
type AuthResponse = components["schemas"]["AuthResponse"];
type User = components["schemas"]["User"];

/**
 * 회원가입
 */
export async function signup(data: SignupRequest) {
  const { data: response, error } = await api.POST("/auth/signup", {
    body: data,
  });
  
  if (error) {
    throw new Error(error.message || "회원가입에 실패했습니다");
  }
  
  return response as AuthResponse;
}

/**
 * 로그인
 */
export async function login(data: LoginRequest) {
  const { data: response, error } = await api.POST("/auth/login", {
    body: data,
  });
  
  if (error) {
    throw new Error(error.message || "로그인에 실패했습니다");
  }
  
  return response as AuthResponse;
}

/**
 * 로그아웃
 */
export async function logout() {
  const { data, error } = await api.POST("/auth/logout", {});
  
  if (error) {
    throw new Error("로그아웃에 실패했습니다");
  }
  
  return data;
}

/**
 * 현재 사용자 정보 조회
 */
export async function getCurrentUser() {
  const { data, error } = await api.GET("/auth/me", {});
  
  if (error) {
    throw new Error("사용자 정보를 가져오는데 실패했습니다");
  }
  
  return data as User;
}

/**
 * 토큰 갱신
 */
export async function refreshToken(refreshToken: string) {
  const { data, error } = await api.POST("/auth/refresh", {
    body: { refreshToken },
  });
  
  if (error) {
    throw new Error("토큰 갱신에 실패했습니다");
  }
  
  return data;
}

