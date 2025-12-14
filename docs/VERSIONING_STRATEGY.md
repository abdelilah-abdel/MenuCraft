# Versioning & Release Strategy - MenuCraft

> **Version Control System:** Git + GitHub
> **Branching Model:** Git Flow (modified)
> **Release Cycle:** Feature-driven releases
> **Last Updated:** 2025-12-14

---

## Table of Contents

1. [Versioning Scheme](#versioning-scheme)
2. [Branch Strategy](#branch-strategy)
3. [Feature ID System](#feature-id-system)
4. [Commit Message Convention](#commit-message-convention)
5. [Release Process](#release-process)
6. [Hotfix Process](#hotfix-process)
7. [Examples](#examples)

---

## Versioning Scheme

### Semantic Versioning 2.0.0

```
MAJOR.MINOR.PATCH

Example: 2.1.3
```

#### Version Components

- **MAJOR** (2) - Incompatible API changes, major architectural shifts
- **MINOR** (1) - New features, backward-compatible
- **PATCH** (3) - Bug fixes, backward-compatible

### Current Version

```
V1.0.0 - MVP Launch (Current)
```

---

## Version Milestones

### V1.x - Foundation

```
V1.0.0 - MVP (Menu builder, templates, QR codes)
V1.1.0 - Drag-and-drop reordering ← NEXT
V1.2.0 - Enhanced templates
V1.3.0 - Export/Import improvements
```

### V2.x - Backend & Auth

```
V2.0.0 - User authentication, database, API
V2.1.0 - Analytics dashboard
V2.2.0 - Team collaboration
V2.3.0 - Custom domains
```

### V3.x - Advanced Features

```
V3.0.0 - A/B testing, seasonal scheduling
V3.1.0 - Multi-language support
V3.2.0 - POS integrations
V3.3.0 - Online ordering
```

### V4.x - AI & Automation

```
V4.0.0 - AI menu generation
V4.1.0 - AI price optimization
V4.2.0 - AI image enhancement
```

---

## Branch Strategy

### Main Branches

```
main              # Production-ready code (stable)
develop           # Development branch (integration)
```

### Supporting Branches

```
feature/*         # New features
bugfix/*          # Bug fixes for develop
hotfix/*          # Urgent production fixes
release/*         # Release preparation
```

---

## Branch Naming Convention

### Feature Branches

```
feature/<feature-id>-<short-description>

Examples:
feature/FEAT-001-drag-drop-reordering
feature/FEAT-002-user-authentication
feature/FEAT-006-analytics-dashboard
```

### Bugfix Branches

```
bugfix/<bug-id>-<short-description>

Examples:
bugfix/BUG-001-qr-code-download-error
bugfix/BUG-002-image-upload-validation
```

### Hotfix Branches

```
hotfix/<version>-<description>

Examples:
hotfix/1.0.1-menu-save-crash
hotfix/2.1.2-authentication-bypass
```

### Release Branches

```
release/<version>

Examples:
release/1.1.0
release/2.0.0
```

---

## Feature ID System

### Format

```
<TYPE>-<NUMBER>-<NAME>

Examples:
FEAT-001-DND          # Feature 001: Drag-and-Drop
FEAT-002-AUTH         # Feature 002: Authentication
BUG-001-QR-DOWNLOAD   # Bug 001: QR Download Issue
TASK-001-REFACTOR     # Task 001: Code Refactoring
```

### Types

- **FEAT** - New feature
- **BUG** - Bug fix
- **TASK** - Refactoring, cleanup, documentation
- **HOTFIX** - Urgent production fix
- **CHORE** - Dependencies, configuration

### ID Assignment

Features are assigned IDs in PROJECT_VISION.md:

```markdown
### V1.1 - Drag-and-Drop
**Feature ID:** FEAT-001-DND
**Branch:** feature/FEAT-001-drag-drop-reordering
```

---

## Commit Message Convention

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

- **feat** - New feature
- **fix** - Bug fix
- **docs** - Documentation changes
- **style** - Code style (formatting, no logic change)
- **refactor** - Code refactoring
- **test** - Adding tests
- **chore** - Build process, dependencies

### Scope

Component or area affected:

- `builder` - Menu builder component
- `preview` - Menu preview/templates
- `api` - API routes
- `db` - Database layer
- `auth` - Authentication
- `ui` - UI components

### Examples

```bash
# Feature
feat(builder): add drag-and-drop section reordering (#FEAT-001)

# Bug fix
fix(preview): correct image rendering in classic template (#BUG-003)

# Refactor
refactor(builder): extract MenuBuilder into smaller components

# Documentation
docs(readme): add setup instructions for local development

# Chore
chore(deps): upgrade Next.js to 16.1.0
```

---

## Detailed Commit Message Example

```
feat(builder): add drag-and-drop section reordering (#FEAT-001)

Implements drag-and-drop functionality for menu sections using @dnd-kit/core.

Changes:
- Add @dnd-kit/core and @dnd-kit/sortable dependencies
- Create DraggableSection component wrapper
- Update MenuBuilder to handle reorder operations
- Add visual feedback during drag operations

Related to: FEAT-001-DND
Closes: #45
```

---

## Release Process

### 1. Create Release Branch

```bash
# From develop branch
git checkout develop
git pull origin develop
git checkout -b release/1.1.0
```

### 2. Finalize Release

- Update version in `package.json`
- Update `CHANGELOG.md`
- Run final tests
- Fix any bugs found

```bash
# Update version
npm version minor  # 1.0.0 → 1.1.0

# Commit changes
git commit -am "chore(release): prepare v1.1.0"
```

### 3. Merge to Main

```bash
# Merge to main
git checkout main
git merge release/1.1.0
git tag -a v1.1.0 -m "Release v1.1.0 - Drag-and-Drop"
git push origin main --tags

# Merge back to develop
git checkout develop
git merge release/1.1.0
git push origin develop

# Delete release branch
git branch -d release/1.1.0
```

### 4. Deploy

```bash
# Vercel auto-deploys from main branch
# Or manual deploy:
vercel --prod
```

---

## Hotfix Process

### When to Use Hotfix

- Critical production bugs
- Security vulnerabilities
- Data corruption issues

### Hotfix Workflow

```bash
# 1. Create hotfix branch from main
git checkout main
git checkout -b hotfix/1.0.1-menu-save-crash

# 2. Fix the issue
git commit -am "fix(builder): prevent crash on menu save (#HOTFIX-001)"

# 3. Update version
npm version patch  # 1.0.0 → 1.0.1

# 4. Merge to main
git checkout main
git merge hotfix/1.0.1-menu-save-crash
git tag -a v1.0.1 -m "Hotfix v1.0.1 - Menu save crash"
git push origin main --tags

# 5. Merge to develop
git checkout develop
git merge hotfix/1.0.1-menu-save-crash
git push origin develop

# 6. Delete hotfix branch
git branch -d hotfix/1.0.1-menu-save-crash

# 7. Deploy immediately
vercel --prod
```

---

## Git Workflow Examples

### Example 1: Adding Drag-and-Drop Feature

```bash
# 1. Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/FEAT-001-drag-drop-reordering

# 2. Implement feature
# ... make changes ...
git add .
git commit -m "feat(builder): add DraggableSection component (#FEAT-001)"

# ... more commits ...
git commit -m "feat(builder): implement reorder logic (#FEAT-001)"

# 3. Push to remote
git push origin feature/FEAT-001-drag-drop-reordering

# 4. Create Pull Request on GitHub
# Title: "FEAT-001: Add drag-and-drop section reordering"
# Description: Links to issue, screenshots, testing notes

# 5. After PR approval, merge to develop
git checkout develop
git merge feature/FEAT-001-drag-drop-reordering
git push origin develop

# 6. Delete feature branch
git branch -d feature/FEAT-001-drag-drop-reordering
git push origin --delete feature/FEAT-001-drag-drop-reordering
```

### Example 2: Fixing a Bug

```bash
# 1. Create bugfix branch
git checkout develop
git checkout -b bugfix/BUG-001-qr-code-download-error

# 2. Fix bug
git add lib/services/qrService.ts
git commit -m "fix(qr): correct QR code download filename encoding (#BUG-001)"

# 3. Push and create PR
git push origin bugfix/BUG-001-qr-code-download-error

# 4. After merge
git checkout develop
git pull origin develop
```

---

## Changelog Management

### CHANGELOG.md Format

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Drag-and-drop section reordering (#FEAT-001)

### Fixed
- QR code download filename encoding (#BUG-001)

## [1.0.0] - 2025-12-14

### Added
- Initial MVP release
- Menu builder with sections and items
- Template system (Classic, Modern, Minimal)
- QR code generation
- Real-time preview

## [0.1.0] - 2025-11-01

### Added
- Project setup
- Basic component structure
```

---

## Pull Request Guidelines

### PR Title Format

```
<FEATURE-ID>: <Short description>

Examples:
FEAT-001: Add drag-and-drop section reordering
BUG-003: Fix image rendering in classic template
TASK-002: Refactor MenuBuilder into smaller components
```

### PR Description Template

See `.github/PULL_REQUEST_TEMPLATE.md` for full template

```markdown
## Feature ID
FEAT-001-DND

## Description
Implements drag-and-drop functionality for menu sections.

## Changes
- Added @dnd-kit/core dependency
- Created DraggableSection component
- Updated MenuBuilder with reorder logic

## Screenshots
[Include before/after screenshots or GIF]

## Testing
- [ ] Tested drag-and-drop on desktop
- [ ] Tested drag-and-drop on mobile
- [ ] Verified order persists after save

## Related Issues
Closes #45
```

---

## Version Migration Guide

### When Upgrading Major Versions

Create a migration guide for breaking changes:

```markdown
# Migration Guide: V1 → V2

## Breaking Changes

### localStorage → Database
**Old:** Data stored in browser localStorage
**New:** Data stored in PostgreSQL database

**Action Required:**
1. Export your menus before upgrading
2. Create account in V2
3. Import menus using migration tool

### Image Storage
**Old:** Base64 images in localStorage
**New:** Cloud storage (Cloudinary)

**Action Required:**
- Images will be automatically migrated on first login
```

---

## Best Practices

### Commit Often

```bash
# ✅ Good - Small, focused commits
git commit -m "feat(builder): add DraggableSection component"
git commit -m "feat(builder): implement reorder logic"
git commit -m "test(builder): add drag-drop tests"

# ❌ Bad - One massive commit
git commit -m "add drag and drop feature"
```

### Write Descriptive Messages

```bash
# ✅ Good
git commit -m "fix(preview): prevent image overflow in mobile view (#BUG-012)

The menu preview was showing clipped images on mobile devices
due to fixed width. Updated to use responsive sizing with max-width."

# ❌ Bad
git commit -m "fix images"
```

### Reference Issues

```bash
# Link commits to issues/features
git commit -m "feat(analytics): add view tracking (#FEAT-006)

Implements basic analytics for menu views.
Related to: #67"
```

---

## CI/CD Integration

### GitHub Actions (Planned for V2)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [develop, main]
  pull_request:
    branches: [develop, main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Run build
        run: npm run build
```

---

## FAQs

### Q: When should I create a new major version?

**A:** When you make breaking changes that require users to migrate data or update their integration code.

### Q: Should every PR have a feature ID?

**A:** Yes, except for minor chores (typo fixes, dependency updates without logic changes).

### Q: Can I work directly on develop?

**A:** No, always create a feature branch. This keeps develop stable and enables code review.

### Q: How do I name a branch for documentation changes?

**A:** Use `docs/<description>` for pure documentation changes, or include in related feature branch.

---

## Quick Reference

```bash
# Create feature branch
git checkout -b feature/FEAT-XXX-description

# Commit with convention
git commit -m "feat(scope): description (#FEAT-XXX)"

# Push feature
git push origin feature/FEAT-XXX-description

# Create release
git checkout -b release/X.Y.0
npm version minor
git push origin release/X.Y.0
```

---

**Last Updated:** 2025-12-14
**Next Review:** Before V2.0.0 release
