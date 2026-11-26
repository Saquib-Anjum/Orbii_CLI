#!/usr/bin/env node
import dotenv from 'dotenv';
import chalk from 'chalk';
import figlet from 'figlet';
import { Command } from 'commander';

dotenv.config();

const VERSION = '1.0.0';

// Cyan -> Green gradient
type RGB = [number, number, number];
const CYAN: RGB = [80, 230, 255];
const GREEN: RGB = [90, 245, 170];
const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
const gradient = (t: number) =>
  chalk.rgb(
    lerp(CYAN[0], GREEN[0], t),
    lerp(CYAN[1], GREEN[1], t),
    lerp(CYAN[2], GREEN[2], t)
  );

const theme = {
  eyes: chalk.rgb(200, 255, 255).bold,   // glowing visor
  signal: chalk.rgb(217, 119, 87).bold,  // Claude Terracotta (#D97757)
  claudeText: chalk.rgb(217, 119, 87).bold,
  text: chalk.rgb(232, 230, 227),
  muted: chalk.rgb(133, 127, 114),
  badge: chalk.bgRgb(26, 24, 21).rgb(217, 119, 87).bold,
  hint: chalk.cyanBright,
};

/** AI agent head. Every row is exactly 17 columns wide so the shape never wobbles. */
const AGENT = [
  '        ◉        ',
  '        │        ',
  ' ╭──────┴──────╮ ',
  '▐│ ▄██▄   ▄██▄ │▌',
  '▐│ ▀██▀   ▀██▀ │▌',
  ' │    ╰───╯    │ ',
  ' ╰─┬─────────┬─╯ ',
  '   ╧         ╧   ',
];

const stripAnsi = (s: string) => s.replace(/\u001b\[[0-9;]*m/g, '');

function buildLogo(): string[] {
  return AGENT.map((row, i) => {
    const frame = gradient(i / (AGENT.length - 1));
    return [...row]
      .map((ch) => {
        if (ch === '◉') return theme.signal(ch);             // antenna signal
        if ('█▄▀'.includes(ch)) return theme.eyes(ch);      // eyes
        if (ch === '▐' || ch === '▌') return frame.bold(ch); // ear sensors
        return frame(ch);
      })
      .join('');
  });
}

function buildBanner(): string[] {
  const lines = figlet
    .textSync('Orbii CLI', { font: 'Standard' })
    .split('\n')
    .map((l) => l.replace(/\s+$/, ''));
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  return lines.map((l, i) => gradient(i / Math.max(lines.length - 1, 1)).bold(l));
}

function renderHeader() {
  const cols = process.stdout.columns ?? 80;

  const logo = buildLogo();
  const banner = buildBanner();

  // Visible widths (ANSI colors stripped before measuring)
  const bannerWidth = Math.max(...banner.map((l) => stripAnsi(l).length));
  const logoWidth = Math.max(...logo.map((l) => stripAnsi(l).length));

  // Padding for the robot ONLY, so it centers over the wordmark
  const logoPad = ' '.repeat(Math.max(0, Math.floor((bannerWidth - logoWidth) / 2)));

  console.log();
  logo.forEach((l) => console.log(logoPad + l)); // only the logo is padded
  console.log();
  banner.forEach((l) => console.log(l));         // no padding
  console.log();
  console.log(
    theme.badge(' ✻ ORBII ') +
      ' ' +
      theme.claudeText('A CLI-based AI Agent') +
      theme.muted(` • v${VERSION}`)
  );
  console.log(theme.muted('─'.repeat(Math.max(10, Math.min(52, cols - 2)))));
  console.log();
}

async function main(){
 const program = new Command('orbii');
  program.version(VERSION).description('Orbii CLI - A CLI Based AI Agent');

  // Keep --version output script-friendly (no header)
  const quiet = process.argv.some((a) => a === '--version' || a === '-V');
  if (!quiet) renderHeader();

  // No arguments: show a hint instead of silently exiting
  if (process.argv.length <= 2) {
    console.log(
      theme.claudeText('❯ ') +
        theme.text('Run ') +
        theme.hint('orbii --help') +
        theme.text(' to see available agent commands.\n')
    );
    return;
  }
 // default program
 program.action(()=>{
  program.help()
 })
   program.parse();
}

main().catch((err)=>{
  console.log(chalk.red("Error in Orbii CLI.."),err);
  process.exit(1);
});