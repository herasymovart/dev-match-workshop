#!/usr/bin/env node
// PreToolUse hook for Edit|Write: blocks changes to the course owner's input documents.
// Claude Code passes the tool call as JSON on stdin; exit code 2 blocks the call and
// sends stderr back to Claude as the reason. No dependencies, so it runs on a fresh clone.
import { readFileSync } from "node:fs";
import { relative, resolve } from "node:path";

const PROTECTED = /^docs\/(project_context\.md|US-[A-Z]+-\d+\.md)$/;

let input = {};
try {
  input = JSON.parse(readFileSync(0, "utf8"));
} catch {
  process.exit(0); // not JSON: let the tool run
}
const file = input?.tool_input?.file_path;
if (!file) process.exit(0);

const rel = relative(process.cwd(), resolve(process.cwd(), file)).replaceAll("\\", "/");
if (PROTECTED.test(rel)) {
  process.stderr.write(
    `${rel} is the course owner's input and is read-only. Put the problem in the "Open questions" ` +
      `section of docs/architecture/overview.md instead, and tell the user.\n`,
  );
  process.exit(2);
}
process.exit(0);
