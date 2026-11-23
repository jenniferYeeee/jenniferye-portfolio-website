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
  preview: media/hospital-robot-fleet/preview.mp4
  alt: A Proxie robot pulling a supply cart down a Mayo Clinic hallway as the doors ahead open for it.
diagram:
  status: ready
  src: media/hospital-robot-fleet/diagram.svg
  alt: "System diagram. Proxie reports its position to the location reporting service in the Collaborative Robotics cloud, which sends an address update into a door zone such as floor/1/door_23. When a device is inside the zone, the event-driven Door API service (Java, Spring Boot, infrastructure as code) orchestrates the request with retries and timeouts and calls the hospital's door system through a vendor adapter over OAuth and mTLS, and the door unlocks for the robot."
---

Robots moving supplies through a hospital spend a lot of time waiting for someone to open a door. At Mayo Clinic, many of those doors can be controlled through the building's door API, so the robot can open them itself.

I built the event-driven Spring Boot service that connects the robots to the hospital's door system. The robot never asks for a door itself. It only reports where it is: when it enters a door's zone on the map, the location reporting service sends an address update into that zone, such as `floor/1/door_23`. A device showing up inside a door zone triggers the door API service, which calls the hospital's system to open that door.

Each door vendor sits behind its own adapter, so supporting a new building means writing an adapter, not changing the service. Every call uses OAuth and mTLS, the infrastructure is defined as code, and retries are built to tolerate unreliable building networks.
