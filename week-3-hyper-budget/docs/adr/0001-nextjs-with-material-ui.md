# ADR 0001: Next.js with Material UI for the screens

Status: accepted
Date: 2026-11-07

## Context

Hyper Budget needs a web interface that is accessible, consistent, and calm, and
it needs to be built by someone new to development, quickly. The Week 4
assignment also sets the stack.

## Decision

Build the screens with Next.js (App Router, TypeScript) and Material UI.

## Alternatives considered

- Plain React with a build tool (for example Vite) and no component library. More
  to wire up and style from scratch.
- A different component library or CSS framework. Workable, but Material UI gives
  accessible, consistent components out of the box.

## Consequences

- Good: a mature framework with routing, server rendering, and a large ecosystem;
  Material UI provides accessible, ready-made components that speed up building a
  consistent, ADHD-friendly UI.
- Cost: a learning curve for Material UI's styling, a larger bundle than hand-
  rolled CSS, and a commitment to the React and Next.js way of doing things.
