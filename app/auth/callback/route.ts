import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

// 내부 경로("/..."), 단 "//" 또는 "/\"로 시작하는 외부 URL 우회는 허용하지 않는다.
function getSafeNextPath(next: string | null) {
  if (next && next.startsWith("/") && !/^\/[/\\]/.test(next)) {
    return next;
  }
  return "/";
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getSafeNextPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      redirect(next);
    }
    redirect(`/auth/error?error=${encodeURIComponent(error.message)}`);
  }

  const oauthError =
    searchParams.get("error_description") ?? "인증 코드가 없습니다.";
  redirect(`/auth/error?error=${encodeURIComponent(oauthError)}`);
}
