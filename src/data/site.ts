export const site = {
  name: 'Jennifer Ye',
  title: 'Jennifer Ye — Robotics software engineer',
  description:
    'Robotics software engineer building systems that put robots to work in hospitals and operating rooms.',
  email: 'jenye0313@gmail.com',
  links: {
    github: 'https://github.com/jenniferYeeee',
    linkedin: 'https://www.linkedin.com/in/jennifer-ye-0313',
  },
} as const;

/**
 * Home hero. `lines` are typed one at a time on wider screens and shown as
 * static paragraphs on phones. `particles` is the sentence scattered behind
 * them, laid out in reading order.
 */
export const hero = {
  lines: [
    "Hey! You've found Jen :)",
    'A robotics software engineer in SF.',
    'Building autonomous mobile robots at Collaborative Robotics.',
    'Before that: AR for surgical robots, and fintech at Mercury.',
  ],
  particles:
    "Hey! You've found Jen, a robotics software engineer in SF, building autonomous mobile robots at Collaborative Robotics. Before that: surgical robots and fintech.",
} as const;

export interface Role {
  company: string;
  title: string;
  start: string;
  end: string | null;
  note: string;
}

/** Most recent first. Enforced by a unit test. */
export const experience: Role[] = [
  {
    company: 'Collaborative Robotics',
    title: 'Robotics Software Engineer',
    start: '2026-01',
    end: null,
    note: 'Fleet dispatch, autonomous battery swapping, and robot control of hospital doors.',
  },
  {
    company: 'Mercury',
    title: 'Software Engineer',
    start: '2025-08',
    end: '2025-12',
    note: 'Built the in-house incident communication system for 100,000+ client organizations.',
  },
  {
    company: 'ARCADE Lab, Johns Hopkins',
    title: 'Researcher',
    start: '2024-08',
    end: '2025-08',
    note: 'Real-time AR guidance for aligning surgical robots, on HoloLens 2.',
  },
  {
    company: 'NASA, DAVINCI mission',
    title: 'Test Engineering Intern',
    start: '2023-12',
    end: '2024-05',
    note: 'Qualified an oxygen sensor for Venus surface conditions: 800°F and 90 bar.',
  },
];

export const education = {
  school: 'Johns Hopkins University',
  degree: 'B.S./M.S. Computer Science, double major in Molecular and Cellular Biology',
  start: '2020-09',
  end: '2025-06',
};

export const skills: { group: string; items: string[] }[] = [
  { group: 'Languages', items: ['Java', 'Python', 'C++', 'C', 'Rust', 'TypeScript', 'Haskell'] },
  {
    group: 'Systems',
    items: ['ROS 2', 'Spring Boot', 'REST APIs', 'PostgreSQL', 'CI/CD', 'Infrastructure as code'],
  },
  {
    group: 'Perception & XR',
    items: ['OpenCV', 'PyTorch', 'TensorFlow', 'Unity', 'HoloLens 2', 'MRTK'],
  },
];
