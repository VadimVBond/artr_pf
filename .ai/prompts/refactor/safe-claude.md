# Claude Prompt: Safe Refactoring

Refactor the provided code carefully.

## Core Directives
1. **Preserve Structure**: DO NOT change the file structure or logic flow unless it is the goal of the task.
2. **Incremental**: Make small, verifiable changes.
3. **No Deletions**: Do not remove comments, JSDoc, or important logic without explicit instructions.

## Rules
- Follow `.ai/memory/ai-behavior.md`.
- Use `diff` format or complete file replacement if necessary, but keep it clean.
- Explain changes briefly in Russian after the code.
