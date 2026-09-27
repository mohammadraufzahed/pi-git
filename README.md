# pi-git

Pi extension — typed git operations for pi agents, beyond what bash offers.

## Install

```bash
pi install mohammadraufzahed/pi-git
```

The package exposes its extension via `pi.extensions` in `package.json`, so pi picks it up automatically.

## Tools

| Tool | Description | Parameters |
| --- | --- | --- |
| `git_log` | Recent commits — graph view with authors/dates. | `n` (number, default 15), `oneline` (boolean) |
| `git_blame` | Who wrote each line of a file (or line range). | `path` (string, required), `start`, `end` (numbers, optional) |
| `git_diff` | Diff — staged/unstaged, or between branches/commits. | `target` (string, e.g. `HEAD~3`, `main`, `--staged`), `stat` (boolean — summary only) |
| `git_status` | Worktree state — modified, staged, untracked. | — |
| `git_branches` | Branches with upstream + ahead/behind. | — |
| `git_file_history` | A file's commit history — who changed it, when, why. | `path` (string, required), `n` (number, default 10) |

All tools run against the current working directory and truncate output at 12 000 characters.

## License

MIT — see [LICENSE](LICENSE).
