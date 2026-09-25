# pi-git

A [pi](https://github.com/earendil-works/pi-coding-agent) extension that gives agents
dedicated, typed git tools — beyond what ad-hoc `bash` calls offer. Each tool wraps a
git command with a fixed, safe argument surface and returns truncated text output
(suitable for agent context windows).

## Tools

| Tool | Description |
|---|---|
| `git_log` | Recent commits — graph view with authors/dates. |
| `git_blame` | Who wrote each line of a file (or line range). |
| `git_diff` | Diff — staged/unstaged, or between branches/commits. |
| `git_status` | Worktree state — modified, staged, untracked (`git status -sb`). |
| `git_branches` | Branches with upstream + ahead/behind (`git branch -vv`). |
| `git_file_history` | A file's commit history — who changed it, when, why (`--follow`). |

### Parameters

**`git_log`**

| Param | Type | Default | Notes |
|---|---|---|---|
| `n` | number | 15 | Number of commits to show. |
| `oneline` | boolean | true | `false` switches to `medium` format; otherwise `--oneline --graph --decorate`. |

**`git_blame`**

| Param | Type | Default | Notes |
|---|---|---|---|
| `path` | string | — | **Required.** File to blame. |
| `start` | number | — | First line of range (requires `end`). |
| `end` | number | — | Last line of range (requires `start`). |

**`git_diff`**

| Param | Type | Default | Notes |
|---|---|---|---|
| `target` | string | — | e.g. `HEAD~3`, `main`, `--staged`. |
| `stat` | boolean | false | Summary only (`--stat`). |

**`git_status`** — no parameters.

**`git_branches`** — no parameters. Sorted by most recent commit.

**`git_file_history`**

| Param | Type | Default | Notes |
|---|---|---|---|
| `path` | string | — | **Required.** File to trace. |
| `n` | number | 10 | Number of commits to show. |

## Install

The package declares its extension via the `pi.extensions` field in `package.json`:

```json
"pi": { "extensions": ["./extensions/index.ts"] }
```

Install it with pi:

```sh
pi install mohammadraufzahed/pi-git
```

or via npm:

```sh
npm install pi-git
```

Requires `git` on `PATH`. Peer dependencies: `@earendil-works/pi-coding-agent`, `typebox`.

## Example

Once installed, the agent can answer questions like "who last touched the auth
middleware" or "what changed on this branch" directly:

```
> What changed in the last 5 commits?

git_log({ n: 5 })
→ * a3f9c21 (HEAD -> main) Fix session expiry edge case
  * 0b77e10 Refactor token refresh
  ...
```

```
> Who wrote the retry logic in src/http.ts?

git_blame({ path: "src/http.ts", start: 40, end: 60 })
```

## License

MIT
