---
title: Augmented Reality guidance for surgical robot
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
  status: ready
  src: media/surgical-robot-ar/demo.mp4
  poster: media/surgical-robot-ar/poster.jpg
  preview: media/surgical-robot-ar/preview.mp4
  alt: The HoloLens 2 view while aligning the robot arm, with a virtual tracker, a target sphere and an arrow guiding the arm into place.
extras:
  - title: Tracking the arm with FoundationPose
    src: media/surgical-robot-ar/pose-tracking.mp4
    poster: media/surgical-robot-ar/pose-tracking-poster.jpg
    caption: FoundationPose tracking the pose of the Micromate arm tip in real time. The green box is the estimated 6-DoF pose, and it adjusts as the arm moves.
    alt: A green 3D bounding box and axes follow the Micromate robot arm tip on a desk as it is moved around.
report:
  src: media/surgical-robot-ar/final-report.pdf
  title: 'Final report: Augmented Reality-Assisted Robotic Arm Alignment for Precision Surgical Procedures'
diagram:
  status: ready
  src: media/surgical-robot-ar/diagram.svg
  alt: "System diagram. The HoloLens 2 streams RGB and depth frames over Wi-Fi to a Windows GPU host using hl2ss. On the first frame, YOLOv8 finds the Micromate and SAM cuts a precise mask. FoundationPose, given the arm's CAD mesh from an iPhone scan and the camera intrinsics, registers the first-frame pose and then tracks every following frame. The resulting 6-DoF pose goes back to the headset, where a Unity MRTK app draws a phantom arm and an arrow to the target position, turning green within 5 cm."
---

Before a procedure, a surgical robot has to be placed precisely relative to the patient and the table. That alignment is usually done by eye or with dedicated optical trackers that cost thousands per robot.

This system runs on a HoloLens 2. It estimates the robot's 6-DoF pose from the headset's RGB-D camera, transforms it into the operating-room frame, and draws the target position as a live overlay so the person moving the robot can see where it needs to go.

The tracking pipeline is model-based: it takes the robot's CAD model, generates segmentation masks automatically, and exposes the parameters that trade pose accuracy against frame rate.
