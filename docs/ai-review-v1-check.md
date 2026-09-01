# AI review — floating @v1 verification

This file exists to give the AI reviewer a real added line to anchor an inline comment to.

The caller pins `@v1` (floating major tag). The reusable workflow checks its own scripts
out at `${{ job.workflow_sha }}`, so there is exactly one version pin and it is derived
from the commit already running — it cannot drift.

Release flow: `git tag vX.Y.Z && git tag -f v1 && git push -f origin v1`.
Rollback: `git tag -f v1 <last-good-sha> && git push -f origin v1`.
