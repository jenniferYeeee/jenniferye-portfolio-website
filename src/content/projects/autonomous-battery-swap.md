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
  preview: media/autonomous-battery-swap/preview.mp4
  alt: Proxie drives up to its battery station, swaps in a fresh battery on its own, and heads back to work.
diagram:
  status: none
---

A robot that has to stop and charge is a robot that isn't moving supplies. Proxie avoids that by docking with an automated swap station and changing its own battery pack, then going straight back to work. Collaborative Robotics owns the scheduling heuristic that decides when each robot swaps, and that's the part I work on.

### Why scheduling matters

With four Proxies on the simplest possible policy, swap only once a battery is depleted, the fleet used energy faster than a single station could recharge packs from the wall. So the quality of the scheduling heuristic directly sets how many robots one swap station can support at a customer site. That's the product's unit economics.

### The goal

Maximize total productive robot-hours across the site, with zero strandings (a robot running out of charge before it reaches the station). Every heuristic is validated in a simulator first, with each parameter tunable.

### What the heuristic weighs

| Factor                                         | Stage           | Why it matters                                           |
| ---------------------------------------------- | --------------- | -------------------------------------------------------- |
| Charged battery available at the station       | MVP             | Hard requirement                                         |
| State-of-charge threshold                      | MVP             | Around 15%, set per site                                 |
| Staggering swaps                               | Stage 1         | So robots don't wait idle in line                        |
| Distance to the station                        | Stage 2         | Cheaper swaps when the station is close                  |
| Detour from the current route                  | Later           | Swap when the station is on the way                      |
| Station utilization                            | Metric from MVP | The station should always be drawing power from the wall |
| Robot utilization: 1 − swap time ÷ active time | Metric from MVP | Catches over-swapping                                    |

### Rolling it out in stages

1. **MVP, threshold based.** One station. A robot swaps when its charge drops below a per-site threshold, and operators can also send a robot to swap manually.
2. **Stage 1, priority queue.** The threshold gates entry into a min-heap keyed on charge, so the lowest battery swaps first. The station's occupancy is tracked, so a second robot waits instead of colliding.
3. **Stage 2, scored decisions.** The heap key becomes a score that also weighs distance and detour cost, with more than one station in scope. Its weights are tuned in the simulator on logs from the MVP and Stage 1, with the threshold policy as the baseline to beat.

### Tuning the score in simulation

For each robot `r` and station `s`:

```
score(r, s) = w_risk   · StrandRisk(r)
            − w_travel · DetourCost(r, s)
            − w_opp    · OpportunityCost(r)
            − w_wait   · ExpectedWait(s, ETA(r, s))
            + w_fill   · FillDeficit(s, ETA(r, s))
```

- **StrandRisk:** pressure that rises as the robot nears the end of its range.
- **DetourCost:** `path(r → s → next task) − path(r → next task)`. It's near zero when the station is on the way, which is the whole idea of a convenient swap.
- **OpportunityCost:** what the robot's time is worth right now, close to zero when idle and high mid-delivery at peak hours.
- **ExpectedWait:** the queue delay the robot should expect when it arrives at the station.
- **FillDeficit:** how far the station is below its target number of charged packs.
