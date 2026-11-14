// Skills gate-check.
//
// Confirms every Claude skill still has a valid SKILL.md with a non-empty `name` and
// `description` in its frontmatter. If any skill is missing or broken, this exits with
// a non-zero code so the CI check fails and the push is blocked. This protects the
// skills the whole build relies on (CLAUDE.md points at them).
//
// Plain Node, no dependencies. Run with: npm run check:skills

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

// This script lives in week-3-hyper-budget/scripts, so the repo root is two levels up.
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..");

// Skills live at the repo root, not inside the app folder.
const skillDirs = [
  path.join(repoRoot, ".claude", "skills"),
  path.join(repoRoot, "Week-1-Claude-Skills"),
];

function findSkillFiles(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      const skillMd = path.join(full, "SKILL.md");
      if (existsSync(skillMd)) out.push(skillMd);
    }
  }
  return out;
}

function checkFrontmatter(file) {
  const text = readFileSync(file, "utf8");
  const errors = [];
  const block = text.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!block) {
    errors.push("missing frontmatter block (--- ... ---)");
    return errors;
  }
  const fm = block[1];
  const name = fm.match(/^name:\s*(.+)$/m);
  const description = fm.match(/^description:\s*(.+)$/m);
  if (!name || !name[1].trim()) errors.push("missing or empty 'name'");
  if (!description || !description[1].trim()) errors.push("missing or empty 'description'");
  return errors;
}

let files = [];
for (const dir of skillDirs) files = files.concat(findSkillFiles(dir));

if (files.length === 0) {
  console.error("Skills gate: no SKILL.md files found. Expected skills under .claude/skills.");
  process.exit(1);
}

let failed = 0;
for (const file of files) {
  const rel = path.relative(repoRoot, file);
  const errs = checkFrontmatter(file);
  if (errs.length) {
    failed++;
    console.error(`FAIL  ${rel}: ${errs.join("; ")}`);
  } else {
    console.log(`ok    ${rel}`);
  }
}

if (failed > 0) {
  console.error(`\nSkills gate FAILED: ${failed} of ${files.length} skill file(s) invalid.`);
  process.exit(1);
}
console.log(`\nSkills gate passed: all ${files.length} skill file(s) valid.`);
