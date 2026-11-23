---
title: Autonomous battery swap
summary: Robots that swap their own batteries, so a hospital fleet keeps running around the clock with no one plugging it in.
org: Collaborative Robotics
role: Robotics Software Engineer
start: '2026-01'
end: null
order: 0
featured: true
stack: [Java, Spring Boot, Simulation, Fleet scheduling]
highlights:
  - Removed people from the charging loop with autonomous battery swapping infrastructure.
  - Tuned fleet-wide charging and scheduling heuristics against simulation-driven policies before shipping them.
  - Kept robots available for missions around the clock instead of parking them to charge.
video:
  status: ready
  src: media/autonomous-battery-swap/demo.mp4
  poster: media/autonomous-battery-swap/poster.jpg
  alt: Proxie drives up to its battery station, swaps in a fresh battery on its own, and heads back to work.
diagram:
  status: pending
---

A robot that has to stop and charge is a robot that isn't moving supplies. In a hospital fleet, that downtime adds up, and someone usually has to notice a low battery and plug the robot in.

Proxie swaps its own battery instead. When a robot runs low, it drives to a swap station, trades its battery for a charged one, and goes straight back to work, with no person in the loop.

I built the software infrastructure behind the swaps and the scheduling that decides when each robot should swap. Those heuristics were tuned against a fleet simulation first, so the policy that shipped keeps enough robots on missions while the rest cycle through the station.
