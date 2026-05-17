Analyze the current repository and verify that the workspace is synchronized with the real filesystem and Git branch.

Tasks:

* detect current branch state
* detect detached HEAD
* verify remote tracking branch
* verify write access to repository
* check whether edits are applied to real files or virtual workspace only
* verify GitHub authentication/token state
* detect duplicate workspace snapshots

Show:

1. current branch
2. tracking branch
3. git status
4. uncommitted changes
5. whether edits are persisted to filesystem
6. whether the environment is read-only or ephemeral

Do not modify architecture yet.
Focus only on repository/workspace stability.
