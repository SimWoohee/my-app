// PostToolUse 훅: Claude가 수정한 파일을 Prettier로 자동 포맷한다.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const input = JSON.parse(readFileSync(0, "utf8"));
const file = input.tool_input?.file_path;

if (file && /\.(tsx?|jsx?|mjs|json|css|md)$/.test(file)) {
  try {
    execFileSync("npx", ["prettier", "--write", "--ignore-unknown", file], {
      stdio: "ignore",
      shell: true,
    });
  } catch {
    // 포맷 실패가 작업을 막지 않도록 무시
  }
}
