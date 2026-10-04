# DevSphere - Brag Plan

## Project analysis (source: project code)
- Name: DevSphere
- Description: Multi-tenant developer collaboration platform (React + Express + MongoDB). Organizations own repos/architectures, RBAC, billing/subscriptions, platform admin surface.
- Stack: Frontend React 19 + Vite + Tailwind + shadcn/Base UI, Zustand, TanStack Query (wired). Backend Express 5 + TypeScript + Mongoose + MongoDB Atlas. Dockerized.
- Key flows: Auth (email/OAuth), orgs/memberships/RBAC, GitHub-connected repos (browse tree/branches/contents), Excalidraw architectures, dashboard overview, platform admin (stats/orgs/users), billing.
- Visual identity: Geist font, dark/light theme, Tailwind/DaisyUI styles present; professional app UI (sidebar, cards, tables).

## Angle / hook / punchline
- Angle: "Ship collaboration that’s actually organized per org" — show real product doing real work
- Hook (2–3s): DevSphere — multi-tenant developer collaboration
- Highlights: 1) Connect GitHub repos & browse tree (real code browsing), 2) Excalidraw architecture diagrams per org, 3) RBAC + org-scoped workspaces with billing
- Punchline (2–4s): "Build together. Stay organized by workspace." or "DevSphere — collaboration that scales by organization"

## Tone
- polished (clean, restrained, readable). Professional launch video.

## Format/duration
- landscape 1920×1080, 30fps, ~20s total

## Scene storyboard
| Scene | Time | Visual | Action/motion | Text on screen | Audio/SFX |
|---|---|---|---|---|---|
| 1. Hook | 0:00–0:03 | Dashboard landing in dark theme, sidebar + header visible | Fade in, subtle zoom in on cards (dashboard stats) | "DevSphere" (hero) fades in | Crisp intro hit, subtle ambient whoosh |
| 2. Reveal | 0:03–0:06 | Repos list → click/connect flow | Cut to Repositories, items animate in, show connected repo cards | "Connect GitHub repos" | Soft UI click, smooth transition |
| 3. Highlight 1 | 0:06–0:10 | Repo detail/tree browsing | Navigate into repo, file tree expands, code view appears (real UI) | "Browse files & branches" | Subtler whoosh, typing-like motion |
| 4. Highlight 2 | 0:10–0:13 | Architecture (Excalidraw) | Switch to Architecture, canvas fades in, diagram draws/zooms | "Design architectures in Excalidraw" | Clean swoop, pencil/glow |
| 5. Highlight 3 | 0:13–0:16 | Org members/RBAC + billing/settings | Show members list with roles, switch org, settings/billing | "RBAC, orgs & billing" | Smooth slide, subtle click |
| 6. Outro/Punchline | 0:16–0:20 | Dashboard back, logo + CTA | Zoom out to clean dashboard, text fades in | "DevSphere — build together, by workspace" | Music resolves, gentle fade out |

## Visual identity
- Font: Geist (matches app). Use exact weights.
- Colors: follow app (dark bg #0f0f0f, accent blue-ish per theme, cards). Pull from actual CSS.
- Real UI: reuse app screens/components (sidebar, cards, buttons, tables) — don’t rebuild. Prefer working product look.
