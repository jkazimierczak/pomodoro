# Pomodoro

A classic pomodoro timer app - retain fresh mind when working on focus-intensive tasks.

The pomodoro technique is simple, yet effective. Set the timer and work without interruption on your task. After the timer rings - take a short break. Repeat until you get the job done.

Available live: https://jkazimierczak.github.io/pomodoro/.

## Features

- Customizable durations and daily goal,
- Night owl mode - don’t lose your progress when working to late hours (after the midnight),
- Dark/light mode.

## The motivation

The pomodoro app was my first ever own-built project. While the original version was written in pure JS, it became unmaintainable and hard to work on.

With all the knowledge I gained through the years, I rewritten it using React, TypeScript and used Redux Toolkit for state management. I also learnt about listener middleware in RTK, which made managing related-information in the state much easier. I also incorporated experimental Temporal API for operating on dates.

## How to run

If you want to run this projects on your machine, then:

1. Have node.js and npm installed.
2. Clone this repository / download the archive and unpack.
3. Install dependencies with `npm i`.
4. Run the development server `npm run dev`.

> The app is also available live on GitHub Pages.
>

## Tech stack

### Languages & Dependencies

- React.js + TypeScript
- React Hook Form + Zod
- Tailwind CSS
- Redux Toolkit
- Temporal API ([experiental modern date/time API](https://tc39.es/proposal-temporal/docs/))
- tsparticles (for confetti)

### Tooling

- Prettier
- Vite
- pnpm
