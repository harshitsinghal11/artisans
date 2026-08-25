# Spec Sheet — AI-Driven Market Linkage & Smart Cataloging App
### SIH Problem Statement ID: 26090

---

## 1. Problem Statement (plain summary)

Marginalized artisans and weavers get government support to produce handicrafts but have no continuous, year-round digital sales channel — they rely on periodic physical fairs (Shilp Samagam, Surajkund Mela, Dilli Haat). They can't compete online because they lack the skills to photograph products professionally, write compelling listings, or price competitively. The ask is an AI-driven mobile app that acts as a "virtual business manager" — digitizing inventory, optimizing listings with AI, and connecting artisans to B2B buyers or government e-marketplaces, without requiring technical skill.

---

## 2. What We're Building (MVP definition)

A **PWA (Progressive Web App)** built with Next.js that lets an artisan:
1. Photograph a product with their phone camera
2. Describe it via a voice note in their own language
3. Enter the raw material cost (simple numeric input)
4. Receive, automatically: a photo with both background removed AND lighting corrected, a bilingual (English + Hindi) SEO-friendly description, and a suggested selling price — generated from the image, description, AND material cost — with a plain-language explanation
5. Review/edit that listing, then "publish" it (simulated marketplace push for this round)

Target device: mobile phone, low digital literacy user. Interface must be minimal, high-contrast, low-text, icon-driven where possible.

---

## 3. Explicit Requirements vs. Implementation Choices

**Explicitly required by the problem statement:**
- Cross-platform mobile app
- Minimalist, highly responsive, accessible UI/UX for low-literacy users
- AI Image Enhancer (background removal, **lighting correction**, e-commerce formatting) — both background removal AND lighting correction are named explicitly; neither is optional
- Multilingual voice-note-based cataloging → SEO descriptions in English AND Hindi
- Dynamic Pricing Assistant using **the uploaded product image** + description + market trends + raw material cost — the PS names the image itself as a pricing input, not just the text description
- Some form of connection to B2B buyers or government e-marketplaces
- A scalable backend architecture

**Our implementation choices (not dictated by the PS):**
- PWA (over native app) — chosen for install-without-app-store friction, camera/mic access via browser APIs, and fast hackathon build time
- Next.js + TypeScript + Tailwind + Supabase as the stack
- Simulated B2B/marketplace integration for this round (no public API exists for this; real integration would require formal onboarding with an actual marketplace/GeM)
- Cost-plus heuristic + LLM reasoning as the pricing methodology (no real-time market pricing API exists publicly for handicrafts — confirmed via research; macro market-size reports exist but no per-product pricing data source)

---

## 4. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js (App Router) | Single repo for frontend + API routes |
| Language | TypeScript | |
| Styling | Tailwind CSS | Fast, consistent, easy to make polished |
| Icons | Lucide React | |
| PWA | next-pwa or Serwist | Manifest + service worker, installable |
| Backend | Next.js API routes (serverless) | No separate backend server needed |
| Database | Supabase (Postgres) | |
| Auth | Supabase Auth | Email/password or phone OTP, kept minimal |
| File storage | Supabase Storage | Product images + voice notes |
| Validation | Zod | Form inputs + AI response schema validation |
| Hosting | Vercel | Native Next.js support, fast deploys, free HTTPS |
| Image AI | Background-removal API + lighting/color-correction pass (e.g. remove.bg or equivalent for background, plus an auto brightness/contrast/white-balance step — either a second call or a single API/model that does both) | Both steps are explicitly required by the PS, not just background removal alone |
| Speech-to-text | Whisper API (or equivalent multilingual STT) | |
| Translation + description + pricing reasoning | **Vision-capable** LLM API (e.g. Claude API with image input) — one structured call, given the enhanced image + transcript + category + material cost | Must be vision-capable so pricing genuinely analyzes the image, per the PS wording |

---

## 5. Architecture Overview

```
[Client: Next.js PWA]
   │  camera capture (getUserMedia)
   │  voice capture (MediaRecorder)
   ▼
[Supabase Storage]  ← image + audio uploaded
   │
   ▼
[Next.js API Route: /api/process-product]
   ├─→ Background Removal API  → enhanced image
   ├─→ Speech-to-Text API      → raw transcript
   └─→ LLM API (single call)   → { description_en, description_hi, price, price_reasoning }
   │
   ▼
[Supabase Postgres: products table]  ← results saved
   │
   ▼
[Client: Review Screen]  → artisan reviews/edits
   │
   ▼
[Publish action]  → status flag updated (simulated marketplace push)
   │
   ▼
[Client: Dashboard]  → shows published listings + mock engagement stats
```

---

## 6. Data Model (draft)

**`profiles`**
| field | type | notes |
|---|---|---|
| id | uuid | linked to Supabase Auth user |
| name | text | |
| preferred_language | text | for voice input hint |
| created_at | timestamp | |

**`products`**
| field | type | notes |
|---|---|---|
| id | uuid | |
| user_id | uuid | FK to profiles |
| raw_image_url | text | original captured photo |
| enhanced_image_url | text | after AI processing |
| raw_audio_url | text | voice note |
| transcript | text | STT output |
| description_en | text | LLM output |
| description_hi | text | LLM output |
| category | text | artisan-selected or inferred |
| material_cost | numeric | artisan input |
| suggested_price | numeric | LLM/heuristic output |
| price_reasoning | text | plain-language explanation |
| status | enum | `draft` \| `processing` \| `ready_for_review` \| `published` |
| created_at | timestamp | |
| updated_at | timestamp | |

---

## 7. AI Pipeline & APIs — Real vs Simulated

| Component | Status this round | Rationale |
|---|---|---|
| Image background removal | Real | Off-the-shelf API, high visual demo payoff |
| Image lighting/color correction | Real | Explicitly required by the PS alongside background removal — not optional |
| Speech-to-text (regional languages) | Real | Whisper-class APIs handle multiple Indian languages reasonably well |
| Translation + SEO description generation | Real | Single LLM call |
| Pricing suggestion | Real logic — vision-capable LLM analyzing the enhanced image + description, combined with a material-cost-based heuristic baseline (not live market data) | No public API exists for per-product handicraft market pricing (confirmed via research); image input is required by the PS wording, so the pricing call must be vision-capable, not text-only |
| B2B buyer / government e-marketplace connection | Simulated | No accessible public API for this; real integration needs formal onboarding (e.g. GeM/GeM-ODOP) outside hackathon scope |

---

## 8. Feature List — MVP vs Future Improvements

**MVP (this round):**
- Camera capture + voice capture
- AI image enhancement
- Bilingual (EN/HI) AI-generated description
- Heuristic + AI-reasoned pricing suggestion with visible breakdown
- Review/edit before publish
- Simulated publish + dashboard with mock stats
- Installable PWA

**Future improvements (explicitly out of scope now, mention in PPT as roadmap):**
- Real integration with GeM/GeM-ODOP Bazaar or other B2B marketplaces
- Real-time market pricing informed by actual comparable listings
- Support for more regional languages / dialects beyond initial demo set
- Offline-first flow (queue uploads when connectivity returns)
- Multi-user roles (cluster coordinators managing multiple artisans)
- Analytics dashboard with real engagement/sales data
- Push notifications (price drop alerts, buyer interest)
- In-app negotiation/order management with buyers

---

## 9. Out of Scope for the Internal Round

- Real payment processing
- Real marketplace/government API integration
- Production-grade error handling for every edge case
- Multi-language support beyond the demoed language(s)
- Scalability/load testing
- Formal security hardening beyond basic auth

---

## 10. Known Risks & Demo Fallbacks

- **Live AI call failure on stage:** keep 1–2 pre-processed sample products seeded in the DB as a fallback path
- **Slow API latency:** know your pipeline's typical response time; narrate through it rather than sitting in silence
- **Flaky venue wifi:** test on a mobile hotspot as backup; confirm the Vercel deployment works on the actual demo device beforehand
- **Judges question the simulated marketplace step:** be upfront in the PPT that this is intentionally simulated for this round, with real integration named as a clear next step — this reads as technical maturity, not a gap
