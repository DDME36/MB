# MIGHTYBIT — Beyond Sanity

A high-performance, interactive cinematic web portal and link hub for **MIGHTYBIT**. Built with Astro 7, React 19, Vanilla CSS, and Web Audio API.

![MIGHTYBIT Preview](/assets/mightybit-main.png)

## ⚡ Tech Stack

- **Framework**: [Astro 7](https://astro.build/)
- **UI Component Library**: [React 19](https://react.dev/) via `@astrojs/react`
- **Styling**: Vanilla CSS (Custom Design System, Pinned Morph Transitions, Responsive Grid & Flexbox, Ambient Glow & Micro-animations)
- **Audio Engine**: Web Audio API ambient synthesizer & Sound FX
- **Language & Tooling**: JavaScript (ES Next) & TypeScript (`astro check`)

---

## 🚀 Getting Started

### Prerequisites

- Node.js `^20.19.0` or `>=22.12.0`
- npm `^10.0.0`

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/MB-main.git
cd MB-main
npm install
```

### Development Server

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser to view the site.

---

## 🛠️ Scripts & Tooling

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start local development server with HMR |
| `npm run build` | Build production static output bundle in `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run check` | Run Astro & TypeScript type check |

---

## 📁 Directory Structure

```text
MB-main/
├── public/
│   ├── assets/
│   │   ├── Sound.mp3                       # Web Audio ambient soundtrack
│   │   ├── mightybit-crimson-mark.png      # Brand avatar logo mark
│   │   ├── mightybit-main.png              # Hero & Main key visual
│   │   ├── mightybit-world.png             # Chapter background scene
│   │   └── mightybit-chaos-illustrated.png # Chapter 01 portrait illustration
│   └── favicon.svg                         # Favicon
├── src/
│   ├── components/
│   │   └── App.jsx                         # Main interactive application & audio engine
│   ├── pages/
│   │   └── index.astro                     # Root page layout, fonts & SEO meta tags
│   └── style.css                           # Core design system & cinematic styles
├── astro.config.mjs                        # Astro configuration
├── package.json                            # Dependencies & scripts
└── tsconfig.json                           # TypeScript configuration
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
