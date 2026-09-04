# Refactoring & Codebase Audit Plan

After reviewing the codebase, I have identified several areas that violate the project guidelines (unnecessary animations, excessive rounded corners) and found the root cause of the incorrect logic in the product fetching.

Here is the detailed, phased plan to refactor the codebase to make it clean, performant, and perfectly aligned with your rules.

## Phase 1: Fix Incorrect Logic (Data Fetching)
The reason the product data stopped showing `specialised_in` when I updated the query earlier is because the query in `Feed` and `Catalog` pages was never fetching `specialised_in` to begin with, and using the proper `profiles (...)` relation exposed this gap.
- **Fix**: Standardize all Supabase `.select()` queries across `app/product/[id]/page.tsx`, `app/feed/page.tsx`, and `app/catalog/page.tsx`.
- **Change**: They will all consistently fetch `profiles (name, company_name, specialised_in, address)`.
- **Cleanup**: Remove the hacky `Array.isArray(product.profiles)` checks in `ProductGrid.tsx` and `ProductView` since the standard relational query strictly returns an object.

## Phase 2: Remove Unnecessary Animations & Effects
Per the guidelines: *"Do not add hover shadows, backdrop filters, transforms, transitions, or animations unnecessarily."*
- **`src/components/ui/MicroAnimation.tsx`**: Delete this component entirely.
- **`src/components/features/ProductGrid.tsx`**:
  - Remove `MicroAnimation` wrapper from product cards.
  - Remove `framer-motion` spring animations from the product detail modal. Replace with a standard React conditional render.
- **`src/components/features/ProductActions.tsx`**:
  - Remove `AnimatePresence` and `motion.div` from the Add to Cart / Quantity toggle.

## Phase 3: Standardize Typography and UI Styling
Per the guidelines: *"Do not use rounded corners excessively."*
- **`app/product/[id]/page.tsx`**:
  - Change `rounded-3xl` and `rounded-2xl` to standard `rounded-lg`.
  - Remove `backdrop-blur-md` from the sticky header and bottom bar (violates the "no backdrop filters" rule).
- **`src/components/features/ProductGrid.tsx`**:
  - Standardize card borders and remove any inline structural styles that conflict with the simple design language.
- **`app/catalog/page.tsx` & `app/feed/page.tsx`**:
  - Ensure typography uses standard text classes without arbitrary font weights.

## Phase 4: Codebase Cleanup
- **Remove Dead Code**: Clear out unused imports (e.g., `framer-motion` after removal).
- **Consolidate**: Ensure `Link` and `Image` components are used consistently (already mostly true, but will do a final pass).
