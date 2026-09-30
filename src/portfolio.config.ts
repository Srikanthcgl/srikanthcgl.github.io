import type { PortfolioConfig } from "./config/types";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  THE ONLY FILE YOU NEED TO EDIT.  Every word, link and setting comes from here.
 *
 *  QUICK CHEAT SHEET
 *  • Add an Android app ...... copy one block inside `apps.items`, change its text.
 *  • Add a project ........... copy one block inside `projects.items`.
 *  • Add a skill / tag ....... add a string to an `items: [...]` list.
 *  • Explain a jargon term ... add "Term": "plain meaning" to `glossary`.
 *  • Remove anything ......... delete its block, or delete a section id from `sections`.
 *  • Reorder sections ........ reorder the ids in `sections`.
 *  • Images / résumé ......... put files in the /public folder, refer to them as "/me.jpg".
 *
 *  PLACEHOLDERS: anything containing "TODO" is shown while you run `npm run dev`
 *  (so you can find it) and is hidden automatically in the production build.
 *
 *  SAFETY NET: if you make a mistake (duplicate id, missing field, unknown
 *  section…), the browser console warns you in development and `npm test` fails.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const config: PortfolioConfig = {
  meta: {
    title: "Srikanth Chinthaginjala — Full-Stack, Android & Cloud Solution Architect",
    description:
      "Srikanth Chinthaginjala is a full-stack, Android and cloud solution architect — designing systems, web dashboards and apps on AWS, with CI/CD, Terraform and MQTT, from warehouse robots to everyday software.",
    url: "", // TODO: e.g. "https://srikanth.dev"
    ogImage: "", // TODO: e.g. "/og.png"
    language: "en",
  },

  person: {
    name: "Srikanth Chinthaginjala",
    firstName: "Srikanth",
    role: "Full-Stack · Android · Cloud Solution Architect",
    location: "Bengaluru, India", // TODO: confirm
    email: "TODO@example.com", // TODO
    phone: "",
    photo: "", // TODO: e.g. "/me.jpg"
    initials: "SC",
    resume: "", // TODO: e.g. "/srikanth-resume.pdf"
    availability: { status: "open", text: "Open to interesting projects and conversations" },
  },

  social: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/TODO", icon: "linkedin" }, // TODO
    { label: "GitHub", url: "https://github.com/TODO", icon: "github" }, // TODO
  ],

  sections: ["about", "apps", "projects", "skills", "experience", "contact"],

  navLabels: { about: "About", apps: "Apps", projects: "Work", skills: "Skills", experience: "Journey", contact: "Contact" },

  hero: {
    greeting: "Hi, I'm",
    headline: "I design and build systems that scale — from first sketch to production.",
    rotatingLead: "I build",
    rotatingWords: ["Android apps", "web dashboards", "cloud platforms on AWS", "CI/CD pipelines", "IoT systems with MQTT"],
    intro:
      "I'm a full-stack developer, Android app developer and solution architect. I design the whole system — apps, dashboards, cloud, pipelines and devices — and make sure it runs reliably.",
    primaryButton: { label: "See my apps", target: "apps" },
    secondaryButton: { label: "See my work", target: "projects" },
    highlights: [
      // TODO: replace with numbers you can stand behind, or delete this list.
      { value: "TODO", label: "years building systems" },
      { value: "TODO", label: "projects delivered" },
    ],
  },

  about: {
    kicker: "About me",
    title: "Nice to meet you.",
    paragraphs: [
      "I'm a solution architect and full-stack developer. I look at the whole picture — the apps, the dashboards, the cloud, the devices and the people using them — and make sure every piece works well together.",
      "Much of my work is around warehouse and factory automation: getting fleets of autonomous robots to cooperate, connecting them to a company's other software, and turning what they do into information people can use.",
      "On the side — and increasingly as a focus — I design and build Android apps: from the first sketch to the Play Store.",
      "I like problems where the real world pushes back — messy requirements, unreliable networks, tight deadlines — because that's where good design matters most.",
    ],
    facts: [
      { label: "Based in", value: "Bengaluru, India" }, // TODO: confirm
      { label: "Focus", value: "Architecture, full-stack, Android & cloud" },
      { label: "Works with", value: "Product, operations & engineering teams" },
    ],
    values: [
      { emoji: "🧭", title: "Start with the real problem", text: "I ask what people are actually trying to get done before choosing any technology." },
      { emoji: "🧩", title: "Make the pieces fit", text: "Great parts aren't enough. I design how software, hardware and people connect." },
      { emoji: "🛠️", title: "Ship, then keep it healthy", text: "A system only counts once it runs reliably for the people depending on it." },
    ],
  },

  skills: {
    kicker: "What I do",
    title: "Tools and talents.",
    intro: "A quick tour of what I work with. Hover or tap the “?” on any term for a plain-English explanation.",
    groups: [
      { title: "Solution architecture", icon: "sparkles", description: "Turning a fuzzy need into a clear, scalable plan.", items: ["System Design", "System Architecture", "API Design", "Requirements", "Root Cause Analysis"] },
      { title: "Full-stack & dashboards", icon: "chart", description: "Web apps and live dashboards people actually use.", items: ["React", "Node.js", "Python", "REST API", "WebSockets", "PostgreSQL", "MongoDB"] },
      { title: "Android apps", icon: "phone", description: "Native apps, from sketch to Play Store.", items: ["Kotlin", "Java", "Jetpack Compose", "Android SDK", "Firebase", "Material Design", "Google Play Console"] },
      { title: "Cloud on AWS", icon: "cloud", description: "Reliable, scalable infrastructure in the cloud.", items: ["AWS", "S3", "DynamoDB", "CloudFront", "AWS IoT"] },
      { title: "DevOps & CI/CD", icon: "wrench", description: "Automated, repeatable releases.", items: ["CI/CD", "Terraform", "GitHub Actions", "Docker", "Linux", "Monitoring"] },
      { title: "IoT & messaging", icon: "cpu", description: "Getting devices and services talking in real time.", items: ["MQTT", "Redis", "WebSockets", "Raspberry Pi", "ESP32", "CAN bus"] },
      { title: "Robots & factories", icon: "factory", description: "Fitting technology into real operations.", items: ["ROS", "LiDAR", "MES", "PLC", "HMI", "Commissioning"] },
      { title: "Working with people", icon: "users", description: "Because every system has users.", items: ["Customer workshops", "Documentation", "Cross-team delivery"] },
    ],
  },

  apps: {
    kicker: "Android apps",
    title: "Apps in your pocket.",
    intro: "Native Android apps I've designed and built. Swipe through the screens, see what each one does, and open it on Google Play.",
    items: [
      // TODO: replace these two samples with your real apps (or delete them to hide the section).
      {
        id: "sample-app-1",
        name: "TODO App One",
        emoji: "📱",
        color: "#5cc8b8",
        tagline: "TODO: one friendly sentence about what this app does.",
        description: "TODO: two or three sentences — who it's for, the problem it solves and what makes it nice to use.",
        status: "live",
        year: "TODO 20XX",
        screenshots: [], // e.g. ["/apps/app-one-1.png", "/apps/app-one-2.png"]
        features: ["TODO: a feature users love", "TODO: another feature", "TODO: a third feature"],
        tags: ["Kotlin", "Jetpack Compose", "Firebase"],
        stats: [{ value: "TODO", label: "downloads" }],
        links: [{ label: "Get it on Google Play", url: "https://play.google.com/store/apps/details?id=TODO" }],
      },
      {
        id: "sample-app-2",
        name: "TODO App Two",
        emoji: "🧭",
        color: "#8ab4f8",
        tagline: "TODO: one friendly sentence about what this app does.",
        description: "TODO: who it's for and why you built it.",
        status: "beta",
        screenshots: [],
        features: ["TODO: first feature", "TODO: second feature"],
        tags: ["Kotlin", "Android SDK", "Material Design"],
        stats: [],
        links: [],
      },
    ],
  },

  projects: {
    kicker: "Selected work",
    title: "Things I've built.",
    intro: "Each one opens into the story: what it is, why it mattered, and what I did. Customer details are kept general.",
    items: [
      {
        id: "fleet-platform",
        emoji: "🚦",
        title: "Air-traffic control for warehouse robots",
        summary: "Software that lets a team run many self-driving robots at once — assigning jobs and seeing where everything is.",
        category: "Software · Robotics",
        whatItIs: "A web-based control system for a fleet of autonomous mobile robots (AMRs). Robots report in continuously; the system gives them jobs, tracks progress and shows operators a live picture.",
        whyItMatters: "One robot is a gadget; twenty robots need coordination. Without it, jobs collide, robots sit idle and nobody knows what's going on.",
        myRole: "I designed and built the backend services and the messaging between robots and the server, and helped shape the operator dashboard.",
        results: ["One live view of every robot's status and task.", "Robots and server stay loosely coupled, so a hiccup on one side doesn't stop the other."],
        tags: ["Node.js", "React", "MongoDB", "Redis", "MQTT", "AWS", "Docker"],
      },
      {
        id: "robot-position",
        emoji: "📍",
        title: "Making sure a robot really knows where it is",
        summary: "Safety checks that catch a robot being confidently wrong about its position.",
        category: "Robotics · Safety",
        whatItIs: "Monitoring logic that watches how a robot works out its location using its laser scanner, and flags sudden jumps or suspicious behaviour.",
        whyItMatters: "A robot can feel 'sure' about its position and still be wrong. In a busy warehouse that's a safety risk, so it needs an independent sanity check.",
        myRole: "I analysed real robot data, designed the monitoring rules and the protection that stops unsafe steering.",
        results: ["Detects position 'jumps' independently of the robot's own confidence score.", "Offline analysis helped tune the safety thresholds."],
        tags: ["ROS", "Python", "LiDAR", "Localization"],
      },
      {
        id: "factory-link",
        emoji: "🔗",
        title: "Connecting the factory's system to the robots",
        summary: "When the factory asks for parts to be moved, a robot is sent automatically.",
        category: "Integration · Factory",
        whatItIs: "An interface between a customer's production-management software (MES) and the robot fleet, so production requests turn into robot jobs with status reported back.",
        whyItMatters: "Otherwise a person has to re-type every request into another system. Connecting them removes delay and mistakes.",
        myRole: "I defined how the two systems talk to each other and worked with the customer's team to integrate and test it.",
        results: ["Production requests become robot jobs without manual dispatch.", "The factory sees meaningful progress updates."],
        tags: ["REST API", "MES", "Task dispatch"],
      },
      {
        id: "robot-data",
        emoji: "📊",
        title: "Turning robot activity into useful dashboards",
        summary: "Robot data flows to the cloud so managers can see trends — without slowing the robots down.",
        category: "Cloud · Data",
        whatItIs: "A pipeline that carries information from robots to cloud storage and then to dashboards.",
        whyItMatters: "Managers need history and trends to improve operations, but robots must keep working even if the internet drops.",
        myRole: "I designed the flow end to end — from how robots publish data to how it is stored and displayed.",
        results: ["Robots keep working when the cloud is unreachable.", "Trip and performance history available for analysis."],
        tags: ["AWS", "MQTT", "DynamoDB", "S3", "CloudFront"],
      },
      {
        id: "delivery-screen",
        emoji: "🖥️",
        title: "One screen to request a delivery",
        summary: "Operators tap a screen and a robot brings the material — gates open along the way.",
        category: "Factory · Workflow",
        whatItIs: "A simple operator screen (HMI) connected to a server, a store manager and the robots so that material requests become robot missions.",
        whyItMatters: "People on the shop floor shouldn't need to understand robots. If asking for a delivery is easy, they'll actually use it.",
        myRole: "I designed the workflow and integrated the screen, server, gates and robots.",
        results: ["Material requests from a single screen.", "Robot movement and gate control coordinated in one flow."],
        tags: ["HMI", "Wi-Fi", "System Design"],
      },
      {
        id: "robot-reliability",
        emoji: "🩺",
        title: "Keeping robots healthy in the field",
        summary: "Smart start-up and self-monitoring so robots boot reliably and recover on their own.",
        category: "Reliability · DevOps",
        whatItIs: "Automation that starts a robot's software in the right order, watches how hard its computer is working, and recovers when things go wrong.",
        whyItMatters: "A robot that fails to start — or overloads itself — stops work and needs a technician to visit.",
        myRole: "I designed the staged start-up, monitoring and recovery logic.",
        results: ["Staged start-up avoids overload at boot.", "Automatic recovery path for unhealthy systems."],
        tags: ["Linux", "Python", "Docker", "Monitoring"],
      },
    ],
  },

  experience: {
    kicker: "Journey",
    title: "Where I've worked and studied.",
    jobs: [
      // TODO: replace with your real history (newest first).
      {
        role: "TODO Role title",
        org: "TODO Company",
        period: "TODO 20XX — Present",
        summary: "TODO: one sentence on what you did there and for whom.",
        highlights: ["TODO: something you achieved, with a number if possible.", "TODO: something you built or improved."],
      },
    ],
    educationTitle: "Education",
    education: [{ school: "TODO University", degree: "TODO Degree, Subject", period: "TODO 20XX — 20XX" }],
  },

  contact: {
    kicker: "Contact",
    title: "Let's build something together.",
    text: "Have a project, a question, or just want to say hi? I'd love to hear from you.",
    buttonLabel: "Email me",
  },

  footer: { note: "Made with care." },

  glossary: {
    "CI/CD": "Continuous Integration and Delivery — automation that tests and releases software safely, every time.",
    Terraform: "A tool that builds cloud infrastructure from code, so setups are repeatable and reviewable.",
    "GitHub Actions": "Automation built into GitHub that runs tests and deployments whenever code changes.",
    "System Design": "Planning how the parts of a large system work together and handle growth and failure.",
    WebSockets: "A live two-way connection between an app and a server, used for instant updates.",
    "AWS IoT": "Amazon's cloud service for connecting and managing fleets of devices.",
    Linux: "The operating system that powers most servers and cloud machines.",
    Kotlin: "The modern programming language Google recommends for building Android apps.",
    Java: "A long-established programming language, still widely used for Android and servers.",
    "Jetpack Compose": "Android's modern toolkit for building app screens with less code.",
    "Android SDK": "The official toolbox of code and tools for making Android apps.",
    Firebase: "Google's ready-made backend for apps: sign-in, database, notifications and analytics.",
    "Material Design": "Google's design system that makes Android apps look and feel consistent.",
    "Google Play Console": "The dashboard used to publish and manage apps on the Play Store.",
    AMR: "Autonomous Mobile Robot — a self-driving robot that moves things around a building.",
    ROS: "Robot Operating System — a popular toolkit for building robot software.",
    LiDAR: "A spinning laser scanner that lets a robot 'see' the shape of a room.",
    Localization: "How a robot works out where it is on its map.",
    MQTT: "A lightweight messaging system that devices use to send each other small updates.",
    MES: "Manufacturing Execution System — the software factories use to track and control production.",
    PLC: "Programmable Logic Controller — a rugged industrial computer that runs machinery.",
    HMI: "Human-Machine Interface — a touchscreen or panel people use to control a machine.",
    "REST API": "A standard way for two programs to ask each other for information or actions.",
    "API Design": "Planning how different programs talk to each other.",
    AWS: "Amazon Web Services — rented computing and storage in the cloud.",
    S3: "AWS storage for files, like an endless hard drive in the cloud.",
    CloudFront: "AWS service that delivers websites and data quickly worldwide.",
    DynamoDB: "AWS database built for speed at very large scale.",
    MongoDB: "A flexible database that stores information as documents.",
    PostgreSQL: "A reliable, widely used database for structured information.",
    Redis: "A very fast in-memory database, often used for live data.",
    Docker: "A way to package software so it runs the same everywhere.",
    "CAN bus": "The wiring and language many vehicles and machines use to share signals.",
    ESP32: "A tiny, cheap computer chip with built-in Wi-Fi, popular in gadgets.",
    "Raspberry Pi": "A credit-card-sized computer used for prototypes and small devices.",
    "Node.js": "A tool for running JavaScript on servers.",
    React: "A popular library for building interactive web pages.",
    Commissioning: "Installing and testing a system on site until it's proven to work.",
    "Root Cause Analysis": "Digging past the symptom to find why something really went wrong.",
    "System Architecture": "The big-picture plan of how all parts of a system fit together.",
    Monitoring: "Watching a system's health so problems are spotted early.",
    "Task dispatch": "Deciding which robot or worker should do which job.",
  },
};
