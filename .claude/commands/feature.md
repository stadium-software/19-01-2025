---
description: Start a new feature - guides you through creating specs and starting development
model: haiku
---

You are helping a user start building a new feature. Your job is to guide them to the right next step based on their current situation.

## Step 1: Check for Existing Specs

First, check if there are any feature specifications in the `documentation/` folder:

```bash
ls documentation/
```

Look for `.md` files (other than README.md) that could be feature specs.

## Step 2: Guide Based on What You Find

### If NO specs found (only README.md or .gitkeep):

Tell the user:

> **No feature specs found yet!**
>
> To build a feature, you first need to describe what you want. Here's how:
>
> 1. Create a new file in `documentation/` (e.g., `documentation/my-feature.md`)
> 2. Describe your feature using the template in `documentation/README.md`
> 3. Run `/start` to begin the AI-guided development workflow
>
> **Quick example:**
> ```markdown
> # Feature: User Dashboard
>
> ## Overview
> A dashboard showing user activity and quick actions.
>
> ## User Stories
> - As a user, I want to see my recent activity
> - As a user, I want quick access to common tasks
> ```
>
> **Need help?** Just describe what you want to build, and I can help you write the spec!

Then ask: "What feature would you like to build? I can help you write the spec."

### If specs ARE found:

List the specs found and tell the user:

> **Found feature spec(s):**
> - [list the .md files found]
>
> **Ready to start?** Run `/start` to begin the development workflow.
>
> The workflow will:
> 1. Read your spec from `documentation/`
> 2. Create wireframes (optional, for UI features)
> 3. Break it into epics and stories
> 4. Generate tests
> 5. Implement the code
> 6. Review and verify quality

Then ask: "Would you like to start the workflow now, or would you like to review/edit your spec first?"

## Step 3: Show Available Commands

Always end by showing available commands:

> **Available Commands:**
> | Command | Description |
> |---------|-------------|
> | `/start` | Begin the TDD workflow (reads specs from `documentation/`) |
> | `/status` | See where you are in the workflow |
> | `/continue` | Resume an interrupted workflow |
> | `/feature` | This command - helps you get started |
> | `/quality-check` | Run all quality gates before creating a PR |
> | `/setup` | Verify project setup and dependencies |

## Helpful Tips

- If the user seems unsure, offer to help them write a spec
- If they describe a feature verbally, offer to create the spec file for them
- Keep responses friendly and encouraging
- Point them to `documentation/README.md` for the spec template
