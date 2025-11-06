# Rabbit Clicker

A delightful idle clicker game where players build a rabbit empire, one carrot at a time.

## What Is This?

Rabbit Clicker is a web-based incremental game that combines satisfying click-to-earn mechanics with strategic idle gameplay. Players start by clicking to gather carrots, then gradually unlock rabbit helpers, upgrades, and automated systems that generate resources even when they're not actively playing. Think of it as running a rabbit warren that grows from a single bunny with a carrot patch into a thriving rabbit civilization.

## The Core Experience

The game starts simple: click a carrot, earn a carrot. But as you play, you'll:
- Unlock adorable rabbit characters with unique abilities
- Build automated carrot farms that work while you're away
- Open mystery crates to discover rare and powerful rabbits
- Upgrade your warren to maximize carrot production
- Progress through increasingly ambitious milestones

The magic of Rabbit Clicker is how it evolves from active clicking into a strategic idle game where you're optimizing rabbit teams, planning upgrades, and checking back to see your carrot empire flourishing.

## Why Rabbits?

Rabbits are inherently suited for incremental games:
- They multiply quickly (perfect for scaling numbers)
- They're universally appealing and cute
- The carrot-rabbit connection is instantly recognizable
- Rich theme potential: warrens, burrows, breeding, different breeds

## Project Status

This project is in the planning and initial development phase. The documentation in this repository provides a complete blueprint for building Rabbit Clicker from the ground up.

## Documentation Structure

This repository contains comprehensive documentation organized into focused guides:

- **README.md** (this file) - Project overview and getting started
- **GAME_DESIGN.md** - Complete game design document with mechanics, systems, and content
- **TECHNICAL_ARCHITECTURE.md** - Technical stack, architecture decisions, and implementation details
- **DEVELOPMENT_ROADMAP.md** - Phased development plan from MVP to full release
- **FILE_STRUCTURE.md** - Recommended project organization and file structure

## Quick Start for Developers

1. Read through the game design document to understand the vision
2. Review the technical architecture to understand the stack and why it was chosen
3. Follow the development roadmap to build features in priority order
4. Refer to the file structure guide when creating new components

## Project Structure

The codebase follows a feature-based organization with clear separation of concerns:

```
/src
├── /components          # React UI components
│   ├── /clicker        # Clicking mechanics UI
│   ├── /rabbits        # Rabbit collection & team management
│   ├── /shop           # Shop and upgrade components
│   ├── /crates         # Crate opening system
│   ├── /ui             # Reusable UI components
│   ├── /prestige       # Prestige system UI
│   └── /achievements   # Achievement tracking UI
├── /stores             # Zustand state management
├── /game               # Framework-agnostic game logic
│   ├── /mechanics      # Core game mechanics
│   ├── /systems        # Game systems (crates, gacha)
│   ├── /balancing      # Cost formulas and scaling
│   └── /data           # Game content definitions
├── /utils              # Utility functions
├── /hooks              # Custom React hooks
├── /services           # External services & APIs
├── /types              # TypeScript type definitions
└── /styles             # Global styles

/public/assets
├── /images             # Game images and icons
│   ├── /rabbits       # Rabbit character art
│   ├── /icons         # UI icons
│   └── /backgrounds   # Warren backgrounds
└── /sounds             # Sound effects and music
```

See [FILE_STRUCTURE.md](FILE_STRUCTURE.md) for detailed documentation on the project organization.

## Key Design Decisions

**Premium Currency**: Golden Carrots (chosen for thematic consistency and immediate recognition)

**Tech Stack**: React + TypeScript + Zustand (chosen for component reusability, type safety, and efficient state management for idle games)

**Target Platforms**: Desktop and mobile web browsers (responsive design)

**Monetization Philosophy**: Free-to-play with optional premium currency purchases; game is fully enjoyable without spending

## Who This Documentation Is For

- **Developers**: Complete technical specifications and implementation guidance
- **Designers**: Game mechanics, balance, and content specifications
- **Project Managers**: Roadmap, milestones, and scope definition
- **Stakeholders**: High-level overview of the project vision and goals

## Getting Started with Development

The development roadmap recommends starting with Phase 1 (MVP):
1. Basic clicking mechanic and carrot counter
2. Simple upgrade shop with manual purchases
3. Basic save/load system
4. Core responsive UI

This gets a playable prototype running quickly, which can be tested and iterated on before adding complex systems.

## Contributing

This is a single-developer project currently in planning. As development progresses, contribution guidelines will be added if the project opens to collaborators.

## Reviewers

![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/nathan71370/rabbit-clicker?utm_source=oss&utm_medium=github&utm_campaign=nathan71370%2Frabbit-clicker&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

## Donation

[![BuyMeACoffee](https://raw.githubusercontent.com/pachadotdev/buymeacoffee-badges/main/bmc-yellow.svg)](https://www.buymeacoffee.com/AzRoDoRzA)

## License

[To be determined]

---

**Next Steps**: Start by reading the [Game Design Document](GAME_DESIGN.md) to understand what makes Rabbit Clicker tick, then dive into the [Technical Architecture](TECHNICAL_ARCHITECTURE.md) to see how it all comes together.
