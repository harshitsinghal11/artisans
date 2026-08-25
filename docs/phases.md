# Phases.md — AI-Driven Market Linkage App (SIH PS 26090)

> Build order for a judge-ready, working, clickable PWA prototype.
> Rule: do not move to the next phase until the verification checklist for the current phase passes. Each phase ends with a "Verify before moving on" gate — this exists specifically to stop you from stacking half-working features on top of each other under time pressure.

---

## Phase 0: Technical Setup & Environment

**Goal:** every tool, key, and folder exists and talks to every other tool, before a single feature screen is built.

### 0.1 Initialize the project
- Create Next.js app (App Router, TypeScript) — `create-next-app`
- Initialize git repo, first commit
- Deploy an empty "hello world" version to Vercel immediately (don't wait until the end — you want the deployment pipeline proven working on day one)

### 0.2 Install core packages
- `tailwindcss` (styling)
- `zod` (schema validation for forms + AI response parsing)
- `lucide-react` (icons)
- `@supabase/supabase-js` (auth, DB, storage client)
- `next-pwa` or `@serwist/next` (PWA: manifest + service worker)
- Any SDK needed for your chosen AI providers (e.g. `openai` for Whisper, `@anthropic-ai/sdk` for the LLM step, or plain `fetch` if the API doesn't need an SDK)

### 0.3 Set up external services
- Create Supabase project → note project URL + anon key
- Create Supabase Storage bucket (e.g. `product-images`, `product-audio`)
- Create Supabase Postgres tables (see Spec Sheet for schema)
- Sign up for background-removal API (e.g. remove.bg) → get API key
- Sign up for speech-to-text API (e.g. Whisper API) → get API key
- Sign up for LLM API (e.g. Anthropic Claude API) → get API key

### 0.4 Environment configuration
- Create `.env.local` with all keys:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server-side only, never exposed to client)
  - `REMOVE_BG_API_KEY`
  - `WHISPER_API_KEY` (or provider-equivalent)
  - `LLM_API_KEY`
- Add `.env.local` to `.gitignore`
- Create `.env.example` with blank placeholders so teammates can set up quickly

### 0.5 Scalable folder structure
```
app/                          → routes/pages (App Router)
  layout.tsx
  page.tsx                    → landing/onboarding
  add-product/page.tsx
  review/[id]/page.tsx
  dashboard/page.tsx
  api/
    process-product/route.ts  → AI orchestration endpoint
    publish/route.ts          → simulated publish endpoint

src/
  components/
    ui/                       → Header, Footer, Button, Input, Card, Loader, Toast etc.
    features/                 → CameraCapture, VoiceRecorder, PriceBreakdown, ListingCard etc.
  lib/
    supabase/
      client.ts               → browser client
      server.ts                → server-side client (service role)
    ai/
      backgroundRemoval.ts
      speechToText.ts
      llm.ts                  → translation + description + pricing reasoning call
    utils.ts                   → shared helpers (formatting, id gen, etc.)
  types/
    product.ts                 → shared TypeScript types/interfaces
  hooks/
    useAuth.ts
    useProducts.ts

public/
  manifest.json
  icons/                       → PWA icons (multiple sizes)
```

### 0.6 PWA baseline
- Add `manifest.json` (name, short_name, icons, theme_color, display: "standalone", start_url)
- Configure service worker via `next-pwa`/`serwist`
- Add app icons (min 192x192 and 512x512)
- Confirm HTTPS is active (Vercel gives this by default)

### 0.7 Verify before moving on
- [ ] `.env.local` loads correctly in both client and server code
- [ ] Supabase connection test: can insert + read a dummy row from a test table
- [ ] Supabase Storage test: can upload a dummy file and get back a public URL
- [ ] Each AI API key works: fire one manual test call to each (background removal, STT, LLM) and confirm a 200 response
- [ ] PWA installs on an actual phone (Add to Home Screen prompt appears, icon shows correctly)
- [ ] Deployed Vercel URL loads on mobile

**Do not proceed to Phase 1 until every box above is checked.**

---

## Phase 1: Core Data Model & Auth

**Goal:** users can sign in, and there's a real place in the DB for their products to live.

### 1.1 Database schema
- `products` table (see Spec Sheet for exact fields)
- `profiles` table (linked to Supabase Auth user, stores artisan name/language preference)

### 1.2 Auth
- Set up Supabase Auth (simplest viable method — email/password or phone OTP)
- Build login/signup screen (keep it to 2–3 fields max, remember the target user has low digital literacy)
- Session handling via `useAuth` hook

### 1.3 Shared UI components
- Build `src/components/ui/`: Header, Footer, Button, Input, Card, Loader/Spinner, Toast/Notification
- Establish the visual design language here (colors, spacing, font) — everything after this reuses these components, so get them right once

### 1.4 Verify before moving on
- [ ] Can sign up a new user and see the row appear in Supabase Auth + `profiles` table
- [ ] Can log out and log back in, session persists across refresh
- [ ] Protected routes redirect unauthenticated users to login
- [ ] Shared UI components render consistently across at least two screens

---

## Phase 2: Add Product Flow (Capture)

**Goal:** an artisan can take a photo and record a voice note, and both land safely in storage.

### 2.1 Camera capture
- Build `CameraCapture` component using `getUserMedia`
- Allow retake before confirming
- Show a clear "this is what will be enhanced" preview

### 2.2 Voice recording
- Build `VoiceRecorder` component using `MediaRecorder`
- Simple record / stop / playback / re-record controls
- Visual waveform or recording indicator (small polish detail, high visual payoff)

### 2.3 Material cost input
- Simple numeric field: "How much did the raw materials cost?" (with currency symbol, large touch-friendly input)
- This is required — the PS explicitly names raw material cost as a pricing input, and the pricing engine cannot function without it
- Optional: a category selector (dropdown or icon grid) here too, since category feeds both pricing and description generation

### 2.4 Upload
- On confirm, upload image + audio to Supabase Storage
- Create a `products` row with status `processing`, the storage URLs, material_cost, and category

### 2.5 Verify before moving on
- [ ] Photo capture works on an actual mobile browser (not just desktop devtools emulation)
- [ ] Voice recording works and produces a playable audio file
- [ ] Both files appear in Supabase Storage with retrievable public/signed URLs
- [ ] Material cost and category are captured and saved
- [ ] A `products` row is created with status `processing`

---

## Phase 3: AI Orchestration Pipeline (the core engine)

**Goal:** the actual "AI-driven" part — this is the phase judges will care about most technically.

### 3.1 Build the orchestration API route
- `app/api/process-product/route.ts`
- Input: product id (fetches image/audio URLs, material_cost, category from DB)
- Steps:
  1. Call background-removal API with the image → get background-removed image
  2. Apply a lighting/color-correction pass on that result (auto brightness/contrast/white-balance) — either a second API call or a single API/model that handles both background removal and lighting correction together. **This step is explicitly required by the PS ("remove cluttered backgrounds, correct lighting, and format product photos") and must not be skipped or silently dropped.**
  3. Call speech-to-text API with the audio → get raw transcript
  4. Call a **vision-capable LLM** once with: the enhanced image + transcript + category + material_cost, asking for structured JSON output:
     - English description (SEO-friendly)
     - Hindi description
     - Suggested price + a short plain-language reasoning breakdown (cost-plus baseline using material_cost, adjusted by what the model visually assesses — craftsmanship detail, material quality, finish — plus market-positioning commentary)
  5. Validate the LLM's JSON response with Zod before trusting it
  6. Write all results back to the `products` row, set status to `ready_for_review`

> Note: the image must be passed into the pricing call itself, not just used for the enhancement step — the PS specifically requires pricing to analyze "the uploaded product image and description," so a text-only pricing call does not satisfy this requirement.

### 3.2 Resilience for a live demo
- Wrap each API call in try/catch with a sensible fallback (e.g., if background removal fails, fall back to the original image rather than breaking the flow)
- Add a timeout per call so one slow API doesn't freeze the whole demo
- Seed 1–2 pre-processed sample products in the DB ahead of time, as a safety net in case a live AI call fails on stage

### 3.3 Verify before moving on
- [ ] End-to-end test: submit one real product, confirm all AI calls fire and return valid data
- [ ] Enhanced image shows both background removal AND visible lighting/color correction (compare before/after side by side — don't just assume the API did both)
- [ ] Pricing output changes meaningfully when material_cost is changed, confirming the cost input is actually being used
- [ ] Pricing reasoning text references something visual about the image (confirming the vision-capable call is actually looking at the image, not just the text fields)
- [ ] LLM JSON output validates against your Zod schema every time (test with a few different inputs)
- [ ] Total pipeline latency is acceptable for a live demo (know your number — if it's slow, plan the demo pacing around it, e.g. show it running while you talk)
- [ ] Fallback behavior confirmed by deliberately breaking one API key and checking the app doesn't crash

---

## Phase 4: Review & Edit Listing Screen

**Goal:** the artisan (and the judges) can see the AI's work clearly and trust it.

### 4.1 Build the Review screen
- Enhanced photo, large and clear
- EN / HI description toggle or side-by-side
- Price shown prominently, with an expandable "why this price?" breakdown (this is your explainability moment — don't skip it)
- Material cost shown alongside the price breakdown (not hidden) — reinforces that the price is grounded in a real input, not just an AI guess
- Edit fields so the artisan can override any AI suggestion, including material cost, before publishing

### 4.2 Persist edits
- Save any manual edits back to the `products` row

### 4.3 Verify before moving on
- [ ] All AI-generated fields render correctly with real pipeline output (not placeholder text)
- [ ] Manual edits save and persist after a page refresh
- [ ] Screen looks good on a real phone screen size, not just desktop

---

## Phase 5: Dashboard & Simulated Publish

**Goal:** a clear "before/after" moment — draft listing → published listing.

### 5.1 Dashboard
- Grid/list of the artisan's products with status badges (draft / processing / ready / published)
- Simple mock stats per product (views/interest) — static or seeded numbers, clearly for demo storytelling

### 5.2 Publish action
- Button that updates `status` to `published` in the DB
- Success toast/animation framed as "Listed on [Government e-Marketplace / B2B Network]"
- Note internally (and in your PPT) that this is a simulated integration point, not a live external API call

### 5.3 Verify before moving on
- [ ] Dashboard reflects real-time status per product
- [ ] Publish action updates DB and UI without a refresh
- [ ] Mock stats display without breaking layout for products with no interactions yet

---

## Phase 6: Polish, PWA Finalization & Demo Readiness

**Goal:** it looks and feels finished, and survives being clicked through live in front of judges.

### 6.1 UX polish
- Loading states for every async action (upload, AI processing, publish)
- Empty states (no products yet, first-time user)
- Error toasts that don't dead-end the user
- Consistent spacing/typography pass across all screens

### 6.2 PWA finalization
- Confirm install prompt behavior on Android and iOS Safari
- App-shell caching so the app doesn't look broken if network hiccups mid-demo
- Run a Lighthouse PWA audit, fix anything flagged red

### 6.3 Demo readiness
- Rehearse the full click-through at least twice, timed
- Have your Phase 3 fallback sample data ready as a backup path
- Confirm the deployed Vercel link works on the actual device you'll demo from, on the actual network you'll be on (venue wifi can be unreliable — consider a hotspot backup)

### 6.4 Verify before moving on
- [ ] Lighthouse PWA score is reasonable (aim for green/installable status)
- [ ] Full user journey (signup → add product → AI processing → review → publish → dashboard) works twice in a row without a hard refresh
- [ ] Tested on the actual demo device

---

## Phase 7 (if time remains): PPT & Presentation Prep

- Screen recording of the working app as a backup if live demo risk is high
- Slide deck structured to mirror the PS: Background → Challenge → Solution → Impact
- One architecture slide (client → orchestration API → AI services → DB)
- One slide explicitly noting what's simulated (B2B/marketplace connector) vs real (image/voice/pricing AI) — judges respond well to this kind of transparency, it reads as technical maturity rather than a gap
