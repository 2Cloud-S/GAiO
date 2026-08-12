import { buildLlmsTxt, plainTextResponse } from "@/lib/llms-txt";

export const revalidate = 60;

export async function GET() {
  const body = await buildLlmsTxt();
  return plainTextResponse(body);
}
