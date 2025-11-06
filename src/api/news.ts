// src/api/news.ts
import { api } from "./client";

export async function fetchNews() {
  const { data, error } = await api.GET("/news");
  if (error) {
    throw new Error("API error: " + JSON.stringify(error));
  }
  return data; // { items: ... }
}
