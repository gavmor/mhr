# Marvel Heroic Roleplaying Data File

A modern, interactive, web-based character sheet for Marvel Heroic Roleplaying (MHR) and Cortex Plus systems. Built with React, TypeScript, Vite, and TailwindCSS.

## Features

- **Interactive UI**: Clickable dice icons that cycle through step dice (d4, d6, d8, d10, d12).
- **Stress & Trauma Tracking**: Visual step-dice representation for Physical, Mental, and Emotional stress.
- **Dynamic Data Management**: Add, update, and remove Power Sets, SFX, Specialties, and Milestones on the fly.
- **Portrait Upload**: Upload a character portrait directly from your local machine.
- **JSON Import / Export**: Save your character sheet as a JSON file or paste a JSON object to instantly load a character (including the portrait via Base64).
- **Print-Ready**: Optimized layout for printing or saving directly to PDF.

## Tech Stack

- **React 19**
- **TypeScript**
- **Vite**
- **TailwindCSS (v4)**

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (or npm/yarn)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd mhr
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm run dev
   ```

4. Build for production:
   ```bash
   pnpm run build
   ```

## Usage

- Click any die icon (e.g., Affiliations, Powers, Specialties) to cycle its value (d4 → d6 → d8 → d10 → d12).
- Click on the stress track boxes to increment or decrement stress levels.
- Edit text fields inline. Multi-line textareas (like SFX descriptions and Milestones) automatically resize to fit content.
- Use the **Import/Export JSON** button at the bottom to backup your data or load an existing character.

## License

MIT License
