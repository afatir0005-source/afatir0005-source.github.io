# Abdul Fatir · Portfolio

Two-page portfolio. Plain HTML, CSS and JavaScript. No build step, no framework.

```
Portfolio/
├── index.html        home: name + date + role, About + gym questionnaire, Work experience tabs
│                     (short text + a looping ring of cards), Internships, message CTA, toolbelt,
│                     certificates, off-duty, contact, Selected work cards, Thank you
├── project.html      project detail page (project.html?id=<project id>)
├── css/style.css     look and feel; colour/font tokens at the top; dark (default) + light modes
├── js/config.js      your email, LinkedIn, contact-form endpoint, asset paths
├── js/data.js        ALL content: about, gym Q&A, experience tabs + cards, projects, toolbelt, certs, hobbies
├── js/shared.js      mode toggle, menu, custom cursor, page wipe, illustration generator
├── js/main.js        home page behaviour (decks, slider, road + car, flip clock, form)
├── js/project.js     project page behaviour
├── assets/           optional: resume.pdf, profile.jpg, projects/<id>/*.jpg
├── serve.bat         double-click to run it locally
└── archive/          earlier versions (v1 dark timeline, v2 road)
```

## Run it locally

Double-click `serve.bat`, or:

```
cd Portfolio
python -m http.server 8080
```

Then open http://localhost:8080. On your phone (same Wi-Fi) use your PC's IPv4 address
from `ipconfig`: `http://<that-ip>:8080`.

Handy URL flags while testing: `?nl` skips the preloader; `?at=40` parks the car 40% down the road.

## Edit content

Everything is in `js/data.js`.

- **Hero**: `role`, `company`, `city`, `builds` (the rotating "I build …" words). The date and flip clock are live.
- **About**: `about.lead` (reveals word by word on scroll) and `about.paras`.
- **Gym questionnaire**: `gym.items`, three `{ q, a }` pairs. **Update the PR answer with your real numbers.**
- **Work experience tabs**: `experience[]`, first entry = latest tab. Each has `what`, `solves`,
  `skills` and `groups` (one ring of cards per group; NUST has "Academic projects" and
  "Societies & events"). A card with `project: "<id>"` opens that project page; a card with `kind`
  instead is an activity (seminar, responsibility, co-curricular).
- **Internships**: `internships[]`, the smaller section after the tabs (Hexler Tech, Fauji Cement).
- **Projects**: `projects[]`. `featured: true` puts it in the "Selected work" cards at the end of the
  page; every project gets a detail page. `art` picks the generated illustration style:
  `window | graph | camera | chip | pipeline`.

### Add an Upwork project

```js
{
  id: "packaging-defects", featured: true, art: "camera",
  title: "Defect detection on a packaging line",
  tag: "Upwork client · 2026", domain: "cv", org: "Freelance client", period: "Feb – Mar 2026", year: "2026",
  summary: "One-line pitch.",
  problem: "What the client was stuck on.",
  approach: "What you built and how.",
  outcome: "What changed, with numbers if you have them.",
  pipeline: ["Line camera", "YOLOv8", "Defect class", "PLC signal"],
  bullets: ["Detail one", "Detail two"],
  stack: ["YOLOv8", "OpenCV", "Jetson Nano"],
  images: ["assets/projects/packaging-defects/1.jpg"],
  confidential: true
}
```

Then add a card to the `upwork` entry's group in `experience`:

```js
{ title: "Defect detection on a packaging line", sub: "Client project", project: "packaging-defects" }
```

### Screens

Drop screenshots into `assets/projects/<id>/` and list them in `images`. Until a project has images,
its page shows the generated diagram plus two console mock-ups, so nothing looks empty.

## Make the contact form deliver to your inbox

A static site cannot send email on its own, so the form uses one of two paths:

1. **Formspree (recommended, free).** Create a form at https://formspree.io pointing at
   `afatir0005@gmail.com`, confirm the verification email, then in `js/config.js`:

   ```js
   formEndpoint: "https://formspree.io/f/xxxxxxxx",
   ```

2. **No endpoint set.** The form opens the visitor's own mail app with the note pre-filled.

## Optional assets

- `assets/resume.pdf` → a "Resume (PDF)" button appears in the hero (when served over http).
- `assets/profile.jpg` → replaces the "AF" monogram in the polaroid.
- Certification links: paste URLs into `certifications[].link`.

## Hosting (free)

- **GitHub Pages:** push this folder to a repo, Settings → Pages → deploy from `main` root.
- **Netlify / Vercel:** drag and drop the folder.
