---
title: Door API integration in Mayo Clinic
summary: Letting hospital robots open Mayo Clinic's doors on their own, through the building's door API.
org: Collaborative Robotics
role: Robotics Software Engineer
start: '2026-01'
end: null
order: 2
featured: true
stack: [Java, Spring Boot, OAuth, mTLS, Infrastructure as code]
highlights:
  - Let robots open hospital doors on their own through an event-driven service with vendor-agnostic adapters.
  - Secured every door call with OAuth and mTLS, with infrastructure defined as code.
  - Made door requests fault-tolerant, with retries that survive flaky building networks.
video:
  status: ready
  src: media/hospital-robot-fleet/demo.mp4
  poster: media/hospital-robot-fleet/poster.jpg
  alt: A Proxie robot pulling a supply cart down a Mayo Clinic hallway as the doors ahead open for it.
diagram:
  status: pending
---

Robots moving supplies through a hospital spend a lot of time waiting for someone to open a door. At Mayo Clinic, many of those doors can be controlled through the building's door API, so the robot can open them itself.

I built the event-driven Spring Boot service that connects the robots to the hospital's door system. When a robot's route reaches a door, the service asks the door to open and confirms it has before the robot drives through.

Each door vendor sits behind its own adapter, so supporting a new building means writing an adapter, not changing the service. Every call uses OAuth and mTLS, the infrastructure is defined as code, and retries are built to tolerate unreliable building networks.
