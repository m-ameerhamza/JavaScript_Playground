#!/usr/bin/env node

/**
 * ┌─────────────────────────────────────────┐
 * │         AI Chat CLI — Claude API        │
 * │   A minimal terminal chatbot in Node.js │
 * └─────────────────────────────────────────┘
 *
 * Usage:
 *   node ai-chat.js
 *   ANTHROPIC_API_KEY=your_key node ai-chat.js
 */

import Anthropic from "@anthropic-ai/sdk";
import * as readline from "readline";

// ──────────────────────────────────────────
// Config
// ──────────────────────────────────────────
const MODEL = "claude-sonnet-4-20250514";
const MAX_TOKENS = 1024;
const SYSTEM_PROMPT =
  "You are a helpful, concise assistant. Keep responses clear and practical.";

// ──────────────────────────────────────────
// ANSI colours (degrade gracefully if unsupported)
// ──────────────────────────────────────────
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
  white: "\x1b[37m",
};

const paint = (color, text) =>
  process.stdout.isTTY ? `${color}${text}${c.reset}` : text;

// ──────────────────────────────────────────
// Spinner
// ──────────────────────────────────────────
function createSpinner(message = "Thinking") {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let i = 0;
  const interval = setInterval(() => {
    process.stdout.write(
      `\r${paint(c.magenta, frames[i % frames.length])} ${paint(c.dim, message + "...")}   `
    );
    i++;
  }, 80);
  return {
    stop: () => {
      clearInterval(interval);
      process.stdout.write("\r\x1b[2K"); // clear line
    },
  };
}

// ──────────────────────────────────────────
// Word-wrap helper
// ──────────────────────────────────────────
function wrap(text, width = 80, indent = "") {
  const words = text.split(" ");
  const lines = [];
  let line = indent;

  for (const word of words) {
    if (line.length + word.length + 1 > width && line.trim()) {
      lines.push(line.trimEnd());
      line = indent + word + " ";
    } else {
      line += word + " ";
    }
  }
  if (line.trim()) lines.push(line.trimEnd());
  return lines.join("\n");
}

// ──────────────────────────────────────────
// Main chat loop
// ──────────────────────────────────────────
async function main() {
  // Validate API key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error(
      paint(c.red, "\n✖  ANTHROPIC_API_KEY environment variable is not set.\n")
    );
    console.error(
      paint(c.dim, "   Export it first:\n   export ANTHROPIC_API_KEY=sk-...\n")
    );
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });

  // Conversation history (multi-turn)
  const history = [];

  // ── Banner ──
  console.clear();
  console.log(
    paint(c.cyan, c.bold) +
      `
╔══════════════════════════════════════════╗
║            AI Chat — Claude API        ║
╚══════════════════════════════════════════╝` +
      c.reset
  );
  console.log(paint(c.dim, `  Model : ${MODEL}`));
  console.log(paint(c.dim, `  Type  : your message and press Enter`));
  console.log(paint(c.dim, `  Quit  : type "exit" or press Ctrl+C\n`));

  // ── Readline interface ──
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  // Graceful exit
  rl.on("close", () => {
    console.log(paint(c.cyan, "\n  Bye! 👋\n"));
    process.exit(0);
  });

  // ── Prompt loop ──
  const ask = () => {
    rl.question(paint(c.green, c.bold) + "You: " + c.reset, async (input) => {
      const trimmed = input.trim();

      if (!trimmed) return ask(); // ignore empty input
      if (["exit", "quit", "bye"].includes(trimmed.toLowerCase())) {
        rl.close();
        return;
      }

      // Add user message to history
      history.push({ role: "user", content: trimmed });

      const spinner = createSpinner("Claude is thinking");

      try {
        const response = await client.messages.create({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: SYSTEM_PROMPT,
          messages: history,
        });

        spinner.stop();

        // Extract text from response
        const reply = response.content
          .filter((block) => block.type === "text")
          .map((block) => block.text)
          .join("\n");

        // Add assistant reply to history (multi-turn memory)
        history.push({ role: "assistant", content: reply });

        // ── Render reply ──
        console.log(
          "\n" +
            paint(c.cyan, c.bold) +
            "Claude:" +
            c.reset +
            " " +
            paint(c.dim, `[${response.stop_reason}]`)
        );
        // Print wrapped text, indented
        const wrapped = wrap(reply, 78, "  ");
        console.log(paint(c.white, wrapped));

        // Token usage line
        const { input_tokens, output_tokens } = response.usage;
        console.log(
          paint(
            c.dim,
            `\n  ↳ tokens — in: ${input_tokens}  out: ${output_tokens}  total: ${input_tokens + output_tokens}\n`
          )
        );
      } catch (err) {
        spinner.stop();

        const status = err.status ?? "unknown";
        const msg = err.message ?? String(err);

        console.error(
          paint(c.red, `\n  ✖ API error (${status}): `) + paint(c.dim, msg)
        );

        // Common error hints
        if (status === 401)
          console.error(
            paint(c.yellow, "  → Check that your ANTHROPIC_API_KEY is correct.")
          );
        if (status === 429)
          console.error(
            paint(c.yellow, "  → Rate limited — wait a moment and try again.")
          );
        console.log();
      }

      ask(); // loop
    });
  };

  ask();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
