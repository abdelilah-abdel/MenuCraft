# MenuCraft Documentation Hub

Welcome to the MenuCraft documentation! This folder contains all the guides and strategies for building and maintaining MenuCraft.

---

## 📚 Documentation Overview

### For Developers

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [**FRONTEND_GUIDE.md**](./FRONTEND_GUIDE.md) | UI/UX development guide with design system, component patterns, and styling conventions | **Before writing any code** |
| [**VERSIONING_STRATEGY.md**](./VERSIONING_STRATEGY.md) | Git workflow, branching strategy, commit conventions, and release process | **Before creating branches** |
| [**COLLABORATION_GUIDE.md**](./COLLABORATION_GUIDE.md) | Team workflow, code review process, and communication guidelines | **When joining the team** |

### For Product/Business

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [**PROJECT_VISION.md**](./PROJECT_VISION.md) | Business model, revenue streams, feature roadmap, and success metrics | **For strategic planning** |

### For Contributors

| Template | Purpose | When to Use |
|----------|---------|-------------|
| [**PR Template**](../.github/PULL_REQUEST_TEMPLATE.md) | Pull request template with checklist | **When creating PRs** |

---

## 🚀 Quick Start Paths

### New Developer Onboarding

1. ✅ Read **COLLABORATION_GUIDE.md** (Team workflow)
2. ✅ Read **FRONTEND_GUIDE.md** (Design system & code conventions)
3. ✅ Read **VERSIONING_STRATEGY.md** (Git workflow)
4. ✅ Pick a "good first issue" from GitHub
5. ✅ Create feature branch following naming convention
6. ✅ Code following FRONTEND_GUIDE.md
7. ✅ Submit PR using template

### Adding a New Feature

1. ✅ Check **PROJECT_VISION.md** to see if feature is planned
2. ✅ Find feature ID (e.g., FEAT-001-DND)
3. ✅ Create branch: `feature/FEAT-001-description`
4. ✅ Follow **FRONTEND_GUIDE.md** for implementation
5. ✅ Commit using convention from **VERSIONING_STRATEGY.md**
6. ✅ Create PR using template

### Reviewing Code

1. ✅ Check **COLLABORATION_GUIDE.md** (Review process)
2. ✅ Verify code follows **FRONTEND_GUIDE.md**
3. ✅ Test on mobile and desktop
4. ✅ Leave constructive feedback
5. ✅ Approve or request changes

---

## 📖 Document Summaries

### FRONTEND_GUIDE.md

**What's Inside:**
- Architecture overview (Next.js, React, TypeScript, Tailwind)
- Complete design system (colors, typography, spacing)
- Component structure and naming conventions
- Styling approach and best practices
- AI prompts for code generation
- Common patterns and examples

**Use This When:**
- Building new UI components
- Implementing features
- Styling components
- Choosing colors/fonts
- Writing prompts for AI assistance

---

### PROJECT_VISION.md

**What's Inside:**
- Business model (Freemium SaaS)
- Revenue streams and pricing tiers
- Version roadmap (V1 → V4)
- Feature ideas by version
- Market opportunity and competitive advantages
- Success metrics and goals

**Use This When:**
- Planning new features
- Understanding business goals
- Prioritizing work
- Making product decisions
- Pitching to investors/partners

---

### VERSIONING_STRATEGY.md

**What's Inside:**
- Semantic versioning (MAJOR.MINOR.PATCH)
- Branch strategy (main, develop, feature/*, bugfix/*, hotfix/*)
- Feature ID system (FEAT-001, BUG-003, etc.)
- Commit message conventions
- Release process
- Hotfix workflow

**Use This When:**
- Creating new branches
- Writing commit messages
- Planning releases
- Fixing production bugs
- Naming features/bugs

---

### COLLABORATION_GUIDE.md

**What's Inside:**
- Team roles and responsibilities
- Development workflow (7 steps)
- Code review process
- Communication guidelines
- Onboarding checklist
- Conflict resolution

**Use This When:**
- Joining the team
- Reviewing code
- Resolving merge conflicts
- Coordinating with team
- Making decisions

---

## 🎯 Common Scenarios

### "I want to add drag-and-drop"

1. Check **PROJECT_VISION.md** → Find FEAT-001-DND
2. Read **FRONTEND_GUIDE.md** → Component structure section
3. Create branch per **VERSIONING_STRATEGY.md**: `feature/FEAT-001-drag-drop-reordering`
4. Code following design system
5. Commit: `feat(builder): add drag-drop (#FEAT-001)`
6. Submit PR using template

### "I need to fix a bug in production"

1. Read **VERSIONING_STRATEGY.md** → Hotfix process
2. Create branch from `main`: `hotfix/1.0.1-description`
3. Fix bug
4. Commit: `fix(component): description (#HOTFIX-001)`
5. Merge to `main` and `develop`
6. Deploy immediately

### "I'm reviewing a PR"

1. Read **COLLABORATION_GUIDE.md** → Code Review Process
2. Check code against **FRONTEND_GUIDE.md** conventions
3. Test on mobile and desktop
4. Leave constructive feedback
5. Approve or request changes

### "I want to propose a new feature"

1. Read **PROJECT_VISION.md** → See if it aligns with roadmap
2. Create GitHub issue
3. Discuss with team
4. If approved, add to PROJECT_VISION.md with Feature ID
5. Implement per workflow above

---

## 🔄 Document Maintenance

### When to Update

| Document | Update When |
|----------|-------------|
| FRONTEND_GUIDE.md | New design patterns, component conventions |
| PROJECT_VISION.md | New features planned, business model changes |
| VERSIONING_STRATEGY.md | Workflow changes, new branch types |
| COLLABORATION_GUIDE.md | Team process changes, new tools |

### Who Can Update

- **Anyone** can propose updates via PR
- **Product Lead** approves PROJECT_VISION.md changes
- **Senior Devs** approve technical doc changes

---

## 💡 Pro Tips

### For Faster Development

1. **Bookmark** FRONTEND_GUIDE.md for quick design system reference
2. **Use AI prompts** from FRONTEND_GUIDE.md when coding
3. **Check PROJECT_VISION.md** before planning work
4. **Copy commit messages** from VERSIONING_STRATEGY.md examples

### For Better Collaboration

1. **Link docs in PRs** when explaining decisions
2. **Update docs** when you find gaps
3. **Ask questions** via GitHub Issues
4. **Share knowledge** in team discussions

### For Code Quality

1. **Review FRONTEND_GUIDE.md** before each PR
2. **Self-review** using PR template checklist
3. **Test mobile** even for desktop features
4. **Follow naming conventions** consistently

---

## 📞 Getting Help

### I have a question about...

- **Design system** → Check FRONTEND_GUIDE.md
- **Git workflow** → Check VERSIONING_STRATEGY.md
- **Team process** → Check COLLABORATION_GUIDE.md
- **Product roadmap** → Check PROJECT_VISION.md
- **Still stuck?** → Ask in GitHub Discussions

### Found an Error in Docs?

1. Create PR with fix
2. Tag @project-lead for review
3. Help future team members!

---

## 📊 Documentation Metrics

**Last Updated:** 2025-12-14

**Completeness:**
- ✅ Frontend Guide (100%)
- ✅ Project Vision (100%)
- ✅ Versioning Strategy (100%)
- ✅ Collaboration Guide (100%)
- ✅ PR Template (100%)

**Next Additions:**
- [ ] API Documentation (V2)
- [ ] Database Schema Docs (V2)
- [ ] Deployment Guide (V2)
- [ ] Testing Guide (V2)

---

## 🎉 Welcome to MenuCraft!

These docs are your guide to building a successful product. Read them, follow them, and improve them as we grow.

**Questions?** Open a GitHub Discussion.
**Ideas?** Add to PROJECT_VISION.md backlog.
**Ready to code?** Start with FRONTEND_GUIDE.md!

---

Happy coding! 🚀
