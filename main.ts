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
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Deterministic: no network, no randomness, no time or environment input.
// Both runs write identical bytes.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const LINE =
  'Going up. Going down. Going up. Twenty years of this and nobody has ever once asked me where I want to go.';

// The sealed scorer only accepts 1-120 UTF-8 characters, not only
// whitespace: fail loudly here instead of writing an entry the judge would
// never see.
const MIN_ENTRY_CHARS = 1;
const MAX_ENTRY_CHARS = 120;

function checkNotEmpty(line: string): void {
  if (line.trim().length === 0) {
    throw new Error('entry line must not be only whitespace');
  }
}

function checkWithinLimit(line: string): void {
  if (line.length < MIN_ENTRY_CHARS || line.length > MAX_ENTRY_CHARS) {
    throw new Error(
      `entry line must be ${MIN_ENTRY_CHARS}-${MAX_ENTRY_CHARS} characters, got ${line.length}`,
    );
  }
}

function checkSingleLine(line: string): void {
  if (line.includes('\n')) {
    throw new Error('entry line must be a single line');
  }
}

function validateLine(line: string): void {
  checkNotEmpty(line);
  checkWithinLimit(line);
  checkSingleLine(line);
}

function writeEntry(line: string): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'entry.txt'), line + '\n', 'utf8');
}

function main(): void {
  validateLine(LINE);
  writeEntry(LINE);
}

main();
