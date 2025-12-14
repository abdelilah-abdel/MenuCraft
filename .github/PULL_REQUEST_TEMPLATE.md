# Pull Request

## Feature ID

<!--
Example: FEAT-001-DND
Or: BUG-003, TASK-002, etc.
Leave blank for minor changes (typo fixes, etc.)
-->

**Feature/Bug ID:**

---

## Type of Change

<!-- Mark with [x] -->

- [ ] 🎨 New Feature (FEAT)
- [ ] 🐛 Bug Fix (BUG)
- [ ] ♻️ Refactor (TASK)
- [ ] 📝 Documentation
- [ ] 🎨 UI/Styling
- [ ] ⚡ Performance
- [ ] 🔧 Chore (deps, config)

---

## Description

<!--
Provide a clear description of what this PR does.
Why is this change needed? What problem does it solve?
-->



---

## Changes Made

<!--
List the main changes in bullet points
-->

-
-
-

---

## Screenshots / GIFs

<!--
For UI changes, include before/after screenshots or GIFs
Drag and drop images here or use:
![Description](URL)
-->

**Before:**


**After:**


---

## Testing Checklist

<!-- Mark completed items with [x] -->

### Functional Testing

- [ ] Feature works as intended
- [ ] No regressions (existing features still work)
- [ ] Edge cases are handled
- [ ] Error states work correctly

### UI/UX Testing

- [ ] Matches menu aesthetic (cream, gold, charcoal colors)
- [ ] Responsive on mobile (tested at 375px, 768px, 1024px)
- [ ] Hover states work correctly (gold highlights)
- [ ] Focus states work correctly (gold glow)
- [ ] Loading states implemented (if applicable)
- [ ] Empty states designed (if applicable)

### Code Quality

- [ ] Follows FRONTEND_GUIDE.md conventions
- [ ] Proper TypeScript types (no `any`)
- [ ] JSDoc comments for complex functions
- [ ] No console.log or debug code
- [ ] No linter errors
- [ ] Build succeeds (`npm run build`)

### Accessibility

- [ ] Semantic HTML elements used
- [ ] Labels for form inputs
- [ ] Keyboard navigation works
- [ ] ARIA attributes (if needed)

---

## Performance Impact

<!--
Does this PR affect performance?
- Bundle size increase/decrease
- Rendering performance
- Memory usage
-->



---

## Database Impact (V2+)

<!--
For V2+ features with database:
- Schema changes?
- Migration needed?
- Data migration plan?
-->

- [ ] No database changes
- [ ] Database schema changes (describe below)
- [ ] Migration script included

**Migration details:**


---

## Breaking Changes

<!--
Does this PR introduce breaking changes?
If yes, describe what breaks and migration path for users.
-->

- [ ] No breaking changes
- [ ] Breaking changes (describe below)

**Breaking change details:**


---

## Related Issues

<!--
Link to related GitHub issues
-->

Closes #
Related to #

---

## Documentation

<!--
Have you updated relevant documentation?
-->

- [ ] Updated FRONTEND_GUIDE.md (if UI patterns added)
- [ ] Updated PROJECT_VISION.md (if feature listed there)
- [ ] Updated README.md (if setup changed)
- [ ] Added JSDoc comments to new functions
- [ ] Updated CHANGELOG.md

---

## Deployment Notes

<!--
Any special deployment considerations?
- Environment variables needed
- External services to configure
- Manual steps after deployment
-->



---

## Reviewer Checklist

<!-- For reviewers - do not edit -->

### Code Review

- [ ] Code follows project conventions
- [ ] TypeScript types are correct
- [ ] No security vulnerabilities
- [ ] Error handling is adequate
- [ ] Performance is acceptable

### Testing Review

- [ ] Tested locally and works
- [ ] Responsive design verified
- [ ] UI matches design system

### Final Approval

- [ ] **Approve** - Ready to merge
- [ ] **Request Changes** - Issues must be fixed
- [ ] **Comment** - Suggestions, not blocking

---

## Additional Notes

<!--
Any other information for reviewers?
- Known limitations
- Future improvements planned
- Questions for team
-->



---

**Submitter Checklist Before Requesting Review:**

- [ ] I have read FRONTEND_GUIDE.md and followed conventions
- [ ] I have tested this on desktop and mobile
- [ ] I have added screenshots for UI changes
- [ ] I have requested review from 1-2 team members
- [ ] I have self-reviewed my code
- [ ] Build succeeds without errors

---

<!--
Thank you for contributing to MenuCraft! 🎉
Your work helps restaurants create beautiful digital menus.
-->
