# Audit Workflow

> Mandatory steps to maintain code quality and consistency in LinguaCast.

## When to Run Audits

| Trigger | Type | Required |
|---------|------|----------|
| Before PR merge | Full audit | ✅ Mandatory |
| After 3+ features | Full audit | ✅ Mandatory |
| Weekly (Fridays) | Quick audit | ✅ Mandatory |
| Before deployment | Full audit | ✅ Mandatory |
| After refactoring | Targeted audit | Recommended |

---

## How to Run an Audit

### Option 1: Ask Cascade (Recommended)
```
@audit - Run a full project audit using mcp/prompts/deepwiki-audit.md
```

### Option 2: Manual Checklist
1. Open `mcp/prompts/deepwiki-audit.md`
2. Go through each checklist item
3. Document findings in `mcp/audits/YYYY-MM-DD.md`

---

## Enforcement Methods

### 1. Pre-commit Hook (Automated)
Add to `.husky/pre-commit`:
```bash
# Run TypeScript check
npm run typecheck

# Run linter
npm run lint
```

### 2. GitHub Actions (CI/CD)
Add `.github/workflows/audit.yml`:
```yaml
name: Code Quality
on: [push, pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run build
```

### 3. PR Template
Create `.github/PULL_REQUEST_TEMPLATE.md`:
```markdown
## Pre-merge Checklist
- [ ] Ran `npm run build` successfully
- [ ] Ran project audit (no critical issues)
- [ ] Updated MCP docs if architecture changed
- [ ] Tested in browser
```

---

## Quick Commands

```bash
# TypeScript check
npm run typecheck

# Lint check
npm run lint

# Build check
npm run build

# All checks
npm run typecheck && npm run lint && npm run build
```

---

## Audit History

Store audit reports in `mcp/audits/` with format:
- `mcp/audits/2026-01-15.md`
- `mcp/audits/2026-01-22.md`

This creates a trail of project health over time.
