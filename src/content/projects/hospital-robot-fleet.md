---
title: Hospital robot fleet
summary: Dispatch, charging, and door control for a fleet of collaborative robots working in hospital hallways.
org: Collaborative Robotics
role: Robotics Software Engineer
start: '2026-01'
end: null
order: 2
featured: true
stack: [Java, Spring Boot, OAuth, mTLS, Infrastructure as code, Simulation]
highlights:
  - Cut average mission time by 5 minutes by replacing random robot assignment with proximity-based dispatch.
  - Removed people from the charging loop with autonomous battery swapping and simulation-tuned fleet scheduling.
  - Let robots open hospital doors on their own through an event-driven service with vendor-agnostic adapters.
video:
  status: pending
diagram:
  status: pending
---

Robots moving supplies through a hospital spend much of their day waiting: for an assignment, for a charge, for someone to open a door. This work removes those waits.

Dispatch now assigns each mission to the nearest robot that can take it, subject to constraints like battery and payload, instead of picking one at random. Charging is handled by autonomous battery swaps, with scheduling heuristics tuned against a fleet simulation before they ship.

For doors, an event-driven Spring Boot service talks to each hospital's door system through a vendor-agnostic adapter layer, with OAuth and mTLS on every call and retries that tolerate flaky building networks.
