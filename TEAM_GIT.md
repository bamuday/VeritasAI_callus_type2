# Team Git workflow

The repository should use `main` as the protected integration branch. Each team member should work in a focused feature branch and open a pull request before merging.

Suggested branches:

```text
main
├── database-schema
├── auth-google-github
├── essay-history
├── detector-evaluation
└── dataset-pipeline
```

## First baseline commit

After verifying the original project and this integrated build locally:

```bash
git status
git add .
git commit -m "baseline: VeritasAI with persistence foundation"
```

Before starting a feature:

```bash
git switch main
git pull
git switch -c feature-name
```

Commit small, understandable changes. Never commit `.env`, OAuth secrets, database passwords, `node_modules`, or Python virtual environments.
