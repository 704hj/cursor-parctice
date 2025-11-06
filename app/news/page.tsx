import { fetchNews } from "@/src/api/news";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const data = await fetchNews();
  return (
    <main style={{ padding: 20 }}>
      {data?.items?.map((n) => (
        <div
          key={n.id}
          style={{ border: "1px solid #ddd", padding: 16, marginBottom: 16 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={n.image} alt={n.title} width="100%" />
          <h2>{n.title}</h2>
          <p>{n.summary}</p>
        </div>
      ))}
    </main>
  );
}
