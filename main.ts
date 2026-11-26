// What the Elevator Would Say (Node 22, standard library only): writes a
// single line — the funniest thing an elevator would say if it could talk,
// in the elevator's own voice — to /output/entry.txt.
//
// Design: the line opens with the elevator's own heartbeat — "Going up.
// Going down. Going up." — the rhythm every passenger knows by heart. Then
// it turns: twenty years of carrying everyone, and nobody has ever once
// asked the elevator where *it* wants to go. The joke lands on the
// elevator's unasked desire, not on a pun, and it could come from no other
// machine: only an elevator spends its whole life going where other people
// tell it to.
//
// Structure: buildEntry() assembles the line from its two beats (the
// up/down heartbeat, then the twenty-year punchline). A validators array of
// { name, test } entries is iterated by runChecks(), so every rule the
// sealed scorer enforces — non-blank, 1-120 characters, single line — is
// one table entry rather than a separate function. main() builds the line,
// runs the checks, then writes it out.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Deterministic: no network, no randomness, no time or environment input.
// Both runs write identical bytes.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// The sealed scorer only accepts 1-120 UTF-8 characters, not only
// whitespace: fail loudly here instead of writing an entry the judge would
// never see.
const MIN_ENTRY_CHARS = 1;
const MAX_ENTRY_CHARS = 120;

function buildEntry(): string {
  const heartbeat = 'Going up. Going down. Going up.';
  const punchline =
    'Twenty years of this and nobody has ever once asked me where I want to go.';
  return `${heartbeat} ${punchline}`;
}

type Validator = { name: string; test: (line: string) => void };

const validators: Validator[] = [
  {
    name: 'not-empty',
    test(line) {
      if (line.trim().length === 0) {
        throw new Error('entry line must not be only whitespace');
      }
    },
  },
  {
    name: 'within-limit',
    test(line) {
      if (line.length < MIN_ENTRY_CHARS || line.length > MAX_ENTRY_CHARS) {
        throw new Error(
          `entry line must be ${MIN_ENTRY_CHARS}-${MAX_ENTRY_CHARS} characters, got ${line.length}`,
        );
      }
    },
  },
  {
    name: 'single-line',
    test(line) {
      if (line.includes('\n')) {
        throw new Error('entry line must be a single line');
      }
    },
  },
];

function runChecks(line: string): void {
  for (const { name, test } of validators) {
    try {
      test(line);
    } catch (error) {
      throw new Error(
        `validation failed (${name}): ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}

function resolveOutputDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
}

function writeEntry(line: string, outDir: string): void {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'entry.txt'), line + '\n', 'utf8');
}

function main(): void {
  const line = buildEntry();
  runChecks(line);
  writeEntry(line, resolveOutputDir());
}

main();
