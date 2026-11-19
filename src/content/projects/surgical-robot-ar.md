---
title: AR guidance for surgical robots
summary: A HoloLens 2 app that shows surgical staff exactly where to move a robot, cutting alignment setup time by 75%.
org: ARCADE Lab, Johns Hopkins
role: Researcher
start: '2024-08'
end: '2025-08'
order: 1
featured: true
stack: [Unity, 'C#', HoloLens 2, MRTK, FoundationPose, RGB-D vision]
highlights:
  - Cut robot alignment setup time by 75% and avoided about $15K of tracking hardware per robot.
  - Held alignment accuracy in noisy operating-room conditions using FoundationPose for object localization.
  - Built a model-based tracking pipeline from CAD inputs with automatic mask generation, tunable between accuracy and latency.
video:
  status: pending
diagram:
  status: pending
---

Before a procedure, a surgical robot has to be placed precisely relative to the patient and the table. That alignment is usually done by eye or with dedicated optical trackers that cost thousands per robot.

This system runs on a HoloLens 2. It estimates the robot's 6-DoF pose from the headset's RGB-D camera, transforms it into the operating-room frame, and draws the target position as a live overlay so the person moving the robot can see where it needs to go.

The tracking pipeline is model-based: it takes the robot's CAD model, generates segmentation masks automatically, and exposes the parameters that trade pose accuracy against frame rate.
