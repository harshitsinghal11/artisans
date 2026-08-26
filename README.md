# Artisan AI (SIH PS 26090)

An AI-driven Progressive Web App (PWA) designed to empower rural Indian artisans with low digital literacy to list, price, and sell their handmade goods online, overcoming language and technical barriers.

---

## 🛑 The Problem
Rural artisans create incredible, high-quality handmade goods, but they struggle to participate in the digital economy (e-commerce, GeM, ONDC) due to three massive barriers:
1. **Digital Literacy:** Typing complex product descriptions and navigating intricate upload forms is intimidating.
2. **Language Barrier:** E-commerce heavily relies on SEO-optimized English, which many rural artisans do not speak.
3. **Market Ignorance (Pricing & Presentation):** Artisans often underprice their goods or take poorly lit photos, severely hurting their market positioning.

## 💡 Our Solution
**Zero-Typing, AI-First Cataloging.**
Instead of forcing the artisan to become a digital marketer, our app acts as their personal AI agent. 
The artisan simply takes a photo of their product and speaks into their microphone in their native language (e.g., "This is a hand-painted clay pot, the materials cost me 50 rupees").

The AI Orchestration Pipeline takes over:
1. **Cloudinary AI** instantly removes the cluttered background and corrects the lighting.
2. **Groq Whisper AI** transcribes the local language voice note lightning fast.
3. **Gemini / Mistral AI** analyzes the image and the transcript to generate a professional, SEO-friendly English & Hindi description, and calculates a fair market retail price based on the visual craftsmanship and raw material cost.

## 🚀 Impact
- **Financial Inclusion:** Artisans get fair market value for their work rather than selling to middlemen at a loss.
- **Cultural Preservation:** By making the business of traditional crafts profitable, younger generations are incentivized to keep the crafts alive.
- **Global Reach:** SEO-optimized English descriptions allow local goods to be discovered globally.

---

## 🏗 Architecture & Tech Stack

| Technology | What it does | Why we chose it |
| :--- | :--- | :--- |
| **Next.js (App Router)** | Full-stack framework | Allows us to build a seamless React frontend and serverless API backend in a single repository. |
| **Tailwind CSS** | Styling engine | Rapid, utility-first styling ensuring the app looks professional and responsive on all mobile devices. |
| **Supabase** | Postgres DB, Auth, & Storage | Real-time backend-as-a-service. Replaces the need for a complex custom backend, offering fast file uploads and secure OAuth. |
| **Vercel AI SDK** | AI Orchestration | Provides a unified `generateObject` API, allowing us to build an instant fallback architecture between AI providers without the bloat of Langchain. |
| **Google Gemini 1.5 Pro** | Core Brain (Vision & LLM) | Best-in-class multimodal model that can look at an image (to judge craftsmanship) *and* read text simultaneously for pricing. |
| **Mistral AI** | Fallback Brain | High-speed, cost-effective LLM used as an automatic safety net in case Gemini hits a rate limit during the demo. |
| **Cloudinary** | Image Enhancement | Provides instant background removal and lighting correction APIs specifically trained on e-commerce product photos. |
| **Groq Whisper API** | Voice-to-Text | Lightning-fast implementation of OpenAI's open-source Whisper model. Excellent at understanding rural dialects and Hindi speech. |
| **Progressive Web App (PWA)** | App Platform | Bypasses the Play Store. Users can install the app directly from a browser, saving space on low-end rural smartphones. |

---

## 🚶 User Journey (The Artisan Flow)
1. **Auth:** Artisan logs in via Google OAuth.
2. **Dashboard:** Artisan sees their current catalog and real-time analytics.
3. **Capture (Add Product):** 
   - Artisan snaps a photo using the native camera API.
   - Artisan holds the mic button to record a voice note explaining the product.
   - Artisan inputs the raw material cost (the only typing required).
4. **AI Processing:** A dynamic loading screen keeps the user informed while the backend orchestrates Cloudinary, Groq Whisper, and the AI models.
5. **Review:** Artisan reviews the beautifully formatted, bilingual listing and the suggested price (with AI reasoning). They can manually edit anything if needed.
6. **Publish:** The product goes live in their digital catalog.

---

## 🗄️ Core Data Model

**`products` Table**
- `id` (uuid)
- `user_id` (FK to Supabase Auth user)
- `raw_image_url` & `enhanced_image_url`
- `raw_audio_url` & `transcript`
- `description_en` & `description_hi`
- `category` & `material_cost`
- `suggested_price` & `price_reasoning`
- `status` (enum: `draft` \| `processing` \| `ready_for_review` \| `published`)

---

## ⚖️ AI Pipeline — Real vs Simulated

In the context of the hackathon demo, it is important to clarify what is real and what is a simulated placeholder:

| Component | Status | Rationale |
| :--- | :--- | :--- |
| **Image Background Removal** | **Real** | Off-the-shelf Cloudinary API, high visual demo payoff. |
| **Speech-to-Text (Groq)** | **Real** | Executed live via Groq's high-speed Whisper model API. |
| **Translation & Descriptions** | **Real** | Executed live via Gemini / Mistral API. |
| **Pricing Suggestion** | **Real** | Calculated live using a vision-capable LLM analyzing the enhanced image + description + material cost baseline (No public API exists for handicraft market pricing, so LLM heuristic is required). |
| **Marketplace Connection** | **Simulated** | No accessible public API exists for GeM integration without formal onboarding. Pressing "Publish" updates our internal DB catalog. |

---

## ⚠️ Known Risks & Demo Fallbacks
- **Live AI call failure on stage:** We implemented a `try/catch` fallback from Gemini to Mistral API. If both fail, the app gracefully shows an error toast without crashing.
- **Flaky venue wifi:** If image uploads hang, the UI explicitly shows the stage it is stuck on (e.g., "Uploading media...") rather than freezing. 
- **Cloudinary Rate Limits:** If the Cloudinary image enhancement fails, the API gracefully falls back to passing the raw unedited photo to the AI so the pipeline completes successfully.

---

## 🔮 Future Scope (Production Ready)
While this MVP proves the core AI cataloging engine, a full production launch would include:
- **Real Marketplace Integration:** Connecting the "Publish" button directly to the ONDC Network or Government e-Marketplace (GeM) APIs.
- **Offline-First Sync:** Using IndexedDB to allow artisans to take photos and record audio *without internet*, queuing the uploads for when they reach a village with cellular data.
- **Live Buyer Chat:** Integrating WhatsApp Business API so buyers can message the artisans directly, with real-time AI translation bridging the gap.
- **Integrated Logistics:** Auto-calculating shipping costs via IndiaPost APIs based on the artisan's pin code.
- **Multi-user Roles:** Adding a portal for cluster coordinators managing multiple artisans.
- **UI/UX Polish:** Adding Framer Motion micro-animations, success confetti, and ensuring a 100/100 Lighthouse PWA score.

---

## 🚫 Out of Scope for Internal Round
- Real payment processing gateways.
- Production-grade error handling for every edge case.
- Multi-language support beyond English and Hindi.
- Formal security hardening beyond standard Row Level Security (RLS).
