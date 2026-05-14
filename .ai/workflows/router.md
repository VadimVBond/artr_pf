# AI Router

Task routing and fallback logic:

## Primary Routing
- **Analyze** -> GPT (`prompts/analyze/full-project.gpt.md`)
- **Large refactor** -> Claude (`prompts/refactor/safe-claude.md`)
- **Generate components** -> Qwen (`prompts/generate/fast-qwen.md`)
- **Localization** -> Any (`prompts/generate/translate-content.md`)

## Fallback Logic
1. If **GPT Analysis** fails or is ambiguous:
   - Route to **Claude** for a "second opinion" audit.
2. If **Qwen Generation** has bugs:
   - Route to **GPT** for debugging and fix.
3. If **Claude Refactor** is too slow:
   - Route to **GPT** with "incremental" constraint.

## Behavioral Rule
- ALWAYS check `.ai/memory/ai-behavior.md` before execution.
