# Project Phases & Implementation Plan

Based on the requirements in `plan.txt`, the project has been structured into scalable phases. As requested, the UI/UX and performance improvements are prioritized in the initial phases, followed by the actual core features and role-based access control.

## Phase 1: UI/UX Standardization & Improvements
*Goal: Establish a consistent, beautiful, and performant design system before adding complex features.*

- **Dashboard UI Revamp:** Design a beautiful, data-rich dashboard specifically for Artisans to view total orders, catalog info, etc.
- **Mobile-Optimized Market Feed:** Refactor the feed for Customers/B2B to use a clean 2-column layout with lazy loading for optimal mobile viewing.
- **Global UI Cleanup:** Remove unwanted rounded borders, backdrop filters, and shadows to maintain a minimal, professional look (aligns with global design rules).
- **Typography Consistency:** Standardize fonts across the entire PWA application with consistent styling.
- **Micro-Animations:** Add smooth, minimal animations and consistent transitions throughout the app (built from scratch and stored in the Component folder).
- **Loading States:** Replace the existing TopBar loader with a consistent Spinner component (built from scratch and stored in the Component folder).

## Phase 2: Performance & Infrastructure
*Goal: Ensure the application scales and feels extremely fast.*

- **Redis Integration:** Implement Redis caching (via Upstash on Vercel) for database queries (especially the market feed and product catalogs) to ensure fast load times and optimized performance.
- **Cache Strategy:** Define and implement cache invalidation rules so users always see up-to-date order and product data.

## Phase 3: Database & Authentication Setup
*Goal: Expand the foundation to support the new B2B role.*

- **Database Schema Updates:** Modify existing tables and create new ones to support the new `b2b` role alongside `Artisans` and `Customer`.
- **Setup Page Extension:** Edit the current setup/onboarding page to include a "B2B" option alongside "I'm an Artisan" and "I'm a Customer".

## Phase 4: Role-Based Access Control (RBAC) & Routing
*Goal: Secure and dynamically route users based on their role.*

- **Dynamic Dashboards (`/dashboard/[role]`):** Implement role-specific routing so Artisans see their analytics, while Customers/B2B see the market feed.
- **Dynamic Profiles:** Create a dynamic profile route that adapts information fields based on the selected role (Artisan vs. Customer vs. B2B).

## Phase 5: Artisan Core Features
*Goal: Complete the Artisan specific workflows.*

- **Artisan Onboarding Flow:** Create a dedicated setup route for Artisans with fields: Phone Number, Name, Address, Email (auto-fetched via Google-OAuth), and "Specialised in".
- **Catalog Management:** Ensure Artisans have the necessary UI to manage and view their catalog on their customized dashboard.

## Phase 6: Customer & B2B Core Features
*Goal: Build out the shopping and browsing experience.*

- **Market Feed Integration:** Finalize the dashboard for Customers and B2B users with search functionality for products.
- **Dynamic Product Pages (`/product/[id]`):** Build detailed product pages displaying complete Artisan info, product image, price, description.
- **Cart & Wishlist:** Add "Add to Cart" and "Add to Wishlist" functionality on product pages.
- **Customer/B2B Profiles:** Complete the profile pages showing Name, Email, Phone Number, etc.
- **B2B Order Logic & Shared Architecture:** Use shared layouts and components for both Customer and B2B views, but implement validation logic for B2B users to strictly enforce a minimum order quantity (MOQ) of 50+ on any product.

