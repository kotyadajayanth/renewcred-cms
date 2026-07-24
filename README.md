RenewCred CMS

What this is
A CMS + public website where all the content on the site comes from the admin panel instead of being hardcoded. Built with Next.js, Express, MongoDB and Redux Toolkit, as suggested in the assignment brief.

Tech stack and why
- Backend: Express, plain JS. Kept it simple since the API surface here is small (auth + content CRUD), didn't feel like it needed a heavier framework like Nest.
- Database: MongoDB. The content in this assignment is not uniform - a "hero" section has different fields than a "pricing table" section. Forcing that into rigid SQL tables would mean either a huge number of nullable columns or a table-per-content-type, and either way I'd be doing a migration every time a new content type shows up. A flexible document store fit the actual shape of the problem better.
- Frontend: Next.js with the pages router (not the app router). Went with pages router mainly because it's simpler to reason about for a project this size, and I wanted getServerSideProps for the public site so it isn't blank until JS loads.
- State: Redux Toolkit, but only for auth (token + user). Content data lives in RTK Query's own cache, not in a hand-written reducer - it already handles caching, refetching and invalidation so duplicating that in a slice would just be extra code doing the same job worse. Everything else (form fields, JSON textarea state, which section is being edited) is local component state because nothing outside that one component needs it.

How content is modeled
Every content "section" on the site (e.g. hero section on the home page) is one document:
  { page, section, title, order, blocks: [...] }

A block looks like { type, data }, where type is one of heading / paragraph / list / table / equation / image, and data is shaped differently per type. This is basically the same idea Notion and Contentful use for rich content. The reason I went this way instead of one big HTML/rich-text field:
- storing raw HTML from an editor is a bigger XSS surface to worry about, and harder to redesign later without touching old content
- a typed block schema means the frontend can pick a specific React component per block type, which also makes it easy to add a new content type later (new block type + one new renderer, nothing else changes)

Trade-off I'm aware of: the admin currently edits blocks as raw JSON in a textarea, with a live preview next to it, instead of a drag-and-drop visual editor. Building a true WYSIWYG block editor is a project on its own - if this were going to production I'd build that next, but for this assignment the JSON + preview approach demonstrates the content model working end to end without me spending the whole time on editor UI.

Auth
JWT-based. Login returns a token, frontend stores it in localStorage and Redux, sends it as a Bearer token on admin requests. Logout just drops the token client-side - there's no session table to invalidate since the token itself is stateless. Documenting this because it's a real trade-off: a stolen token stays valid until it expires. For production I'd add refresh tokens and a revocation list; skipped here to keep the auth flow readable for a fresher-scale assignment.

Project structure
backend/src/
  models      - Mongoose schemas
  controllers - route handler logic
  routes      - Express routers
  middleware  - auth check
  config      - db connection
  seed.js     - creates the admin user + sample content

frontend/src/
  pages/            - Next.js routes (public site + admin)
  pages/admin/       - admin dashboard, login, content editor
  components/blocks/ - one component per content block type
  components/admin/  - admin-only UI (layout, sidebar)
  store/              - Redux store, auth slice, RTK Query API slice

Setup
1. cd backend, cp .env.example .env, npm install
2. Have MongoDB running locally (or update MONGO_URI to point at Atlas)
3. npm run seed   -> creates the admin user and sample content
4. npm run dev    -> backend on port 5000
5. cd ../frontend, cp .env.local.example .env.local, npm install
6. npm run dev    -> frontend on port 3000

Or with Docker: copy the same .env files, then docker-compose up --build from the project root.

Login credentials for evaluation
Email: admin@renewcred.com
Password: admin123
(both come from backend/.env, change them there if needed)

Assumptions I made
- One admin role, no multi-role permission system - brief didn't ask for role differentiation
- Content is grouped by page + section rather than a single flat list, since the Figma shows the site as several distinct sections per page and that mapping felt closest to how a real admin would think about "what am I editing"
- Equations are stored as raw LaTeX strings and rendered with KaTeX on the frontend, since building a math input UI wasn't the focus of the assignment
- No image upload/storage service wired up (would use S3 or Cloudinary in production) - image blocks currently just take a URL

What I'd do next if this were a real production project
- Real block editor instead of JSON textarea
- Refresh tokens + token revocation
- Image upload pipeline
- Content versioning / revision history, since CMS content mistakes are otherwise hard to undo
- Tests around the content API, especially the block schema validation
