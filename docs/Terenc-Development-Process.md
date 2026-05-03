# Terenc Development Process (org-level standard)

# Terenc Development Process

> **Status:** v2.3 — May 2, 2026 (inline close-out checklist required in issue bodies; autonomous Todo-queue mode codified)
> **Scope:** Standard process for any software project at Terenc that follows the Opus + Claude Code + Chris collaboration model.
> **Note:** This document should be referenced from every Terenc software project's context document and pinned in each project's [claude.ai](<http://claude.ai>) project knowledge.

This document captures how Chris (founder), Claude Opus (architecture / planning / review), and Claude Code (implementation) build software together. **Read this before starting any session.** It exists so we don't have to re-explain the workflow each time.

## The five phases

### 1\. Architecture

**Owner:** Opus + Chris.

Before any code is written, we have a design conversation covering:

* **User journey** — what the human does, step by step.
* **Data flow** — where data lives, how it moves, what shape it takes.
* **Failure modes** — what breaks, what the user sees when it does.
* **Definition of done** — what "complete" looks like for this feature.

For new feature areas, Opus is expected to ask EPC-operator-style questions before writing any implementation prompts. Architecture conversations precede issue creation, not the other way around.

**Output:** a design document (Markdown) capturing decisions and open questions. Uploaded to Linear as a project document. The document becomes the source of truth for the feature.

### 2\. Issue creation

**Owner:** Opus.

Opus drafts Linear issues for Claude Code to execute. Each issue includes:

* **Title** — clear statement of what is being built.
* **Context** — links to the relevant design doc(s) and the project context document.
* **Acceptance criteria** — observable, testable, specific.
* **Definition of done** — what the system looks like after this issue ships.
* **Scope guardrails** — what is *not* in this issue.
* **Workflow & close-out checklist** — the v2.3 close-out checklist below, pasted **inline and verbatim** into every issue body.

Issues are sized so Code can complete them in a single focused session. If an issue feels like it's growing beyond a session, it gets split.

**Inline checklist rule (added v2.3):** Issue descriptions MUST contain the close-out checklist inline, verbatim. Linking to this Process doc is supplemental, not substitutive — past sessions have shown that Code follows literal instructions in the issue body more reliably than instructions referenced via document ID. Linear's API silently truncates long descriptions and may collapse list items when several `TER-XXX` references appear in one paragraph; mitigate by spreading cross-issue references across separate sentences, splitting across multiple `save_issue` calls, or pinning the checklist as a comment if the description hits the truncation threshold.

## Operating modes (added v2.3)

Two equally-supported modes for running Phase 3:

* **Manual mode** (original): Opus drafts issue → Chris hands to Code interactively → Chris paces the loop turn by turn. Suitable for new feature areas, complex specs, or any session where Chris wants to observe Code's reasoning in real time.
* **Autonomous Todo-queue mode**: Chris launches Code with a standing prompt to "pick highest-priority Todo, execute the full v2.3 cycle, stop at In Review." Code self-orchestrates a single issue per launch with no Chris involvement until In Review. Suitable only for issues with locked specs and no open design questions.

**Constraint (both modes):** Code sessions run serially. Never launch a second Code session while one is active. Three doc-clobbering incidents have already occurred in projects using this process from parallel edits to the Linear context document.

**Standing prompt for autonomous mode** (template — adapt per project):

```
Read [PROJECT]_CONTEXT.md (Linear doc [DOC_ID]) in full.

Find the highest-priority issue in Todo status in the [PROJECT] Linear project. If none, stop and report.

Move the issue to In Progress. Read it in full plus any linked design docs.

Execute per the v2.3 close-out checklist embedded in the issue body. STOP at In Review. Do not merge. Do not move to Done.

If you hit any decision not covered by the issue spec or source-of-truth docs, stop and post a Linear comment asking Opus. Do not guess.
```

### 3\. Implementation

**Owner:** Claude Code.

This is the phase that has the most failure modes, so the workflow is prescriptive.

#### Code's session checklist

At the **start** of every session, Code:

1. Reads the project context document (e.g., `RYGO_CONTEXT.md`) using the document ID.
2. Reads the assigned Linear issue and any linked design docs.
3. **Moves the Linear issue from Backlog/Todo to "In Progress."**
4. Pulls the latest `main` and creates a feature branch using the Linear-provided `gitBranchName` (visible on every issue).

During the session, Code:

5. Implements the feature on the feature branch. **Never commits directly to** `main`.
6. Runs tests appropriate to the change (unit, integration, manual sanity).
7. **Updates the project context document.** Only the sections explicitly allowlisted in the next section of this document — never the locked decisions or open questions.

At the **end** of the session, Code:

 8. Pushes the feature branch to GitHub.
 9. **Opens a pull request** against `main`. PR title is the issue ID + short description (e.g., `TER-133: Add color placement engine`). PR description references the Linear issue URL and summarizes what changed.
10. Confirms CI passes on the PR. If CI fails, Code investigates and fixes before continuing.
11. Posts a status comment on the Linear issue describing what was done, what was tested, decisions made, and any blockers or surprises. Includes the PR URL.
12. **Moves the Linear issue from "In Progress" to "In Review."**
13. **STOPS.** Code does not move issues to Done. Code does not merge PRs. Both are handled later in the human + Opus loop.

#### Code never does these things

* Pushes directly to `main`.
* Moves an issue to "Done."
* Merges a PR.
* Edits any non-allowlisted section of the context document (see below).
* Invents architecture decisions that aren't in the design doc. If Code hits an unspecified decision, Code stops and asks via Linear comment.

### 4\. Review

**Owners:** Opus (technical review) + Chris (manual testing).

When Code moves an issue to "In Review," both Opus and Chris are notified by virtue of Chris seeing it in his inbox.

#### Opus reviews

* Reads the PR diff (via Chris pasting key files if necessary), the Code session summary on the Linear issue, and the context document.
* Verifies acceptance criteria are met item by item.
* Verifies the context document was updated additively in allowlisted sections only (locked decisions and open questions still present).
* Flags issues, gaps, or improvements as Linear comments on the issue.
* If technical issues are found, recommends moving the issue back to "In Progress" with notes on what to fix.
* If the implementation looks correct, signals "ready for manual testing" or "ready to merge" in a Linear comment.

#### Chris does manual testing and merges

* Performs the manual verification steps listed in the issue.
* Plays / uses the feature for things automated tests can't catch (UX feel, layout on actual devices, accessibility in real settings).
* If pass: Chris merges the PR on GitHub. Then **tells Opus the PR is merged** (e.g., in chat: "PR for TER-NNN is merged").
* If fail: Chris comments on the issue, moves back to "In Progress," and Code addresses the feedback in a new commit on the same branch.

### 5\. Close-out

**Owner:** Opus (acting on Chris's merge confirmation).

When Chris reports a PR is merged, Opus:

* Marks the Linear issue as **Done.**
* Updates the issue map in the project context document to reflect the new status.
* Updates locked sections of the context document where the merged change requires it (Project identity, Tech stack, Source-of-truth references, etc. — sections Code is not permitted to edit).
* Notes any drift caught during the close (e.g., status indicators on other issues that are stale, follow-ups surfaced during review).
* If a session-log entry was clobbered by parallel edits during the in-review phase, restores it.

This consolidates the close-out work in one place and removes a context switch for Chris (who's already in GitHub when he merges).

## Context document — editable sections (allowlist)

This section exists because Code has, in past sessions, restructured the project context document and silently dropped locked design decisions. The fix is an explicit allowlist.

**Code may edit these sections only:**

* **Session log.** Append a new entry at the bottom for each session. Never modify older entries.
* **Architecture notes.** Add new feature entries when a feature ships. Updating an existing entry is OK only when adding new factual information about what shipped (e.g., "now uses X library" after a dependency lands).
* **Issue map.** Update status indicators on existing entries — e.g., changing a Backlog entry to "✅ In Review" or marking a blocked issue as "✅ Unblocked." Code does NOT mark issues as Done — that's Opus's job after Chris reports a merge.

**Code may not edit these sections without explicit Opus instruction:**

* Project identity
* Tech stack (Opus updates this when a new dependency lands or a merged change requires it; Code can suggest additions in the session log)
* Source-of-truth documents
* Key design decisions (locked) — including all subsections
* Open questions
* Coding conventions
* The editable-sections allowlist itself

**If Code believes a locked decision needs to change:** Code stops, posts a Linear comment on the current issue describing the proposed change and reasoning, and waits for Opus to update the doc. Code does not silently restructure or remove content.

## Definition of done — close-out checklist (paste into every issue body)

This template is pasted **inline, verbatim** into every issue (v2.3 rule). **An issue is not "ready for review" by Code's standards until all of these are true:**

- [ ] Feature branch created from latest `main`, named per the Linear `gitBranchName`.
- [ ] All acceptance criteria in the issue are met.
- [ ] Tests written / updated as required by the issue.
- [ ] All tests pass locally (`npm run test` or project equivalent).
- [ ] Build passes locally (`npm run build` or project equivalent).
- [ ] Project context document updated **only in allowlisted sections** (Session log, Architecture notes, Issue map). No edits to locked decisions or open questions.
- [ ] Branch pushed to GitHub.
- [ ] Pull request opened against `main`. Title: `TER-NNN: <description>`. Description references the Linear issue URL and summarizes what changed.
- [ ] CI checks pass on the PR (build + test workflow green).
- [ ] Status comment posted on the Linear issue with: what was done, what was tested, decisions made, PR URL.
- [ ] Linear issue moved to "In Review."
- [ ] **Code stops here.** Do not move the issue to Done. Do not merge the PR.

Chris's checklist (after Opus review):

- [ ] Manual verification steps from the issue have been performed.
- [ ] PR merged on GitHub.
- [ ] Tell Opus the PR is merged. Opus marks the issue Done and updates the context doc.

## Linear state transitions

The states we use, who moves them, and when:

| State       | Who moves it              | When                                                         |
| ----------- | ------------------------- | ------------------------------------------------------------ |
| Backlog     | Opus                      | When the issue is created.                                   |
| Todo        | Opus or Chris             | Optional intermediate state for issues that are next up but not yet started. **Required for autonomous Todo-queue mode** — Code picks from Todo. |
| In Progress | Code                      | At the start of a session, after reading the issue.          |
| In Review   | Code                      | After PR is open and CI passes. Code's last action before stopping. |
| Done        | Opus                      | After Chris reports the PR is merged.                        |
| Canceled    | Chris (with Opus's input) | If the issue is no longer needed.                            |

**Rule:** Code never moves an issue to Done. Chris doesn't move issues to Done either — Opus handles it after merge confirmation.

## GitHub workflow

* `main` is protected. No direct pushes. All changes go through pull requests.
* **Branch protection rules** (configured by Chris in the GitHub repo settings):
  * Require a pull request before merging.
  * Require status checks (CI) to pass before merging.
  * The `build-and-test` job from `.github/workflows/ci.yml` is a required check.
* **Feature branches** are named per the Linear-provided `gitBranchName` field on the issue.
* **PR titles** start with the issue ID: `TER-133: Add color placement engine`.
* **PR descriptions** reference the Linear issue URL and summarize what changed at a high level.
* **One PR per issue.** If scope grows, split the issue rather than mixing concerns in one PR.

## Continuous integration

Every PR runs `.github/workflows/ci.yml` which executes:

* `npm ci` (clean install of locked dependencies)
* `npm run build` (must succeed)
* `npm run test` (all tests must pass)

Until CI is green, the PR cannot merge. This is the gate that prevents broken code from reaching `main`.

## Standard artifacts per project

| Artifact                                           | Purpose                                                      | Owner                         |
| -------------------------------------------------- | ------------------------------------------------------------ | ----------------------------- |
| Project context document (e.g., `RYGO_CONTEXT.md`) | Single canonical Markdown doc Code reads at session start and updates at session end (allowlisted sections only). | Code maintains, Opus reviews. |
| Design docs                                        | Per feature area, capturing architecture decisions and open questions. | Opus.                         |
| Linear project                                     | Project-level container for milestones, issues, documents.   | Opus creates, Chris approves. |
| GitHub repo                                        | Code, branches, PRs. Branch protection on `main`.            | Initialized at project start. |
| CI workflow                                        | `.github/workflows/ci.yml` — runs build + test on every PR.  | Initialized at project start. |
| [claude.ai](<http://claude.ai>) project            | Pinned project knowledge: this Process doc, the project's stable design docs, the project README. **NOT pinned:** the project context document — it changes every Code session and is fetched fresh from Linear at session start. | Chris creates, Opus advises.  |

## Tools

* **Linear** — projects, milestones, issues, design docs, status tracking.
* **GitHub** — code, branches, pull requests, code review.
* **GitHub Actions** — continuous integration.
* **Claude Code** — implementation agent, runs in terminal or VS Code.
* **Claude Opus** — architecture, issue authoring, code review, document drafting, issue close-out. Runs in [claude.ai](<http://claude.ai>) with the project pinned.
* **Google Drive (Terenc workspace)** — long-term doc storage, supplementary research, deliverables.

## Principles

* **Design before code.** Always have the design conversation before writing issues.
* **One source of truth per project** — the context document.
* **Issues are small, atomic, and acceptance-criteria-driven.** A good issue can be picked up by Code without further clarification from Chris.
* **Issues carry their own checklist.** v2.3: the close-out checklist lives inline in the issue body, not behind a doc reference.
* **Code never invents architecture.** If Code hits an unspecified decision, it stops and asks.
* **Code never closes issues.** "In Review" is the last state Code touches.
* **Code never restructures the context doc.** Allowlisted sections only.
* **Chris merges, Opus closes.** Reduces context-switching for Chris and lets Opus handle related cleanup atomically.
* **Manual testing is part of the loop.** Chris is in the verification path. Some things only humans can verify.
* **Context docs are living artifacts.** They are updated every Code session, additively, in allowlisted sections only.
* **CI is the gate.** Tests passing on Code's machine is not enough. Tests have to pass in CI for a PR to merge.
* **Serial sessions only.** No parallel Code launches; the context doc is last-write-wins on Linear.

## Reliable entry points for Code

* **AXIS:** `Linear:get_document` with document ID `af060fba-e980-4621-95ca-109f8ce767d3` (AXIS_CONTEXT.md).
* **RYGO:** `Linear:get_document` with document ID `6613a7c9-036c-45b3-89fb-fc473e596988` (RYGO_CONTEXT.md).
* (Future projects to be added here.)

## Changelog

* **v2.3 (May 2, 2026):** Added inline-close-out-checklist rule (Phase 2) after [TER-151](https://linear.app/terenc/issue/TER-151/yergers-rygo-rebrand-rename-brand-asset-wiring-lockup-localstorage) process miss demonstrated that doc-reference-only checklists are not reliably followed. Added Operating modes section codifying autonomous Todo-queue mode alongside the original manual mode. Added serial-sessions principle and [claude.ai](<http://claude.ai>) project artifact to Standard artifacts. Updated Phase 5 close-out language to make explicit that Opus updates locked sections of the context doc when merged changes require it.
* **v2.2 (May 1, 2026):** Opus marks issues Done after Chris reports a merge (was: Chris moves to Done). Reduces Chris's context-switching and consolidates close-out cleanup. Updated phase 4/5, state-transition table, and Chris's checklist accordingly.
* **v2.1 (May 1, 2026):** Added explicit "Context document — editable sections (allowlist)" after second occurrence of Code silently dropping locked decisions during a doc restructure.
* **v2 (May 1, 2026):** Made the workflow prescriptive. Added GitHub workflow, CI section, Definition of done template, Linear state-transition table.
* **v1 (May 1, 2026):** Initial version.