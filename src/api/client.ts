import createClient from "openapi-fetch";
import { paths } from "../types/api";

export const api = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE, // .env.local의 BASE 사용
});
