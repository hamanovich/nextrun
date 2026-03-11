---
trigger: always_on
---

# Project Memory: NextRun

## Business Context (The "What & Why")

- **Purpose:** A personal Telegram bot for voice journaling with AI analysis. Send voice message or text about your day - the bot will transcribe, structure, and save everything (mood, sports, food, reading, investments, etc.).
- **Target Audience:** Solo users wanting quick, structured daily journaling via Telegram without typing long texts.
- **Core Value:** Speed of logging via bot using voice, AI-powered automatic structuring into daily metrics.

## Architectural Truths (The "How")

- **Database:** Supabase (PostgreSQL) integrated in `src/services/db.ts`. Schema creates one log per day.
- **Grammy Logic:** Built with grammY running on Bun. Logic is split between `src/bot/handlers.ts` and `src/bot/callbacks.ts`. AI Transcription mapping is in `src/services/openai.ts`.
- **Runtime Logic:** AI processes use OpenAI Whisper for voice and GPT for entity extraction directly in the backend.

## Current Status & Focus

- **Working On:** Building out the core telegram bot features, parsing voice and extracting structured data to Supabase.
- **Latest Milestone:** Bot can transcribe via Whisper and extract structured achievements. Added unit tests for key branching paths in handlers and callbacks.
- **Pending Debt:** Ensuring consistent merging of multiple messages into a single daily log.

## The "Never" List (Lessons Learned)

- **Do NOT** blindly overwrite daily logs; follow-up messages must merge into the existing daily entry.
