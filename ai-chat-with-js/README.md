# AI Chat CLI — Powered by Claude API

A clean, minimal **terminal chatbot** built with Node.js and the [Anthropic Claude API](https://docs.anthropic.com/). Supports multi-turn conversations, a live spinner, token usage tracking, and graceful error handling — all in a single script.

---

## Features

| Feature | Details |
|---|---|
| **Multi-turn memory** | Full conversation history sent each request |
| **Streaming spinner** | Animated indicator while Claude is responding |
| **Token usage** | Displays input / output / total tokens per reply |
| **Word wrapping** | Responses neatly formatted to 78 characters |
| **Error hints** | Friendly messages for 401, 429, and other API errors |
| **Zero dependencies\*** | Only the official `@anthropic-ai/sdk` package |

> \*Beyond the SDK, the script uses only Node.js built-ins (`readline`).

---

## Prerequisites

- **Node.js ≥ 18** — [Download here](https://nodejs.org/)
- An **Anthropic API key** — [Get one here](https://console.anthropic.com/)

---

## Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/ai-chat-cli.git
cd ai-chat-cli
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set your API key

**Linux / macOS:**
```bash
export ANTHROPIC_API_KEY=sk-ant-your-key-here
```

**Windows (PowerShell):**
```powershell
$env:ANTHROPIC_API_KEY = "sk-ant-your-key-here"
```

### 4. Run the chatbot

```bash
node ai-chat.js
# or
npm start
```

---

##  Demo

```
╔══════════════════════════════════════════╗
║           AI Chat — Claude API        ║
╚══════════════════════════════════════════╝
  Model : claude-sonnet-4-20250514
  Type  : your message and press Enter
  Quit  : type "exit" or press Ctrl+C

You: What is the Anthropic Claude API?

Claude: [end_turn]
  The Anthropic Claude API lets developers integrate Claude — Anthropic's AI
  assistant — into their own applications. You send messages via HTTP requests
  and receive text responses. It supports multi-turn conversations, tool use,
  vision (image inputs), and streaming.

  ↳ tokens — in: 42  out: 61  total: 103

You: exit
  Bye!
```

---

## Project Structure

```
ai-chat-cli/
├── ai-chat.js      ← Main chatbot script
├── package.json    ← Project metadata & dependencies
└── README.md       ← You are here
```

---

## Configuration

Open `ai-chat.js` and edit these constants at the top of the file:

```js
const MODEL       = "claude-sonnet-4-20250514"; // Claude model to use
const MAX_TOKENS  = 1024;                        // Max tokens per reply
const SYSTEM_PROMPT = "You are a helpful...";   // Personality / instructions
```

### Available Models

| Model | Description |
|---|---|
| `claude-sonnet-4-20250514` | Balanced — smart & fast (recommended) |
| `claude-opus-4-6` | Most capable, higher cost |
| `claude-haiku-4-5-20251001` | Fastest, lowest cost |

Full model list: [docs.anthropic.com/en/docs/about-claude/models](https://docs.anthropic.com/en/docs/about-claude/models/overview)

---

##  API Key Safety

- **Never commit your API key** to version control.
- Add `.env` to your `.gitignore` if you use a `.env` file.
- Use environment variables (as shown above) or a secrets manager.

A minimal `.gitignore` for this project:

```
node_modules/
.env
```

---

##  How It Works

1. **Reads user input** via Node.js `readline`.
2. **Appends** the message to a `history` array (`{ role, content }` pairs).
3. **Calls** `client.messages.create()` with the full history → multi-turn memory.
4. **Parses** the response content blocks and prints the text reply.
5. **Appends** Claude's reply to `history` so the next turn is context-aware.
6. **Loops** back to prompt the user again.

```
User input
    │
    ▼
history.push({ role: "user", content })
    │
    ▼
Anthropic API  ──►  { model, system, messages: history }
    │
    ▼
history.push({ role: "assistant", content: reply })
    │
    ▼
Print reply + token usage
    │
    ▼
Loop ↺
```

---

##  Extending This Project

Ideas for taking this further:

- **`.env` support** — use the [`dotenv`](https://www.npmjs.com/package/dotenv) package to load keys from a file.
- **Streaming output** — use `client.messages.stream()` to print tokens as they arrive.
- **Tool use** — give Claude tools like web search or a calculator.
- **Save chat history** — write conversations to a JSON file for review.
- **Web UI** — wrap the API calls in an Express server with a chat front-end.

---

## Resources

- [Anthropic API Docs](https://docs.anthropic.com/)
- [Claude Models Overview](https://docs.anthropic.com/en/docs/about-claude/models/overview)
- [Anthropic Node.js SDK](https://github.com/anthropic-ai/anthropic-sdk-node)
- [API Reference — Messages](https://docs.anthropic.com/en/api/messages)

---

##  License

MIT — free to use, modify, and distribute.
