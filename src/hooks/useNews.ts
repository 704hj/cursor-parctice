import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNews } from "@/src/api/news";
import { components } from "@/src/types/api";

type NewsItem = components["schemas"]["NewsItem"];
type NewsList = components["schemas"]["NewsList"];

/**
 * 뉴스 목록 조회 훅
 * openapi.yaml의 GET /news 기반
 */
export function useFetchNews() {
  return useQuery<NewsList>({
    queryKey: ["news"],
    queryFn: fetchNews,
  });
}

/**
 * 뉴스 목록 조회 훅 (옵션 포함)
 */
export function useNews(options?: {
  enabled?: boolean;
  refetchInterval?: number;
}) {
  return useQuery<NewsList>({
    queryKey: ["news"],
    queryFn: fetchNews,
    enabled: options?.enabled,
    refetchInterval: options?.refetchInterval,
  });
}

/**
 * 특정 뉴스 아이템 찾기 헬퍼
 */
export function useNewsItem(id?: string) {
  const { data, ...rest } = useFetchNews();
  
  const item = data?.items?.find((item) => item.id === id);
  
  return {
    data: item,
    ...rest,
  };
}

