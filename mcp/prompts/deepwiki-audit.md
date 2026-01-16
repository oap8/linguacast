# Project Audit Prompt

> Use this prompt to audit LinguaCast before major releases, after feature batches, or weekly.

## Instructions

Audit this repository as a **senior frontend engineer**. Be strict and practical.

**Project**: LinguaCast  
**Type**: Podcast-based English learning web app  
**Stack**: React, TypeScript, Vite, TailwindCSS, shadcn/ui

---

## Audit Checklist

### 1. Architecture Compliance
- [ ] Frontend contains NO business logic (XP, levels, streaks calculated in services)
- [ ] CEFR logic is centralized in `src/features/placement/`
- [ ] All features follow the `types → service → hooks → components` pattern
- [ ] No direct state mutations outside services

### 2. Code Quality
- [ ] No unused imports or exports
- [ ] No `any` types (use proper TypeScript types)
- [ ] No hardcoded strings that should be constants
- [ ] Consistent naming conventions (camelCase for functions, PascalCase for components)
- [ ] No console.log statements in production code

### 3. File Structure
- [ ] Features organized in `src/features/{feature-name}/`
- [ ] Pages in `src/pages/`
- [ ] Shared components in `src/components/`
- [ ] Types co-located with their features

### 4. Dependencies & Imports
- [ ] No circular dependencies
- [ ] No broken imports
- [ ] Imports sorted (React first, then external, then internal)

### 5. UI/UX Consistency
- [ ] Using shadcn/ui components consistently
- [ ] TailwindCSS classes follow project patterns
- [ ] Responsive design implemented
- [ ] Loading and error states handled

### 6. Data Flow
- [ ] Mock data clearly separated from real API calls
- [ ] Services handle all data fetching
- [ ] Hooks wrap services for React components

### 7. Security & Best Practices
- [ ] No secrets or API keys in code
- [ ] Form inputs validated
- [ ] User input sanitized

---

## Output Format

Provide your audit as:

```markdown
## Audit Report - [DATE]

### Summary
[Pass/Fail] - [Brief overview]

### Critical Issues (Must Fix)
1. [Issue] - [File] - [How to fix]

### Warnings (Should Fix)
1. [Issue] - [File] - [Recommendation]

### Suggestions (Nice to Have)
1. [Improvement idea]

### Compliance Score
- Architecture: X/10
- Code Quality: X/10
- Structure: X/10
- Overall: X/10

### Next Steps
1. [Priority action item]