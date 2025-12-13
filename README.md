# Final Group Project — Stream Finder (Frontend demo)

Short description
This repository contains the Final Group Project created by Camille Marquez and Jordan Stahl. The primary deliverable included here is a static front-end demo located in the stream_finder folder: a browser-based UI (HTML/CSS/JS) that demonstrates the visual design and client-side interactions for the project.

Project status
- Current status: Front-end demo available (static)
- Last updated: 2025-12-13

Overview
The stream_finder folder is a self-contained, static front-end demonstration. It includes an HTML page (index.html), styling (style.css), and client-side behavior (script.js). A large background video (background.mp4) is used by the UI for visual polish. This demo can be used as a starting point to integrate a backend, a database, or additional features.

What’s included
- stream_finder/index.html — Main demo page (open in a browser)
- stream_finder/style.css — Styles for the demo
- stream_finder/script.js — Client-side JavaScript for interactive behavior
- stream_finder/background.mp4 — Background video asset used by the demo
- README.md — This file

Tech stack
- Frontend: plain HTML, CSS, JavaScript (vanilla)
- No backend is included in this repository (static demo only)

Demo / Screenshots
- To run the demo locally, see the "Running the demo" section below.
- The background video used by the demo is located at stream_finder/background.mp4.

Running the demo (local)
Option 1 — Open directly (quick, but some browsers restrict local file access for video/scripts)
1. In your file manager or terminal, open stream_finder/index.html with your browser.

Option 2 — Serve over a simple local HTTP server (recommended)
1. From the repository root, run a lightweight static server. Example using Python:
   - Python 3: python3 -m http.server 8000
2. In your browser, open:
   - http://localhost:8000/stream_finder/index.html

This method avoids local file access restrictions and is closer to how the app will behave when hosted.

Configuration
- This is a static front-end demo; no environment variables are required.
- If you later add an API/backend, follow the usual pattern of adding a .env (or updating script endpoints).

Folder structure (relevant)
- /stream_finder
  - index.html
  - style.css
  - script.js
  - background.mp4
- /docs (not present — create if you add screenshots or design notes)
- README.md

Deployment
- The static demo can be deployed to any static hosting service:
  - GitHub Pages: enable Pages for the repository and point it at main branch (then visit /stream_finder/index.html)
  - Netlify / Vercel: deploy the repository and set the publish directory (or use rewrite rules to point to /stream_finder)
- If you add a backend later, update this README with deployment steps for the server (Heroku, DigitalOcean, etc.)

Contributing
We welcome improvements and fixes.
1. Fork the repository.
2. Create a feature branch: git checkout -b feature/your-feature
3. Commit your changes: git commit -m "Add description of changes"
4. Push to your fork and open a Pull Request.
Please include a short description of how to test your changes. If you add dependencies or build steps, update this README with that information.

Tests
- Currently there are no automated tests in this repo. If tests are added, provide instructions here for running them (e.g., npm test).

License
- Add a LICENSE file to this repository to declare a license (e.g., MIT, Apache-2.0). Until then, please assume the code is under standard academic/course use only.

Acknowledgements
- Project collaborators: Camille Marquez and Jordan Stahl
- Any third-party libraries, assets, or tutorials used should be listed here when applicable.

Contact
- Camille Marquez — cm27708@usc.edu — https://github.com/cimarq97
- Jordan Stahl — jsstahl@usc.edu

To-do / Next steps
- Add a short functional description of what the demo is intended to do (e.g., find streaming sources, browse content, etc.).
- If this is meant to be a full application, add backend services, API documentation (OpenAPI / Postman collection), and persistence (database).
- Add screenshots and/or GIFs in /docs or /assets and reference them here.
- Add a LICENSE file and CI (GitHub Actions) for automated checks.

Thank you for reviewing this project. Update this README with more concrete details about features, endpoints, and deployment as the project evolves.
