// PreToolUse 훅: 비밀 파일/잠금 파일 수정을 차단한다 (exit 2 = 차단).
import { readFileSync } from "node:fs";

const input = JSON.parse(readFileSync(0, "utf8"));
const file = (input.tool_input?.file_path ?? "").replace(/\\/g, "/");

if (
  /(^|\/)\.env(\..+)?$/.test(file) ||
  /(^|\/)package-lock\.json$/.test(file)
) {
  console.error(`보호된 파일은 직접 수정할 수 없습니다: ${file}`);
  process.exit(2);
}
