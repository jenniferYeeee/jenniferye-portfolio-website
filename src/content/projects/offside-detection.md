---
title: Soccer offside detection
summary: Automatic offside calls from broadcast footage, with 90.6% player and ball localization at 25 frames per second.
org: Course project, Johns Hopkins
role: Computer vision
start: '2024-01'
end: '2024-05'
order: 5
featured: false
stack: [Python, PyTorch, YOLOv8, OpenCV]
highlights:
  - Reached 90.6% player and ball localization accuracy at 0.04 seconds per frame with a custom YOLOv8 model.
  - Inferred offside positions with vanishing-point geometry and jersey-color clustering to find the last defender.
video:
  status: pending
diagram:
  status: pending
---

Broadcast cameras rarely look straight down the offside line. This project detects players and the ball, estimates the field's vanishing point to recover the line's true angle, and groups players into teams by jersey color to decide who is beyond the last defender.
