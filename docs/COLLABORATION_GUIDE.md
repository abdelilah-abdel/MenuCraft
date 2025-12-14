# Team Collaboration Guide - MenuCraft

> **Team Workflow:** Git Flow + Code Review
> **Communication:** GitHub Issues + PRs
> **Last Updated:** 2025-12-14

---

## Table of Contents

1. [Team Roles](#team-roles)
2. [Development Workflow](#development-workflow)
3. [Code Review Process](#code-review-process)
4. [Communication Guidelines](#communication-guidelines)
5. [Onboarding New Developers](#onboarding-new-developers)
6. [Conflict Resolution](#conflict-resolution)

---

## Team Roles

### Product Lead

**Responsibilities:**
- Define product vision and roadmap
- Prioritize features in PROJECT_VISION.md
- Make final decisions on UX/design
- Coordinate releases

### Frontend Developers

**Responsibilities:**
- Build UI components following FRONTEND_GUIDE.md
- Implement features from PROJECT_VISION.md
- Write clean, maintainable code
- Review team members' PRs

### Backend Developers (V2+)

**Responsibilities:**
- Build API endpoints
- Design database schema
- Implement authentication
- Optimize performance

### Designer (Optional)

**Responsibilities:**
- Create new templates
- Design UI improvements
- Maintain design consistency
- Create marketing assets

---

## Development Workflow

### Step 1: Pick a Feature

1. Check PROJECT_VISION.md for upcoming features
2. Find an unassigned feature in GitHub Issues
3. Assign yourself to the issue
4. Update issue status to "In Progress"

```markdown
Example:
Issue #45: FEAT-001 - Add drag-and-drop section reordering
Status: In Progress
Assignee: @yourname
```

### Step 2: Create Feature Branch

```bash
# Pull latest develop
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/FEAT-001-drag-drop-reordering
```

### Step 3: Develop Feature

**Follow these guidelines:**

- ✅ Read FRONTEND_GUIDE.md for styling conventions
- ✅ Follow TypeScript best practices
- ✅ Write modular, reusable code
- ✅ Add JSDoc comments for complex functions
- ✅ Test on mobile and desktop
- ✅ Commit frequently with meaningful messages

```bash
# Make changes
git add .
git commit -m "feat(builder): add DraggableSection component (#FEAT-001)"

# Continue development
git commit -m "feat(builder): implement reorder logic (#FEAT-001)"
```

### Step 4: Push to Remote

```bash
git push origin feature/FEAT-001-drag-drop-reordering
```

### Step 5: Create Pull Request

1. Go to GitHub repository
2. Click "New Pull Request"
3. Select: `develop` ← `feature/FEAT-001-drag-drop-reordering`
4. Fill in PR template (see `.github/PULL_REQUEST_TEMPLATE.md`)
5. Add screenshots/GIFs
6. Request review from 1-2 team members

### Step 6: Address Review Feedback

- Respond to all comments
- Make requested changes
- Push updates to same branch
- Re-request review when ready

### Step 7: Merge

Once approved:
- Product Lead or Senior Dev merges to `develop`
- Delete feature branch after merge

---

## Code Review Process

### Reviewer Responsibilities

**What to Check:**

1. **Code Quality**
   - [ ] Follows FRONTEND_GUIDE.md conventions
   - [ ] Proper TypeScript types
   - [ ] No console.log or debug code
   - [ ] Functions are small and focused
   - [ ] Reusable components are extracted

2. **Functionality**
   - [ ] Feature works as described
   - [ ] No regressions (existing features still work)
   - [ ] Edge cases are handled
   - [ ] Error states are handled

3. **UI/UX**
   - [ ] Matches menu aesthetic (cream, gold, charcoal)
   - [ ] Responsive on mobile
   - [ ] Hover/focus states correct
   - [ ] Loading states implemented

4. **Performance**
   - [ ] No unnecessary re-renders
   - [ ] Images are optimized
   - [ ] No memory leaks

### Review Comments

**Use constructive language:**

```markdown
# ✅ Good
"Consider extracting this logic into a custom hook for reusability."

"Great job on the hover states! One suggestion: we could use
transition-all for smoother animations."

# ❌ Bad
"This is wrong."
"Why did you do it this way?"
```

### Approval Criteria

- **Approve:** Code is good to merge as-is
- **Request Changes:** Issues must be fixed before merge
- **Comment:** Questions or suggestions, but not blocking

---

## Communication Guidelines

### GitHub Issues

**Create an issue for:**
- New feature requests
- Bug reports
- Questions/discussions
- Documentation improvements

**Issue Template:**

```markdown
**Feature ID:** FEAT-XXX (if applicable)
**Type:** Feature / Bug / Question
**Priority:** High / Medium / Low

## Description
Clear description of feature or bug

## Expected Behavior
What should happen

## Current Behavior
What actually happens (for bugs)

## Screenshots
Include if relevant

## Additional Context
Any other information
```

### Pull Requests

**Use PR template** (see `.github/PULL_REQUEST_TEMPLATE.md`)

**PR Size Guidelines:**
- **Small:** <200 lines - Review in 1 day
- **Medium:** 200-500 lines - Review in 2 days
- **Large:** 500+ lines - Consider splitting

### Daily Standup (If Team > 3)

**Format:**
- What I completed yesterday
- What I'm working on today
- Any blockers

**Keep it brief:** 2-3 minutes per person

---

## Onboarding New Developers

### Day 1: Setup

**Checklist:**

- [ ] Clone repository
- [ ] Install dependencies (`npm install`)
- [ ] Run dev server (`npm run dev`)
- [ ] Read README.md
- [ ] Read FRONTEND_GUIDE.md
- [ ] Read PROJECT_VISION.md
- [ ] Read VERSIONING_STRATEGY.md

### Day 2-3: Explore Codebase

**Tasks:**

- [ ] Browse existing components
- [ ] Understand component structure
- [ ] Review design system (colors, typography)
- [ ] Try creating a test menu
- [ ] Ask questions in team chat

### Week 1: First Contribution

**Starter Tasks:**

- Fix a simple bug (good first issue)
- Improve documentation
- Add a small UI enhancement
- Write tests

**Goal:** Get comfortable with workflow before tackling features

---

## Conflict Resolution

### Merge Conflicts

```bash
# Pull latest develop
git checkout develop
git pull origin develop

# Merge develop into your feature branch
git checkout feature/FEAT-XXX-your-feature
git merge develop

# Resolve conflicts in editor
# Look for <<<<<<< and >>>>>>>

# After resolving
git add .
git commit -m "merge: resolve conflicts with develop"
git push origin feature/FEAT-XXX-your-feature
```

### Design Disagreements

**Process:**
1. Discuss in PR comments
2. Provide reasoning + screenshots
3. If no consensus, Product Lead decides
4. Document decision for future reference

### Code Style Disputes

**Solution:** Follow FRONTEND_GUIDE.md
- If not covered, team votes
- Update guide with decision

---

## Best Practices for Collaboration

### 1. Communicate Early and Often

```markdown
# ✅ Good
"Starting work on FEAT-001. Planning to use @dnd-kit/core.
Any objections or suggestions?"

# ❌ Bad
*Works in silence for a week, submits 2000-line PR*
```

### 2. Keep PRs Small

- One feature per PR
- Easier to review
- Faster to merge
- Less merge conflicts

### 3. Write Tests (V2+)

```tsx
// Add tests for new features
describe('DraggableSection', () => {
  it('reorders sections on drag', () => {
    // Test logic
  });
});
```

### 4. Document Decisions

**Use GitHub Discussions or Wiki:**
- Why we chose library X over Y
- Architectural decisions
- API design choices

### 5. Respect Review Time

- Don't expect instant reviews
- Reviewers have their own work
- Follow up politely after 2 days
- Mark as urgent only if truly urgent

---

## Tools & Resources

### Required Tools

- **Git:** Version control
- **Node.js 20+:** Runtime
- **VS Code:** Recommended editor
- **GitHub:** Code hosting

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### Helpful Commands

```bash
# Check for TypeScript errors
npm run type-check

# Format code
npm run format

# Run linter
npm run lint

# Build for production
npm run build
```

---

## Weekly Cadence

### Monday
- Review PROJECT_VISION.md for week's priorities
- Assign features from backlog
- Create GitHub issues for new tasks

### Wednesday
- Mid-week sync (optional)
- Review PR queue
- Unblock team members

### Friday
- Merge approved PRs to develop
- Update CHANGELOG.md
- Plan next week's work

---

## Remote Team Tips

### Asynchronous Communication

**Use GitHub for:**
- Feature discussions (Issues)
- Code feedback (PR comments)
- Design decisions (Discussions)

**Avoid:** Real-time chat for important decisions (gets lost)

### Time Zones

**Be respectful:**
- Don't expect instant responses
- Mark timezone in communication
- Schedule meetings considerately

### Documentation First

**Write things down:**
- Decisions in GitHub
- Designs in Figma + link in PR
- Complex features explained in docs

---

## Conflict of Interest

### Feature Prioritization Disputes

**Resolution:**
1. Product Lead makes final call
2. Based on PROJECT_VISION.md roadmap
3. Consider: User impact, effort, dependencies

### Technical Approach Disagreements

**Resolution:**
1. Senior Dev makes technical decisions
2. Prototype both approaches if unclear
3. Choose based on: Performance, maintainability, simplicity

---

## Recognition & Growth

### Contribution Tracking

**Track contributions:**
- PRs merged
- Issues closed
- Code reviews completed
- Documentation written

### Learning Opportunities

**Encourage growth:**
- Pair programming sessions
- Knowledge sharing (tech talks)
- Rotate feature leads
- Cross-functional work

---

## Emergency Procedures

### Production Down

**Process:**
1. Create hotfix branch from `main`
2. Fix issue immediately
3. Deploy hotfix
4. Merge to develop
5. Post-mortem: Document what happened

### Security Vulnerability

**Process:**
1. Do NOT discuss publicly
2. Notify team via secure channel
3. Create private security advisory
4. Patch immediately
5. Deploy as hotfix

---

## Checklist: Before Starting Work

- [ ] Pulled latest `develop` branch
- [ ] Read related docs (FRONTEND_GUIDE, PROJECT_VISION)
- [ ] Checked for existing similar features
- [ ] Created GitHub issue (if none exists)
- [ ] Assigned issue to yourself
- [ ] Created feature branch with correct naming
- [ ] Understand acceptance criteria

---

## Checklist: Before Submitting PR

- [ ] Code follows FRONTEND_GUIDE.md
- [ ] TypeScript has no errors
- [ ] Build succeeds (`npm run build`)
- [ ] Tested on desktop and mobile
- [ ] Added screenshots to PR
- [ ] Updated CHANGELOG.md (if applicable)
- [ ] Filled in PR template completely
- [ ] Requested 1-2 reviewers

---

## Questions?

**Need Help?**
- Check documentation first
- Ask in GitHub Discussions
- Tag team members in issues
- Schedule 1-on-1 if needed

**Found a Gap in Docs?**
- Create PR to update docs
- Help future team members

---

**Last Updated:** 2025-12-14
**Maintained By:** Development Team
