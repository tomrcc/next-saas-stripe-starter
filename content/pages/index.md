---
_schema: page_builder
title: SaaS Starter — the modular Next.js SaaS starter
description: Open-source SaaS starter built with Next.js 16, Better Auth, Drizzle, Neon and Stripe.
content_blocks:
  - _type: hero
    title_lines:
      - One starter.
      - Any project.
    subtitle_lines:
      - A modular Next.js foundation.
      - Begin with a blog, end up with a SaaS.
    secondary_button:
      label: About Pro
      href: https://github.com/mickasmt/next-saas-stripe-starter#pro-version
  - _type: stack-marquee
    caption_lines:
      - Built on a modern,
      - production-ready stack
  - _type: modules-showcase
    eyebrow_icon: layout-grid
    eyebrow: Modular by design
    title: Flip a switch, reshape the app
    description: Turn a module off, and its routes and links go with it.
    features:
      - title: Delete a module for good, in one command
        description: >-
          Not shipping a blog? `pnpm modules:prune` deletes the module's files,
          the lines marked for it in shared code, its flag and its packages. It
          prints a dry run first and only applies on a clean git tree.
        visual: prune_terminal
        href: /docs/modules
        link_label: Learn more
      - title: Dependencies resolved, never broken
        description: >-
          Modules declare what they build on. Turn Auth off and Billing and
          Admin pause with it; turn Billing back on and Auth comes along. The
          panel tells you before it happens.
        visual: dependency_graph
        href: /docs/modules
        link_label: Learn more
      - title: One flag per module, in one file
        description: >-
          The panel only changes your browser. Once a setup feels right,
          `Copy config` gives you the defaults to set in `config/features.ts`.
          Nothing to add to your environment.
        visual: config_file
        href: /docs/modules
        link_label: Learn more
      - title: Services checked before anything breaks
        description: >-
          A module that needs Stripe stays off until its keys are set, and the
          panel lists the exact variables missing. No database yet? Turn Auth
          off and the app runs without one.
        visual: services_check
        href:
        link_label: Learn more
    facts:
      - icon: scale
        title: Open source, MIT
        description: Read every line, fork it, ship it commercially. No license key, no lock-in.
      - icon: braces
        title: Plain Next.js
        description: A module is a folder, a flag and a few markers. No plugin system to learn.
      - icon: bot
        title: Ready for AI agents
        description: AGENTS.md teaches coding agents the module conventions, so what they write stays prunable.
      - icon: zap
        title: Nothing extra in production
        description: The panel only renders in development. Production reads config/features.ts and that's it.
  - _type: why-modular
    title: Take what you need. Nothing else.
    description: A starter should fit your product, not the other way around.
    approaches:
      - title: All-in-one kits
        points:
          - Every feature is wired into your app from day one
          - Removing one means tracing its files and imports by hand
          - Code you never use still ships and still needs upkeep
        highlighted: false
      - title: This starter
        points:
          - Switch a module off from the dev panel in one click
          - Bring it back anytime, nothing is lost
          - Delete it for good with one command, tested in CI
        highlighted: true
  - _type: closing-cta
    title: Ship the product, not the plumbing
    description: Start from the free, modular starter today. Add Pro when you want onboarding, emails and team billing done for you.
    secondary_button:
      label: About Pro
      href: https://github.com/mickasmt/next-saas-stripe-starter#pro-version
---
