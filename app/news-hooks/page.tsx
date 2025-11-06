"use client";

import { useFetchNews, useNewsItem } from "@/src/hooks/useNews";

export default function NewsHooksPage() {
  // openapi.yaml 기반으로 AI가 만든 훅 사용!
  const { data, isLoading, error } = useFetchNews();

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {String(error)}</div>;

  return (
    <main style={{ padding: 20 }}>
      <h1>뉴스 목록 (React Query 훅 사용)</h1>
      <p style={{ color: "#666" }}>
        ✨ openapi.yaml → AI가 훅 생성 → 여기서 사용!
      </p>

      <div style={{ marginTop: 20 }}>
        {data?.items?.map((news) => (
          <div
            key={news.id}
            style={{
              border: "1px solid #ddd",
              padding: 16,
              marginBottom: 16,
              borderRadius: 8,
            }}
          >
            {news.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={news.image}
                alt={news.title}
                style={{ width: "100%", borderRadius: 4 }}
              />
            )}
            <h2 style={{ margin: "12px 0 8px" }}>{news.title}</h2>
            <p style={{ color: "#666", margin: 0 }}>{news.summary}</p>
            <p style={{ fontSize: 12, color: "#999", marginTop: 8 }}>
              ID: {news.id}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

