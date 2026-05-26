# CLAUDE.md — Thiago Sardenberg's Portfolio Website

This file gives AI assistants full context for building and maintaining Thiago's personal portfolio site. Read it entirely before making any changes.

---

## Project Purpose

Personal portfolio website for **Thiago Sardenberg**, a Computer Science & Engineering student at UC Irvine (B.E., graduating May 2027). The site is built to support **job and internship applications** — it must feel polished, technical, and memorable to recruiters and engineers alike.

The site showcases:
- Robotics projects with **real video footage** shot on an iPhone
- App project **screenshots and demos**
- Resume, skills, and contact info

Hosted on **Vercel**. Built with **Next.js (App Router) + Tailwind CSS**.

---

## Owner / Author

| Field | Value |
|---|---|
| Name | Thiago Sardenberg |
| Email | thiago.limasardenberg@gmail.com |
| LinkedIn | linkedin.com/in/thiagosardenberg1 |
| GitHub | github.com/Thiaguinho06 |
| Phone | 425-553-8171 |
| University | University of California, Irvine |
| Degree | B.E. in Computer Science and Engineering |
| Graduation | May 2027 |
| Languages | English, Portuguese |

---

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14+ (App Router) | SSG/SSR, great Vercel perf |
| Styling | Tailwind CSS | Utility-first, fast iteration |
| Animations | Framer Motion | Page transitions, scroll reveals |
| Video | Native `<video>` + Vercel Blob | Self-hosted phone videos |
| Images | `next/image` | Auto-optimization, lazy load |
| Deployment | Vercel | Zero-config, auto HTTPS |
| Font | Custom (see Design section) | Avoid Inter/Roboto/system defaults |

---

## Folder Structure

```
/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Hero / landing
│   ├── projects/
│   │   └── page.tsx        # Project gallery
│   └── contact/
│       └── page.tsx        # Contact form or links
├── components/
│   ├── Nav.tsx
│   ├── Hero.tsx
│   ├── ProjectCard.tsx
│   ├── VideoPlayer.tsx     # Custom video component for robotics footage
│   ├── SkillsGrid.tsx
│   └── Footer.tsx
├── public/
│   ├── videos/             # Robotics videos from phone (.mp4, compressed)
│   │   ├── rover-demo.mp4
│   │   ├── spider-locomotion.mp4
│   │   └── [add more here]
│   ├── images/
│   │   ├── projects/       # App screenshots
│   │   │   ├── sapling/
│   │   │   ├── fashion-detection/
│   │   │   ├── trip-planner/
│   │   │   └── rover/
│   │   └── headshot.jpg
├── lib/
│   └── projects.ts         # Project data (single source of truth)
├── CLAUDE.md               # This file
├── next.config.ts
├── tailwind.config.ts
└── vercel.json
```

---

## Content: Projects

All project data lives in `lib/projects.ts`. Each project has this shape:

```ts
type Project = {
  id: string;
  title: string;
  subtitle: string;          // one-line hook for recruiters
  tags: string[];            // tech stack tags
  description: string;       // 2–3 sentence summary
  highlights: string[];      // bullet points from resume
  media: ProjectMedia[];     // images and/or videos
  links: {
    github?: string;
    live?: string;
    appStore?: string;
    devpost?: string;
    article?: string;        // e.g. GeekWire feature
  };
  category: "robotics" | "app" | "web" | "ai" | "hackathon";
  featured: boolean;
  date: string;              // e.g. "Feb 2026 – Present"
};

type ProjectMedia = {
  type: "image" | "video";
  src: string;               // path under /public/
  alt?: string;
  thumbnail?: string;        // for videos: poster frame
  caption?: string;
};
```

### Project Entries

Populate `lib/projects.ts` with the following (add real media paths as files are added):

**1. Autonomous Rover** *(robotics, featured)*
- Tags: `Arduino`, `C++`, `PixyCam`, `CAD`
- Highlights: CAD-designed full chassis and custom claw; soldered all electronics; wrote line-following (IR sensors) and color-signature object detection (PixyCam) firmware from scratch; placed **13th out of 50 teams**
- Media: video of rover completing the course, photos of chassis/claw build
- Category: `robotics`

**2. Robotic Spider — Zotbotics** *(robotics, featured)*
- Tags: `Arduino`, `CAD`, `Servos`, `C++`
- Highlights: CAD-modeled all structural components; programming locomotion using Arduino, servos, and sensors; ongoing Zotbotics club project
- Media: video clips of spider locomotion tests shot on phone
- Category: `robotics`

**3. Sapling — Eco iOS App** *(app, featured)*
- Tags: `React Native`, `TypeScript`, `Firebase`, `React`
- Highlights: Published on the App Store; fundraiser raised **$1,200 → 1,200 trees planted**; featured in **GeekWire**; promoted via TikTok
- Media: App Store screenshots, website screenshot
- Links: App Store link, GeekWire article, live website
- Category: `app`

**4. Fashion Detection Web App** *(ai + web)*
- Tags: `Python`, `YOLOv8`, `Express`, `PostgreSQL`, `React`
- Highlights: YOLOv8 detects clothing items in images; crops garments and queries for shoppable product links; REST API backend
- Media: screenshots of detection results, UI
- Category: `ai`

**5. AI Trip Planner — IrvineHacks** *(hackathon, featured)*
- Tags: `Flutter`, `Dart`, `Firebase`, `Claude API`
- Highlights: Built in ~50 hours at IrvineHacks; Claude API generates personalized itineraries by mood; users curate activities; social features (friend invites, group trips, photo albums)
- Category: `hackathon`

---

## Media Handling

### Robotics Videos (Phone Footage)
- Store videos in `/public/videos/` as `.mp4`, compressed with HandBrake or `ffmpeg` before committing (target < 15 MB per video)
- Use a custom `<VideoPlayer>` component with:
  - Native HTML5 `<video>` tag (not YouTube embed)
  - `poster` attribute pointing to a thumbnail screenshot
  - `controls`, `playsInline`, `muted` (autoplay on hover, full controls on click)
  - Fallback text for unsupported browsers
- For Vercel deployments with large files, use **Vercel Blob** storage and reference blob URLs

```tsx
// components/VideoPlayer.tsx
<video
  src={src}
  poster={thumbnail}
  controls
  playsInline
  muted
  loop
  className="w-full rounded-xl"
>
  Your browser does not support video playback.
</video>
```

### App Screenshots
- Store under `/public/images/projects/{project-id}/`
- Name files descriptively: `sapling-home-screen.png`, `sapling-fundraiser-page.png`
- Use `next/image` for automatic optimization:

```tsx
import Image from "next/image";
<Image src="/images/projects/sapling/home.png" alt="Sapling home screen" width={390} height={844} />
```
- For mobile screenshots: use a phone mockup frame (see design notes below)

---

## Design Direction

**Aesthetic**: Clean, technical, and confident — the work of an engineer who also cares about craft. Think editorial meets engineering notebook. **Not** a cookie-cutter developer portfolio.

**Rules**:
- Dark background (#0d0d0d or very dark navy) with high-contrast text
- Accent color: a single saturated color (electric blue `#2563eb` or acid green `#84cc16` — pick one, commit to it)
- **Typography**: Pair a geometric display font (e.g. `Space Mono`, `JetBrains Mono`, or `Syne`) with a clean sans-serif for body text (e.g. `DM Sans`, `Geist`)
- Subtle grain texture on the hero background
- Cards with a thin border, slight glow on hover
- Smooth scroll-triggered fade-ins via Framer Motion
- NO purple gradients. NO generic card-on-white layouts.

**Phone mockup frames**: Wrap mobile app screenshots in an SVG/CSS phone frame to give them context and visual weight.

**Sections (in order)**:
1. **Hero** — Name, one-line tagline, animated headline, CTA buttons (View Projects, GitHub, Resume PDF)
2. **Projects** — Filterable grid by category (All / Robotics / Apps / AI / Hackathon)
3. **Skills** — Clean grid of logos/badges, grouped by Language / Framework / Tools
4. **About** — Short bio, university, photo, bilingual (English/Portuguese) note, link to resume
5. **Contact** — Email link, LinkedIn, GitHub (no form needed unless desired)

---

## Skills Reference

Copy this data into a `lib/skills.ts` constant:

```ts
export const skills = {
  languages:  ["JavaScript", "TypeScript", "Python", "Java", "C++", "Dart", "SQL", "HTML", "CSS"],
  frameworks: ["React.js", "React Native", "Flutter", "Node.js", "Express.js", "Tailwind CSS"],
  tools:      ["Git", "GitHub", "Firebase", "PostgreSQL", "Arduino", "PixyCam", "CAD"],
  languages_spoken: ["English", "Portuguese"],
};
```

---

## Resume PDF

- Place the resume at `/public/resume-thiago-sardenberg.pdf`
- Link it in the Hero and About sections as a direct download:
  ```html
  <a href="/resume-thiago-sardenberg.pdf" download>Download Resume</a>
  ```
- Keep resume updated in sync with `lib/projects.ts`

---

## SEO & Metadata

In `app/layout.tsx`, set:

```ts
export const metadata = {
  title: "Thiago Sardenberg — CS Engineer & Builder",
  description:
    "CS & Engineering student at UC Irvine. I build robotics, mobile apps, and AI tools. Available for internships.",
  openGraph: {
    title: "Thiago Sardenberg",
    description: "CS & Engineering student at UC Irvine.",
    url: "https://thiagosardenberg.com",   // update with real domain
    siteName: "Thiago Sardenberg",
    images: [{ url: "/og-image.png" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thiago Sardenberg",
    description: "CS & Engineering student at UC Irvine.",
    images: ["/og-image.png"],
  },
};
```

---

## Vercel Deployment

- **Framework Preset**: Next.js (auto-detected)
- **Build Command**: `next build`
- **Output Directory**: `.next`
- **Environment Variables**: none required for base site
- For Vercel Blob (large videos): add `BLOB_READ_WRITE_TOKEN` in Vercel project settings
- Custom domain: set in Vercel Dashboard → Domains

### `vercel.json`

```json
{
  "headers": [
    {
      "source": "/videos/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

---

## Important Conventions

- **Never hardcode content** — all project data, skills, and links must live in `lib/` files so updates are centralized
- **Mobile-first** — most recruiters will view the link on their phone; test at 375px width
- **Accessibility** — all images need `alt` text; videos need captions or transcripts if possible; sufficient color contrast
- **Performance** — compress all videos before committing; use `next/image` for all images; aim for Lighthouse score > 90
- **Language** — all copy is in English; do not add Portuguese UI unless explicitly requested
- **No placeholder content** — if media is missing, show a clean placeholder card, never lorem ipsum

---

## What NOT to Do

- Do not use `create-react-app`, Gatsby, or plain HTML — stick to Next.js App Router
- Do not embed YouTube or Vimeo for the robotics videos — host them directly for privacy and control
- Do not use generic portfolio templates (Astro Cactus theme, etc.)
- Do not use Inter or Roboto as the primary display font
- Do not add cookie banners, analytics scripts, or third-party trackers without asking
- Do not commit uncompressed phone videos to the repo (> 50 MB)

---

## Adding New Projects

1. Add media files to `/public/images/projects/{id}/` or `/public/videos/`
2. Add an entry to `lib/projects.ts` following the `Project` type above
3. Set `featured: true` if it should appear in the hero or top of the grid
4. Run `next build` locally to confirm no errors before pushing to Vercel
