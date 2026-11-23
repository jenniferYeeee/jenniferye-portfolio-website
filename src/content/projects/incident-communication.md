---
title: Rapid Product Alerts
summary: An in-house system for alerting Mercury customers during incidents, replacing a $600K-a-year vendor.
org: Mercury
role: Software Engineer
start: '2025-08'
end: '2025-12'
order: 3
featured: true
stack: [TypeScript, React, Node.js, PostgreSQL, Slack API]
highlights:
  - Saved $0.6M a year and removed a critical third-party dependency.
  - Cut the time to create and send an incident alert by about 80% with a guided admin workflow.
  - Enforced two-person approval, audit history, and automatic expiry for messages reaching 100,000+ organizations.
video:
  status: ready
  src: media/incident-communication/demo.mp4
  poster: media/incident-communication/poster.jpg
  preview: media/incident-communication/preview.mp4
  alt: An admin writes and schedules a customer alert banner and submits it for review, then a second admin compares the proposed changes and approves it.
diagram:
  status: pending
---

When something goes wrong at a bank, customers need to hear about it quickly and accurately. Mercury relied on a third-party tool for this; I designed and shipped its replacement end to end: backend APIs, data model, and admin UI.

The admin workflow is built for people who aren't engineers. It validates input as you go, shows a live preview of the message, targets customers from a CSV, and routes approval through Slack.

Every alert moves through an explicit state machine. Nothing reaches customers without two people approving it, every change is recorded, and alerts expire on their own so stale notices don't linger.
