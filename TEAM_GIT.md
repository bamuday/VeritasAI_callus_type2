# VeritasAI — Team Git Workflow

This document defines a safe Git workflow for collaborative development.

---

# 1. Golden Rule

Do not work directly on `main` unless the team explicitly requires it.

Use feature branches.

```text
main
 │
 ├── feature/auth
 ├── feature/detector
 ├── feature/frontend
 └── fix/database
```

---

# 2. Before Starting Work

Always update your local repository:

```bash
git checkout main
git pull --rebase origin main
```

Then create a branch:

```bash
git checkout -b feature/your-feature
```

Examples:

```bash
git checkout -b feature/oauth
git checkout -b feature/analysis-dashboard
git checkout -b fix/cors
```

---

# 3. Check Repository State

Before editing:

```bash
git status
```

Also:

```bash
git branch
git log --oneline -5
```

---

# 4. Make Small Commits

Avoid:

```text
one giant commit containing everything
```

Prefer:

```text
feat: add essay analysis endpoint
feat: add sentence evidence
fix: preserve sentence whitespace
docs: update installation guide
```

---

# 5. Commit Convention

Recommended:

```text
feat:
fix:
docs:
refactor:
test:
chore:
perf:
style:
```

Examples:

```bash
git commit -m "feat: add Google OAuth"
git commit -m "fix: correct sentence span handling"
git commit -m "docs: improve installation guide"
git commit -m "test: add scoring tests"
```

---

# 6. Before Committing

Run:

```bash
git status
```

Review changes:

```bash
git diff
```

For staged changes:

```bash
git diff --cached
```

Then:

```bash
git add <specific-files>
git commit -m "type: description"
```

Avoid blindly doing:

```bash
git add .
```

when you have generated files, secrets, or unrelated modifications.

---

# 7. Never Commit Secrets

Never commit:

```text
backend/.env
frontend/.env.local
API keys
OAuth secrets
database passwords
SESSION_SECRET
private certificates
```

Check:

```bash
git status --ignored
```

---

# 8. Push Feature Branch

```bash
git push -u origin feature/your-feature
```

Then open a Pull Request.

---

# 9. Pull Request Checklist

Before opening a PR:

- [ ] Feature works locally.
- [ ] Backend tests pass.
- [ ] Frontend builds.
- [ ] No secrets are included.
- [ ] No unnecessary files are included.
- [ ] Documentation is updated.
- [ ] Database migrations are included if required.
- [ ] Commit messages are understandable.

---

# 10. Updating Your Branch

If `main` changed while you were working:

```bash
git fetch origin
git rebase origin/main
```

Resolve conflicts if necessary.

Then:

```bash
git push --force-with-lease
```

Only force-push your own feature branch.

Never casually force-push `main`.

---

# 11. If `git push` Says "Fetch First"

Example:

```text
! [rejected] main -> main (fetch first)
```

Do not immediately use:

```bash
git push --force
```

First inspect:

```bash
git fetch origin
git log --oneline --graph --decorate --all -20
```

If your branch should incorporate remote changes:

```bash
git pull --rebase origin main
```

Resolve conflicts, then:

```bash
git push origin main
```

---

# 12. If You Have Local Commits and Remote Commits

Recommended:

```bash
git fetch origin
git rebase origin/main
```

If conflicts occur:

```bash
git status
```

Edit the conflicted files.

Then:

```bash
git add <resolved-files>
git rebase --continue
```

Repeat until complete.

Then:

```bash
git push
```

---

# 13. Merge Conflicts

Conflict markers look like:

```text
<<<<<<< HEAD
your version
=======
remote version
>>>>>>> origin/main
```

Decide which code should remain.

Then remove the markers.

Run tests.

Then:

```bash
git add <file>
git rebase --continue
```

---

# 14. Emergency Abort

If a rebase is going badly:

```bash
git rebase --abort
```

This returns the branch to its pre-rebase state.

---

# 15. Useful Git Commands

Status:

```bash
git status
```

Branches:

```bash
git branch -a
```

Recent commits:

```bash
git log --oneline --decorate -10
```

Remote:

```bash
git remote -v
```

Fetch:

```bash
git fetch origin
```

Pull:

```bash
git pull --rebase origin main
```

Push:

```bash
git push
```

Show changes:

```bash
git diff
```

---

# 16. Recommended Team Structure

Example:

```text
main
 │
 ├── feature/backend-analysis
 ├── feature/auth
 ├── feature/frontend-dashboard
 ├── feature/database
 └── docs/project-documentation
```

Each developer should own a clearly defined area where possible.

---

# 17. Database Migration Rule

If your code changes the database schema:

```text
Code change
+
Alembic migration
```

Both must be committed.

Example:

```bash
git add backend/app/db/models.py
git add backend/alembic/versions/
git commit -m "feat: add analysis persistence fields"
```

---

# 18. Final Rule

Before pushing:

```text
git status
git diff
tests
frontend build
check secrets
```

Then push.

