# Architecture Decision Records

## [ADR-001] .core Architecture Restructuring
- **Date:** 2026-03-27
- **Status:** Accepted
- **Context:** The project had wisdom and agent personas scattered. We needed a portable and modular structure.
- **Decision:** Implement the `.core` architecture with `/agents` and `/.wisdom` (Universal vs Project-Specific).
- **Consequences:** Wisdom is now portable; agents are modular; project docs are centralized in `/docs`.
