import type { PortfolioConfig } from "./config/types";

export const config: PortfolioConfig = {
  meta: {
    title: "Srikanth Chinthaginjala — Systems Engineer & Architect",
    description:
      "Srikanth Chinthaginjala is a Systems Engineer working across system architecture, software, cloud, IoT, robotics and industrial automation.",
    url: "",
    ogImage: "",
    language: "en",
  },

  person: {
    name: "Srikanth Chinthaginjala",
    firstName: "Srikanth",
    role: "Systems Engineer · System Architect · Software Engineer",
    location: "Bengaluru, India",
    email: "srikanth.cgl1@gmail.com",
    phone: "+919515087850",
    photo: "",
    initials: "SC",
    resume: "",
    availability: {
      status: "open",
      text: "Open to interesting engineering problems and conversations",
    },
  },

  social: [
    // Add your real URLs here.
    // { label: "LinkedIn", url: "https://www.linkedin.com/in/your-profile", icon: "linkedin" },
    // { label: "GitHub", url: "https://github.com/your-profile", icon: "github" },
  ],

  sections: ["about", "projects", "skills", "experience", "contact"],

  navLabels: {
    about: "About",
    apps: "Apps",
    projects: "Work",
    skills: "Engineering",
    experience: "Experience",
    contact: "Contact",
  },

  hero: {
    greeting: "Hi, I'm",
    headline: "Designing systems where software meets reality.",
    rotatingLead: "I work across",
    rotatingWords: [
      "system architecture",
      "software engineering",
      "cloud & IoT",
      "robotics",
      "industrial automation",
      "embedded & edge systems",
    ],
    intro:
      "I'm a systems-focused engineer who designs, integrates and deploys software-driven systems across software, cloud, IoT, robotics and industrial environments.",
    primaryButton: {
      label: "Explore my work",
      target: "projects",
    },
    secondaryButton: {
      label: "Engineering stack",
      target: "skills",
    },
    highlights: [
      { value: "2+", label: "years engineering systems" },
      { value: "7+", label: "engineering domains" },
    ],
  },

  about: {
    kicker: "About me",
    title: "From requirements to real-world systems.",
    paragraphs: [
      "I'm a systems-focused engineer who enjoys working at the intersection of software, machines and real-world infrastructure.",
      "My work spans system architecture, software development, cloud and IoT platforms, autonomous mobile robots, industrial automation and edge systems.",
      "I work across the engineering lifecycle — understanding requirements, defining system behaviour, designing interfaces and architecture, building software, integrating physical systems, deploying solutions and validating them in real environments.",
      "I particularly enjoy problems where software has to interact with the physical world, where reliability, communication, deployment constraints and real operational requirements matter as much as the code itself.",
    ],
    facts: [
      { label: "Based in", value: "Bengaluru, India" },
      {
        label: "Focus",
        value: "Systems, architecture, software & integration",
      },
      {
        label: "Domains",
        value: "Cloud, IoT, robotics & industrial systems",
      },
      {
        label: "Experience",
        value: "2+ years in systems engineering",
      },
    ],
    values: [
      {
        emoji: "🧭",
        title: "Understand the real problem",
        text: "I start with requirements, constraints, operating conditions and the people who will actually use the system.",
      },
      {
        emoji: "🧩",
        title: "Design the whole system",
        text: "I look beyond individual components and define how software, hardware, networks, data and people interact.",
      },
      {
        emoji: "🛠️",
        title: "Make it work in reality",
        text: "A design only matters when it can be integrated, deployed, validated and operated reliably in the real world.",
      },
    ],
  },

  skills: {
    kicker: "Engineering",
    title: "The stack behind the systems.",
    intro:
      "I work across multiple engineering layers, connecting software, infrastructure, physical systems and industrial environments.",
    groups: [
      {
        title: "Systems & Architecture",
        icon: "sparkles",
        description:
          "Turning requirements and constraints into clear system behaviour and architecture.",
        items: [
          "System Design",
          "System Architecture",
          "Requirements Engineering",
          "API Design",
          "Interface Definition",
          "System Integration",
          "Root Cause Analysis",
          "Technical Documentation",
        ],
      },
      {
        title: "Software Engineering",
        icon: "code",
        description:
          "Building backend services, web applications, APIs and engineering tools.",
        items: [
          "Python",
          "C",
          "C++",
          "JavaScript",
          "TypeScript",
          "Node.js",
          "React",
          "REST APIs",
          "WebSockets",
          "FastAPI",
          "SQL",
          "Shell",
        ],
      },
      {
        title: "Data & Messaging",
        icon: "database",
        description:
          "Designing data flows and communication between distributed systems.",
        items: [
          "MongoDB",
          "PostgreSQL",
          "MySQL",
          "SQLite",
          "Redis",
          "MQTT",
          "Event-driven Systems",
          "Data Pipelines",
        ],
      },
      {
        title: "Cloud & Infrastructure",
        icon: "cloud",
        description:
          "Building cloud infrastructure and services for connected systems.",
        items: [
          "AWS",
          "S3",
          "DynamoDB",
          "CloudFront",
          "AWS IoT",
          "Lambda",
          "API Gateway",
          "Terraform",
          "Docker",
          "GitHub Actions",
          "CI/CD",
          "Linux",
        ],
      },
      {
        title: "Robotics",
        icon: "cpu",
        description:
          "Developing and integrating software around autonomous mobile robots.",
        items: [
          "ROS",
          "AMR",
          "LiDAR",
          "Navigation",
          "Localization",
          "NDT",
          "Path Analysis",
          "Computer Vision",
          "Robot Safety",
          "Fleet Management",
        ],
      },
      {
        title: "Embedded & Edge",
        icon: "wrench",
        description:
          "Working close to hardware, sensors, controllers and edge computers.",
        items: [
          "Jetson",
          "Raspberry Pi",
          "ESP32",
          "Arduino",
          "CAN",
          "UART",
          "TCP/IP",
          "Edge Computing",
          "Sensor Integration",
        ],
      },
      {
        title: "Industrial Systems",
        icon: "factory",
        description:
          "Connecting software systems with real industrial processes.",
        items: [
          "MES",
          "PLC",
          "HMI",
          "Industrial Networking",
          "Wi-Fi",
          "Customer IT Integration",
          "Commissioning",
          "System Validation",
        ],
      },
      {
        title: "Engineering Collaboration",
        icon: "users",
        description:
          "Working across engineering, customers, operations and business teams.",
        items: [
          "Customer Workshops",
          "Requirement Gathering",
          "Technical Presentations",
          "Cross-team Delivery",
          "Solution Definition",
          "Technical Documentation",
        ],
      },
    ],
  },

  /*
   * Android applications are intentionally not shown in the current portfolio.
   * Keep this section empty until there are public applications worth showcasing.
   */
  apps: {
    kicker: "Applications",
    title: "Software products.",
    intro: "",
    items: [],
  },

  projects: {
    kicker: "Selected work",
    title: "Engineering systems I've worked on.",
    intro:
      "A selection of engineering problems spanning software, robotics, cloud, industrial integration and system reliability. Customer-specific information is intentionally generalized.",
    items: [
      {
        id: "fleet-platform",
        emoji: "🚦",
        title: "Fleet Management System for Autonomous Robots",
        summary:
          "Software that coordinates autonomous mobile robots, tasks, communication and operator visibility across a fleet.",
        category: "Systems · Software · Robotics",
        whatItIs:
          "A production fleet management platform for autonomous mobile robots. The system coordinates robot tasks, maintains fleet state, communicates with vehicles and provides operators with visibility into ongoing operations.",
        whyItMatters:
          "Managing one robot is very different from managing a fleet. The system has to coordinate tasks, robot state, communication and operational workflows while remaining reliable in a real industrial environment.",
        myRole:
          "I worked across system requirements, backend services, fleet communication, task workflows, integrations and engineering improvements around the FMS.",
        results: [
          "Centralized visibility of robot and task state.",
          "Event-driven communication between robots and the fleet platform.",
          "Architecture designed around real operational and integration requirements.",
        ],
        tags: [
          "Node.js",
          "React",
          "MongoDB",
          "Redis",
          "MQTT",
          "AWS",
          "Docker",
        ],
      },

      {
        id: "robot-position",
        emoji: "📍",
        title: "AMR Localization & Safety Monitoring",
        summary:
          "Independent monitoring that detects when a robot may be confidently wrong about its position or operating state.",
        category: "Robotics · Safety · Reliability",
        whatItIs:
          "Monitoring logic around autonomous mobile robot localization, steering behaviour and operational safety conditions.",
        whyItMatters:
          "A localization system can report a good convergence score while the estimated pose has still shifted unexpectedly. Safety monitoring therefore needs independent checks around robot behaviour and position changes.",
        myRole:
          "I analysed recorded robot data, investigated localization behaviour, designed monitoring logic and worked on protection mechanisms around steering and operational conditions.",
        results: [
          "Independent detection of abnormal pose changes.",
          "Zone-based monitoring for operational constraints.",
          "Offline data analysis used to understand and tune system behaviour.",
        ],
        tags: [
          "ROS",
          "Python",
          "LiDAR",
          "NDT",
          "Localization",
          "Path Analysis",
        ],
      },

      {
        id: "factory-link",
        emoji: "🔗",
        title: "MES ↔ Fleet Integration",
        summary:
          "Connecting manufacturing systems with autonomous robots so production requests can become automated material movements.",
        category: "Integration · Industrial Systems",
        whatItIs:
          "An integration layer between a manufacturing execution system and a robot fleet. Production requests are translated into robot tasks and meaningful task status is returned to the manufacturing system.",
        whyItMatters:
          "Without system integration, operators have to manually transfer information between manufacturing software and robot systems. APIs and event-driven workflows remove that unnecessary manual step.",
        myRole:
          "I worked on requirements, system behaviour, API/interface definition, task-dispatch logic, feedback workflows and integration testing.",
        results: [
          "Production requests can be translated into robot tasks.",
          "Task status can be communicated back to the manufacturing system.",
          "Defined integration behaviour around real production workflows.",
        ],
        tags: [
          "REST API",
          "MQTT",
          "MES",
          "FMS",
          "System Integration",
        ],
      },

      {
        id: "robot-data",
        emoji: "☁️",
        title: "Cloud Data Pipeline for Connected Robots",
        summary:
          "Moving robot telemetry and trip information into cloud infrastructure for monitoring, visualization and analysis.",
        category: "Cloud · IoT · Data",
        whatItIs:
          "A connected data pipeline carrying information from robots and edge systems into cloud services for storage, visualization and analysis.",
        whyItMatters:
          "Operational data is valuable for understanding fleet performance, but robots should not become dependent on the cloud for core operation.",
        myRole:
          "I worked across the edge-to-cloud data flow, messaging, storage and visualization architecture.",
        results: [
          "Robot data can be persisted for historical analysis.",
          "Cloud connectivity is separated from core robot operation.",
          "Architecture supports monitoring and operational visibility.",
        ],
        tags: [
          "AWS",
          "MQTT",
          "DynamoDB",
          "S3",
          "CloudFront",
          "IoT",
        ],
      },

      {
        id: "delivery-screen",
        emoji: "🏭",
        title: "Industrial HMI & AMR Workflow",
        summary:
          "Connecting an operator interface, industrial workflow and autonomous robot to automate material movement.",
        category: "Industrial · HMI · Robotics",
        whatItIs:
          "An operator-driven workflow where a material request from an HMI triggers an autonomous robot mission and coordinates the associated industrial process.",
        whyItMatters:
          "Shop-floor users should not need to understand the underlying robot software. The system should turn a simple operator action into a controlled end-to-end workflow.",
        myRole:
          "I worked on the system workflow, interfaces, server-side behaviour, robot interaction and integration requirements.",
        results: [
          "Simple operator-driven material request workflow.",
          "System coordinates operator input, robot movement and industrial process steps.",
          "Designed with customer IT and site constraints in mind.",
        ],
        tags: [
          "HMI",
          "Wi-Fi",
          "AMR",
          "System Design",
          "Industrial Integration",
        ],
      },

      {
        id: "robot-reliability",
        emoji: "🩺",
        title: "Robot Deployment & Reliability Automation",
        summary:
          "Automating startup, monitoring and recovery so deployed robot systems are more resilient in the field.",
        category: "Reliability · Edge · DevOps",
        whatItIs:
          "Automation around robot computers and software modules to improve startup sequencing, resource monitoring and recovery behaviour.",
        whyItMatters:
          "Field-deployed systems need to recover from expected software and resource problems without requiring a technician to manually restart every component.",
        myRole:
          "I worked on startup sequencing, staged module launches, system monitoring, resource checks and recovery logic.",
        results: [
          "Controlled startup sequence for software modules.",
          "Resource monitoring to identify unhealthy system states.",
          "Recovery mechanisms designed around real deployment constraints.",
        ],
        tags: [
          "Linux",
          "Python",
          "Docker",
          "Monitoring",
          "Edge Computing",
          "Deployment",
        ],
      },
    ],
  },

  experience: {
    kicker: "Experience",
    title: "Where I've been building systems.",
    intro:
      "My experience has increasingly moved toward systems engineering — connecting software, robots, cloud infrastructure and industrial environments.",
    jobs: [
      {
        role: "Systems Engineer",
        org: "Virya Autonomous Technologies Pvt. Ltd.",
        period: "May 2024 — Present",
        summary:
          "Working across autonomous mobile robots, fleet management, software systems, industrial integration and customer-facing solution engineering.",
        highlights: [
          "Work across FMS architecture, robot-to-server communication, task workflows and software integrations.",
          "Design and integrate solutions involving AMRs, ROS, LiDAR, cloud services, MQTT, APIs and industrial systems.",
          "Translate customer requirements and operating constraints into system behaviour, architecture and implementation requirements.",
          "Work with engineering and customer teams through integration, deployment, validation and commissioning activities.",
          "Contribute to production systems covering software, edge computing, cloud infrastructure, monitoring and operational reliability.",
        ],
      },
    ],
    educationTitle: "Education",
    education: [
      {
        school: "GITAM University",
        degree: "B.Tech, Electronics & Communication Engineering (AI/ML)",
        period: "2020 — 2024",
      },
    ],
  },

  contact: {
    kicker: "Contact",
    title: "Have a system to build?",
    text:
      "I'm interested in engineering problems that sit at the intersection of software, physical systems and real-world infrastructure.",
    buttonLabel: "Get in touch",
  },

  footer: {
    note: "Designed and built by Srikanth.",
  },

  glossary: {
    "CI/CD":
      "Continuous Integration and Delivery — automation that tests and releases software consistently.",
    Terraform:
      "Infrastructure as code for creating and managing cloud resources in a repeatable way.",
    "GitHub Actions":
      "GitHub's automation platform for running tests, builds and deployments.",
    "System Design":
      "Planning how the components of a system interact, communicate, scale and handle failures.",
    WebSockets:
      "A persistent two-way connection that allows servers and clients to exchange updates in real time.",
    "AWS IoT":
      "AWS services for connecting, managing and communicating with IoT devices.",
    Linux:
      "An operating system widely used across servers, cloud infrastructure and edge computers.",
    AMR:
      "Autonomous Mobile Robot — a robot capable of navigating and transporting material without continuous manual control.",
    ROS:
      "Robot Operating System — a framework and ecosystem used to build robotics software.",
    LiDAR:
      "A sensing technology that uses laser measurements to understand the surrounding environment.",
    Localization:
      "The process of estimating a robot's position and orientation within its environment.",
    MQTT:
      "A lightweight publish/subscribe messaging protocol commonly used for connected devices and distributed systems.",
    MES:
      "Manufacturing Execution System — software used to manage and track manufacturing operations.",
    PLC:
      "Programmable Logic Controller — an industrial computer used to control machinery and processes.",
    HMI:
      "Human-Machine Interface — the interface through which an operator interacts with a machine or industrial process.",
    "REST API":
      "An HTTP-based interface that allows software systems to exchange data and trigger actions.",
    "API Design":
      "Defining how software systems communicate, including requests, responses, data models and error behaviour.",
    AWS:
      "Amazon Web Services — a broad set of cloud infrastructure and application services.",
    S3:
      "AWS object storage commonly used for files, backups, datasets and application assets.",
    CloudFront:
      "AWS's content delivery network for serving web content and data efficiently.",
    DynamoDB:
      "AWS's managed NoSQL database designed for highly scalable applications.",
    MongoDB:
      "A document-oriented database commonly used for flexible application data.",
    PostgreSQL:
      "A powerful relational database used for structured and transactional application data.",
    Redis:
      "An in-memory data store commonly used for caching, fast state and real-time workloads.",
    Docker:
      "A containerization technology that packages applications and their dependencies consistently.",
    "CAN bus":
      "A communication protocol widely used by vehicles, controllers and embedded systems.",
    ESP32:
      "A low-cost microcontroller with built-in wireless connectivity, commonly used in IoT and embedded systems.",
    "Raspberry Pi":
      "A small single-board computer commonly used for edge computing, prototypes and connected devices.",
    "Node.js":
      "A JavaScript runtime commonly used to build backend services and network applications.",
    React:
      "A JavaScript library for building interactive user interfaces.",
    Commissioning:
      "The process of installing, configuring, testing and validating a system at its deployment site.",
    "Root Cause Analysis":
      "A structured approach to identifying the underlying cause of a problem rather than only treating its symptoms.",
    "System Architecture":
      "The high-level structure describing how the components of a system fit together and communicate.",
    Monitoring:
      "Collecting and evaluating system health and behaviour so issues can be detected and investigated.",
    "Task dispatch":
      "Selecting and assigning work to an appropriate robot or system component.",
    NDT:
      "Normal Distributions Transform — a scan-matching technique commonly used for LiDAR-based localization.",
    "Computer Vision":
      "Techniques that allow software to extract useful information from images or video.",
    "Edge Computing":
      "Processing data closer to the physical device or robot instead of relying entirely on a remote cloud service.",
    "System Integration":
      "Connecting independently developed systems so they operate together as one end-to-end workflow.",
  },
};