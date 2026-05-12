# AI Router

Task routing and fallback logic:

## Primary Routing
- **Analyze** -> GPT (Full project context)
- **Large refactor** -> Claude (Safe and careful)
- **Generate components** -> Qwen (Speed and boilerplate)

## Fallback Logic
1. If **GPT Analysis** fails or is ambiguous:
   - Route to **Claude** for a "second opinion" audit.
2. If **Qwen Generation** has bugs:
   - Route to **GPT** for debugging and fix.
3. If **Claude Refactor** is too slow:
   - Route to **GPT** with "incremental" constraint.

## Behavioral Rule
- ALWAYS check `.ai/memory/ai-behavior.md` before execution.
