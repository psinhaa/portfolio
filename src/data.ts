export type Project = {
  name: string
  emoji: string
  tagline: string
  description: string
  tech: string[]
  color: string
  link: string
  badge?: string
}

export type Company = {
  id: string
  name: string
  role: string
  period: string
  location: string
  color: string
  accent: string
  logo: string
  overview: string
  responsibilities: string[]
  projects: Project[]
}

export const COMPANIES: Company[] = [
  {
    id: 'squint-metrics',
    name: 'Squint Metrics',
    role: 'Software Engineer',
    period: 'Mar 2023 – Present',
    location: 'Gurugram / Remote',
    color: '#e91e8c',
    accent: '#a855f7',
    logo: '🚀',
    overview:
      'Squint Metrics is a product & services company focused on healthcare and sports-tech verticals. Working here I build pixel-perfect, performant web apps using Angular, React, Ionic, and Node.js — collaborating closely with design and product teams to ship features used by real customers every sprint.',
    responsibilities: [
      'Developing and maintaining Angular + Ionic mobile-first applications',
      'Building React & TypeScript front-ends with component libraries',
      'Integrating REST APIs and third-party SDKs into production apps',
      'Collaborating with UX/UI designers to implement pixel-perfect interfaces',
      'Code reviews, mentoring juniors, and maintaining CI/CD pipelines',
      'Performance optimisation and accessibility improvements',
    ],
    projects: [
      {
        name: 'Venue Advantage',
        emoji: '🏟️',
        tagline: 'Sports sponsorship & advertising platform',
        description:
          'First-of-its-kind cloud-based platform that streamlines the organisation and sales of live entertainment advertising and sponsorship opportunities — starting with college sports venues. Features 3D venue visualisation, sponsorship asset marketplace, and real-time pricing optimisation.',
        tech: ['React', 'TypeScript', 'Node.js', 'Cloud', 'REST API'],
        color: '#ff9800',
        link: 'https://www.venue-advantage.com/',
        badge: '🟢 Active',
      },
      {
        name: 'NeuroSum',
        emoji: '🧠',
        tagline: 'Healthcare companion & symptom tracker',
        description:
          'Integrates essential features to track health metrics, monitor performance, record symptoms and document attacks — providing invaluable insights for healthcare providers. Built with Angular and RxJS for real-time data flow.',
        tech: ['Angular', 'TypeScript', 'Ionic', 'RxJS', 'REST API'],
        color: '#00bcd4',
        link: 'https://github.com/psinhaa',
      },
    ],
  },
  {
    id: 'in-time-tec',
    name: 'In Time Tec',
    role: 'Software Engineer',
    period: 'Mar 2021 – Mar 2023',
    location: 'Remote',
    color: '#6c63ff',
    accent: '#00bcd4',
    logo: '💻',
    overview:
      'In Time Tec is a software consultancy delivering custom solutions across healthcare, non-profit, and manufacturing sectors. In two years here I grew from junior to mid-level engineer, working across the full stack and taking on client-facing projects independently.',
    responsibilities: [
      'Developing user interfaces with front-end technologies (HTML, CSS, JavaScript, Angular)',
      'Writing and maintaining Python scripts for back-end automation',
      'Coding enhancements and fixes for subsystems of end-user applications',
      'Maintaining live applications without disrupting active users',
      'Working with cross-functional teams to deliver cost-effective, high-quality solutions',
      'Assisting in debugging, documentation, and performance monitoring',
    ],
    projects: [
      {
        name: 'AEYC-IDAHO',
        emoji: '🌱',
        tagline: 'Non-profit membership & event platform',
        description:
          'Developed new features and integrated APIs using Angular and JavaScript for a non-profit serving early childhood educators across Idaho. Designed and built multiple UI pages from Figma mockups, maintained the app during live-user hours without touching legacy flows.',
        tech: ['Angular', 'JavaScript', 'HTML5', 'CSS3', 'REST API'],
        color: '#4caf50',
        link: 'https://github.com/psinhaa',
      },
      {
        name: 'AHA 3D Printer',
        emoji: '🖨️',
        tagline: 'Back-end control system for 3D printing',
        description:
          'Developed the Python back-end that receives and processes callback commands from the printer hardware, then sends results back for printing. Also contributed to designing the full Debian package to make deployment user-friendly.',
        tech: ['Python', 'Debian', 'Hardware I/O', 'CLI'],
        color: '#ff9800',
        link: 'https://github.com/psinhaa',
      },
    ],
  },
]

export const COLLEGE_PROJECTS: Project[] = [
  {
    name: 'Kart',
    emoji: '🛒',
    tagline: 'Full-stack e-commerce platform',
    description:
      'Complete REST API suite — authentication, shopping cart, checkout flow, and a responsive UI built on MongoDB for scalable data storage. Built as a minor project during B.Tech.',
    tech: ['Node.js', 'Express.js', 'MongoDB', 'REST API', 'JavaScript'],
    color: '#e91e8c',
    link: 'https://github.com/psinhaa',
  },
  {
    name: 'Board',
    emoji: '📰',
    tagline: 'Curated news feed from Flipboard',
    description:
      'A news aggregation website featuring the latest articles on selected topics. Interactive accordions, image carousels and Flipboard RSS API integration.',
    tech: ['HTML5', 'CSS3', 'Bootstrap', 'JavaScript', 'REST API'],
    color: '#6c63ff',
    link: 'https://github.com/psinhaa',
  },
]
