# Antonio Jeffrey — Cinematic Portfolio Website

An award-quality, cinematic scrolling portfolio website for **Antonio Jeffrey**, a multidisciplinary creative technologist. The project is designed with minimal, premium aesthetics inspired by Apple, Stripe, Linear, Vercel, Framer, and Awwwards.

## Core Features
1. **Typographic Hero & Rotator**: Sleek large-type landing layout with modular rotating roles revealing character-by-character.
2. **Smooth Inertial Scrolling**: Powered by **Lenis** smooth scroll for silky motion curves on all desktop systems.
3. **Horizontal Project Showcase**: High-performance GSAP ScrollTrigger timeline pins the screen and slides horizontally through major project showcases.
4. **Interactive Skill Cards**: Dynamic CSS grid borders that track mouse coordinates (`--mx`, `--my`) to project light gradients underneath the cursor.
5. **Drawing Chronology SVG**: A custom-drawn vector track in the timeline section which fills its glowing gradient mask as the user scrolls.
6. **Ambient Atmospheric Background**: Repeating grid matrices, SVG fractals film grain noise overlays, and floating glowing blobs drifting in parallax paths.

---

## Technical Stack & Libraries
- **Language**: HTML5, CSS3, Vanilla ES6+ Javascript
- **Smooth Scrolling**: [Lenis](https://github.com/darkroomengineering/lenis)
- **Animations Core**: [GSAP (GreenSock Animation Platform)](https://gsap.com/)
- **Scroll Triggers**: [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- **Aesthetics**: Glassmorphism, CSS Custom Variables, GPU-bound Translate Animations

---

## File Architecture
```text
/
├── index.html                  # Semantic structural nodes, SEO header meta-tags, CDN loaders
├── css/
│   └── style.css               # Design tokens, global resets, animation states, layout columns
├── js/
│   ├── main.js                 # Local timezone clocks, hover glows, magnetic buttons, typed roles
│   └── animations.js           # ScrollTrigger timelines, horizontal panels, SVG drawing
├── assets/
│   ├── images/                 # Project cover graphics (High-res abstract generated assets)
│   └── icons/                  # SVG assets
└── README.md                   # Setup details and system overview
```

---

## Local Development Execution
1. Double-click `index.html` to run in a web browser directly, or spin up a local HTTP server for full performance profiling (e.g. VS Code Live Server, python http.server, etc.):
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx serve
   ```
2. Navigate to `http://localhost:8000` (or the active local server port).
