/**
 * pi-git — typed git ops for pi agents (beyond what bash offers).
 *
 *   git_log      — recent commits (graph, oneline)
 *   git_blame    — who touched a file/line range
 *   git_diff     — staged/unstaged/branch diffs
 *   git_status   — worktree state
 *   git_branches — branches + ahead/behind
 *   git_file_history — a file's commit history
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { execFile } from "node:child_process";
import { Type } from "typebox";

const MAX_OUT = 12000;

function run(args: string[], cwd: string): Promise<string> {
	return new Promise((resolve) => {
		execFile("git", args, { cwd, timeout: 30_000, maxBuffer: 16 * 1024 * 1024 }, (e, o, er) => {
			const out = String(o ?? "") + (er ? `\n${er}` : "");
			resolve(
				out.length > MAX_OUT ? out.slice(0, MAX_OUT) + "\n[truncated]" : out || "(no output)",
			);
		});
	});
}

export default function piGit(pi: ExtensionAPI) {
	pi.registerTool({
		name: "git_log",
		label: "Git Log",
		description: "Recent commits — graph view with authors/dates.",
		parameters: Type.Object({
			n: Type.Optional(Type.Number({ description: "default 15" })),
			oneline: Type.Optional(Type.Boolean()),
		}),
		async execute(_id, p, _s, _u, ctx: { cwd: string }) {
			const fmt = p.oneline === false
				? "medium"
				: "--oneline --graph --decorate";
			const out = await run(
				["log", `-${p.n ?? 15}`, ...(fmt === "medium" ? [] : fmt.split(" "))],
				ctx.cwd,
			);
			return { content: [{ type: "text" as const, text: out }], details: null };
		},
	});

	pi.registerTool({
		name: "git_blame",
		label: "Git Blame",
		description: "Who wrote each line of a file (or line range).",
		parameters: Type.Object({
			path: Type.String(),
			start: Type.Optional(Type.Number()),
			end: Type.Optional(Type.Number()),
		}),
		async execute(_id, p, _s, _u, ctx: { cwd: string }) {
			const args = ["blame", "--date=short"];
			if (p.start && p.end) args.push("-L", `${p.start},${p.end}`);
			args.push(p.path);
			return { content: [{ type: "text" as const, text: await run(args, ctx.cwd) }], details: null };
		},
	});

	pi.registerTool({
		name: "git_diff",
		label: "Git Diff",
		description: "Diff — staged/unstaged, or between branches/commits.",
		parameters: Type.Object({
			target: Type.Optional(Type.String({ description: "e.g. HEAD~3, main, --staged" })),
			stat: Type.Optional(Type.Boolean({ description: "summary only" })),
		}),
		async execute(_id, p, _s, _u, ctx: { cwd: string }) {
			const args = ["diff"];
			if (p.stat) args.push("--stat");
			if (p.target) args.push(p.target);
			return { content: [{ type: "text" as const, text: await run(args, ctx.cwd) }], details: null };
		},
	});

	pi.registerTool({
		name: "git_status",
		label: "Git Status",
		description: "Worktree state — modified, staged, untracked.",
		parameters: Type.Object({}),
		async execute(_id, _p, _s, _u, ctx: { cwd: string }) {
			return { content: [{ type: "text" as const, text: await run(["status", "-sb"], ctx.cwd) }], details: null };
		},
	});

	pi.registerTool({
		name: "git_branches",
		label: "Git Branches",
		description: "Branches with upstream + ahead/behind.",
		parameters: Type.Object({}),
		async execute(_id, _p, _s, _u, ctx: { cwd: string }) {
			return {
				content: [{
					type: "text" as const,
					text: await run(["branch", "-vv", "--sort=-committerdate"], ctx.cwd),
				}],
				details: null,
			};
		},
	});

	pi.registerTool({
		name: "git_file_history",
		label: "Git File History",
		description: "A file's commit history — who changed it, when, why.",
		parameters: Type.Object({
			path: Type.String(),
			n: Type.Optional(Type.Number({ description: "default 10" })),
		}),
		async execute(_id, p, _s, _u, ctx: { cwd: string }) {
			return {
				content: [{
					type: "text" as const,
					text: await run(
						["log", `-${p.n ?? 10}`, "--oneline", "--follow", "--", p.path],
						ctx.cwd,
					),
				}],
				details: null,
			};
		},
	});
}
