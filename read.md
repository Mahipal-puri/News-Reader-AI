# AI News Reader Platform

## Project Overview

An AI-powered News Reader platform that aggregates news from multiple sources, personalizes content, summarizes articles, and provides real-time updates through web and mobile applications.

## Goal

Build a modern, scalable, intelligent news ecosystem that delivers relevant, unbiased, and personalized news experiences.

## Target Users

* General Readers
* Students
* Professionals
* Investors
* Researchers
* Regional Language Users
* Journalists

## User Roles

### Guest

* Browse news
* Search articles
* View categories

### Registered User

* Save articles
* Follow topics
* Receive alerts
* Customize feed

### Premium User

* Ad-free experience
* AI insights
* Advanced analytics
* Unlimited bookmarks

### Admin

* Manage content
* Manage users
* Analytics
* Moderation

### Editor

* Verify content
* Manage featured stories
* Fact-check reports

## Core Modules

### Authentication

* Email Login
* Google Login
* OTP Login
* Password Recovery
* Session Management
* Role-Based Access

### News Aggregation

* API Integration
* RSS Feed Import
* Publisher Management
* Category Mapping
* Auto Content Sync
* Duplicate Detection

### Categories

* Politics
* Technology
* Business
* Sports
* Entertainment
* Science
* Health
* Education
* Finance
* Crypto
* Startups
* Local News
* International News

### Personalized Feed

* Interest Selection
* Reading History
* Topic Following
* Smart Recommendations
* Publisher Preferences
* Location-Based News

### Article Features

* Full Article View
* AI Summary
* Reading Time
* Author Profile
* Related Articles
* Tags
* Source Information
* Image Gallery

### Search System

* Keyword Search
* Voice Search
* Topic Search
* Filter by Date
* Filter by Source
* Trending Search

### Bookmark System

* Save Articles
* Reading Lists
* Offline Reading
* Favorites
* Collections

### Notification System

* Breaking News Alerts
* Category Alerts
* Topic Alerts
* Daily Briefing
* Weekly Digest

## AI Features

### AI Summarization

* Short Summary
* Bullet Summary
* Key Takeaways
* One Minute Read

### AI Assistant

* Chat With News
* Ask Questions
* Topic Explanation
* Context Expansion

### AI Analysis

* Sentiment Analysis
* Bias Detection
* Fact Verification
* Trend Analysis
* Topic Clustering

### AI Translation

* Multi-Language Support
* Instant Translation
* Voice Translation

### AI Voice Reader

* Text To Speech
* Multiple Voices
* Playback Speed Control

## Social Features

* Like Articles
* Comment System
* Share News
* User Profiles
* Follow Users
* Discussion Threads

## Analytics Dashboard

* Most Read Articles
* Trending Topics
* User Engagement
* Traffic Analytics
* Source Performance

## Admin Features

* User Management
* Content Moderation
* Publisher Management
* Category Management
* Reports
* Audit Logs

## Security Features

* JWT Authentication
* Role Permissions
* Data Encryption
* Rate Limiting
* Secure APIs
* Spam Protection
* GDPR Compliance

## UI Screens

* Landing Page
* Login/Register
* Home Feed
* Category Page
* Article Detail
* Search Page
* Bookmarks
* Notifications
* Profile
* Settings
* Admin Dashboard
* Analytics Dashboard

## Database Collections

* Users
* Roles
* Articles
* Categories
* Publishers
* Comments
* Likes
* Bookmarks
* Notifications
* Topics
* Reports
* Analytics

## Tech Stack

### Frontend

* React
* Next.js
* Tailwind CSS
* Redux Toolkit

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### AI

* OpenAI API
* NLP Models
* Sentiment Engine

### Infrastructure

* AWS
* Docker
* Nginx
* Cloud Storage

## Future Features

* Podcast News
* Video News
* Smart Widgets
* Smart Watch App
* AR News Experience
* Community Journalism
* News Marketplace

## Implementation Docs

Each user request produces a dedicated doc under [`docs/`](docs/). They link
back here. Newest first.

- **2026-06-20** — [10 · Landing feature cards are now live links](docs/10-landing-feature-links.md) — All 6 cards on the landing page (AI Summaries, Voice Reader, Translate, Trending Topics, Bookmarks & Lists, Smart Alerts) are now clickable; AI cards deep-link to the right tab via URL hash (`/article/a1#listen`, etc.).
- **2026-06-20** — [09 · Git init + first push to GitHub](docs/09-git-init-and-push.md) — Initialized the repo on `main`, hardened `.gitignore`, pushed commit `3fb274a` (90 files) to `Mahipal-puri/News-Reader-AI` as the first commit.
- **2026-06-20** — [08 · Indian Express Tier 1 features](docs/08-indianexpress-tier1.md) — Shipped breaking-news ticker, LIVE article type (badge + updates feed on `a5` & `a11`), Premium paywall preview (locks `a4` & `a8` for non-premium), Most Read sidebar, WhatsApp share menu.
- **2026-06-20** — [07 · Indian Express feature research](docs/07-indianexpress-feature-research.md) — Researched indianexpress.com patterns and proposed a three-tier roadmap (ticker, LIVE, paywall preview, city editions, Express Shorts, etc.) mapped against what we already have.
- **2026-06-20** — [06 · Reporter, Sub-Admin, Super-Admin roles](docs/06-extended-roles.md) — Extended role model with three new roles; Settings now lets you switch into any of the eight roles and see its capabilities.
- **2026-06-20** — [05 · "Developed by Digital Hammer" attribution](docs/05-digital-hammer-attribution.md) — Credit added to both footers and to page metadata (author / creator / publisher).
- **2026-06-20** — [04 · Indian languages + accent theme](docs/04-languages-and-accent-theme.md) — All 22 official Indian languages + English in the picker; six runtime accent colors swap brand colors app-wide.
- **2026-06-20** — [03 · Modern design polish](docs/03-design-polish.md) — Fluid type, frosted navbar, lift-card hover, reading-progress bar, accessibility pass.
- **2026-06-20** — [02 · Run the dev server](docs/02-run-dev-server.md) — npm install + dev server start; clarified the project is a web app, not a mobile app.
- **2026-06-20** — [01 · Initial frontend build](docs/01-initial-build.md) — Reader-facing 10-screen Next.js 14 + RTK Query + Tailwind frontend with mocked data and AI shells.

## Claude Development Rules

1. Use scalable architecture.
2. Follow clean code principles.
3. Implement reusable components.
4. Use TypeScript where possible.
5. Create REST APIs with validation.
6. Apply responsive design.
7. Optimize performance.
8. Implement secure authentication.
9. Follow accessibility standards.
10. Write production-ready code.
11. Add error handling everywhere.
12. Use modular folder structure.
13. Create comprehensive documentation.
14. Maintain test coverage above 80%.
15. Design for future scalability.
