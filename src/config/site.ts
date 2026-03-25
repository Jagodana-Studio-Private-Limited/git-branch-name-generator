export const siteConfig = {
  // ====== CUSTOMIZE THESE FOR EACH TOOL ======
  name: "Git Branch Name Generator",
  title: "Git Branch Name Generator - Clean Branch Names from Issue Titles",
  description:
    "Generate clean, consistent git branch names from issue titles, ticket numbers, and task descriptions. Supports GitFlow, GitHub Flow, and custom naming conventions.",
  url: "https://git-branch-name-generator.tools.jagodana.com",
  ogImage: "/opengraph-image",

  // Header
  headerIcon: "GitBranch", // lucide-react icon name
  // Brand gradient colors for Tailwind are in globals.css (--brand / --brand-accent)
  brandAccentColor: "#f59e0b", // hex accent for OG image gradient (must match --brand-accent in globals.css)

  // SEO
  keywords: [
    "git branch name generator",
    "branch naming convention",
    "git branch from issue",
    "gitflow branch name",
    "github branch name",
    "branch name converter",
    "git branch tool",
    "branch naming tool",
  ],
  applicationCategory: "DeveloperApplication",

  // Theme
  themeColor: "#f97316", // used in manifest and meta tags

  // Branding
  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  // Social Profiles (for Organization schema sameAs)
  socialProfiles: [
    "https://twitter.com/jagodana",
    // Add more: LinkedIn, YouTube, etc.
  ],

  // Links
  links: {
    github:
      "https://github.com/Jagodana-Studio-Private-Limited/git-branch-name-generator",
    website: "https://jagodana.com",
  },

  // Footer
  footer: {
    about:
      "Git Branch Name Generator helps developers create clean, consistent branch names from issue titles and ticket descriptions. Free, fast, and works entirely in your browser.",
    featuresTitle: "Features",
    features: [
      "GitFlow & GitHub Flow support",
      "Ticket number integration (JIRA, GH)",
      "Configurable separators & max length",
      "Branch history with one-click reuse",
    ],
  },

  // Hero Section
  hero: {
    badge: "Developer Productivity Tool",
    titleLine1: "Generate Clean",
    titleGradient: "Git Branch Names",
    subtitle:
      "Convert issue titles, ticket descriptions, and task names into clean, consistent git branch names. Supports GitFlow, GitHub Flow, JIRA tickets, and custom conventions.",
  },

  // Feature Cards (shown on homepage)
  featureCards: [
    {
      icon: "🌿",
      title: "Multiple Conventions",
      description:
        "Supports GitFlow (feature/, bugfix/, hotfix/), GitHub Flow, chore, docs, test prefixes and more.",
    },
    {
      icon: "⚡",
      title: "Instant Generation",
      description:
        "Paste any issue title and get a clean branch name instantly. Handles special characters, stop words, and length limits.",
    },
    {
      icon: "📋",
      title: "Copy & History",
      description:
        "One-click copy with full git command preview. Recent branch history stored locally for quick reuse.",
    },
  ],

  // Related Tools (cross-linking to sibling Jagodana tools for internal SEO)
  relatedTools: [
    {
      name: "Commit Message Formatter",
      url: "https://commit-message-formatter.tools.jagodana.com",
      icon: "✍️",
      description:
        "Generate well-structured conventional commit messages effortlessly.",
    },
    {
      name: "Gitignore Generator",
      url: "https://gitignore-generator.tools.jagodana.com",
      icon: "🚫",
      description:
        "Create .gitignore files for any language, framework, or tool.",
    },
    {
      name: "Slug Generator",
      url: "https://slug-generator.tools.jagodana.com",
      icon: "🔗",
      description: "Convert any text into clean, URL-friendly slugs.",
    },
    {
      name: "README Generator",
      url: "https://readme-generator.tools.jagodana.com",
      icon: "📄",
      description:
        "Generate professional README files for your GitHub projects.",
    },
    {
      name: "Regex Playground",
      url: "https://regex-playground.tools.jagodana.com",
      icon: "🧪",
      description: "Build, test & debug regular expressions in real-time.",
    },
    {
      name: "JSON Formatter",
      url: "https://json-formatter.tools.jagodana.com",
      icon: "📦",
      description: "Format, validate, and minify JSON with syntax highlighting.",
    },
  ],

  // HowTo Steps (drives HowTo JSON-LD schema for rich results)
  howToSteps: [
    {
      name: "Paste your issue title",
      text: "Copy and paste your GitHub issue title, JIRA ticket summary, or any task description into the input field.",
      url: "",
    },
    {
      name: "Choose branch type and options",
      text: "Select the branch type (feature, bugfix, hotfix, etc.), add an optional ticket number, and configure separators and max length.",
      url: "",
    },
    {
      name: "Copy your branch name",
      text: "Click the copy button to copy the generated branch name or the full git checkout command to your clipboard.",
      url: "",
    },
  ],
  howToTotalTime: "PT1M", // ISO 8601 duration (e.g., PT1M = 1 minute)

  // FAQ (drives both the FAQ UI section and FAQPage JSON-LD schema)
  faq: [
    {
      question: "What is a git branch naming convention?",
      answer:
        "A git branch naming convention is a set of rules for consistently naming branches in a repository. Common conventions include GitFlow (using prefixes like feature/, bugfix/, hotfix/, release/) and GitHub Flow (using descriptive names). Consistent naming helps teams understand the purpose of each branch at a glance.",
    },
    {
      question: "How does the Git Branch Name Generator work?",
      answer:
        "The generator converts your issue title or task description into a clean branch name by lowercasing the text, removing special characters, replacing spaces with your chosen separator (hyphen or underscore), optionally removing common stop words, prepending the branch type prefix, and inserting ticket numbers if provided. Everything runs in your browser — no data is sent to any server.",
    },
    {
      question: "Can I integrate JIRA ticket numbers into branch names?",
      answer:
        "Yes! Enter your ticket number (e.g., JIRA-123 or GH-45) in the ticket number field. The generator will automatically insert it after the branch type prefix, following the common convention: feature/JIRA-123-your-issue-title.",
    },
    {
      question: "What is the recommended maximum branch name length?",
      answer:
        "Most teams use 50–72 characters as the maximum branch name length. Git itself has no strict limit, but shorter names are easier to type and read in terminal output. The generator defaults to 50 characters but you can adjust it from 30 to 100 characters using the length slider.",
    },
    {
      question: "What branch types does the generator support?",
      answer:
        "The generator supports: feature (new features), bugfix (non-critical bug fixes), hotfix (urgent production fixes), chore (maintenance tasks), release (release preparation), docs (documentation changes), test (test additions), and a custom option where you can type your own prefix.",
    },
  ],

  // ====== PAGES (for sitemap + per-page SEO) ======
  pages: {
    "/": {
      title:
        "Git Branch Name Generator - Clean Branch Names from Issue Titles",
      description:
        "Generate clean, consistent git branch names from issue titles, ticket numbers, and task descriptions. Supports GitFlow, GitHub Flow, and custom naming conventions.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
