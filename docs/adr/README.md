# Architecture Decision Records

This directory holds the architectural decisions for the Faster Fixes repo. Each ADR captures **one decision**, the alternatives that were considered, and the reasoning behind the choice — so a developer six months later can understand *why* the codebase looks the way it does.

## Conventions

- One file per decision: `NNNN-short-kebab-title.md` (e.g. `0001-event-sourced-orders.md`).
- Numbering is monotonic and never reused, even if a decision is later superseded.
- ADRs are produced lazily by `/grill-with-docs` when an architectural decision actually needs to be pinned down. Don't create speculative ADRs upfront.

## Suggested template

```markdown
# ADR-NNNN: <decision>

- **Status**: Proposed | Accepted | Superseded by ADR-XXXX
- **Date**: YYYY-MM-DD

## Context

What's the situation? What forces are at play?

## Decision

What did we decide?

## Alternatives considered

Other options and why they were rejected.

## Consequences

What changes because of this? What new constraints does it create?
```

## Status

- [ADR-0001](./0001-marketing-demo-uses-internal-widget-core.md) — Marketing demo uses an internal widget Core, not new widget props.
- [ADR-0002](./0002-linear-oauth-uses-actor-app.md) — Linear OAuth uses `actor=app` for stable, app-scoped attribution.
- [ADR-0003](./0003-encrypt-tracker-tokens-at-rest.md) — Encrypt Tracker tokens at rest despite Better Auth's plaintext precedent.
- [ADR-0004](./0004-programmatic-blog-images.md) — Programmatic blog images.
- [ADR-0005](./0005-widget-identity-public-id-origin-auth.md) — Widget identifies its Project by a public ID, secured by allowed origins + reviewer token, not a secret API key.
- [ADR-0006](./0006-slack-uses-custom-bot-install-oauth.md) — Slack integration uses a custom bot-install OAuth route, not Better Auth social login.
