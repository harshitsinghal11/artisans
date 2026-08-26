# Universal Full-Stack Project Instructions

## 1. Core Working Principles

These instructions apply to the entire project unless a specific task explicitly overrides them.

- Understand the existing project structure and conventions before making changes.
- Do not unnecessarily rewrite, refactor, or replace working code.
- Prefer simple, maintainable, and production-ready solutions over clever or unnecessarily complex solutions.
- Reuse existing components, utilities, patterns, types, hooks, services, and constants before creating new ones.
- Do not duplicate logic.
- Keep responsibilities clearly separated.
- Follow established design patterns where appropriate.
- Do not introduce dependencies unless they provide a clear benefit.
- Before adding a dependency, check whether the same problem can be solved cleanly with existing project dependencies or native platform features.
- Do not leave placeholder implementations, mock logic, dead code, commented-out code, or unused imports in completed work unless explicitly requested.
- Do not change unrelated files.
- Keep commits and changes focused on the requested feature or fix.

---

# 2. Project Architecture

## General Structure

Maintain a clear separation between:

- Presentation/UI
- Business logic
- State management
- API communication
- Authentication and authorization
- Database access
- Validation
- Shared utilities
- Configuration
- Types and schemas

Do not place unrelated responsibilities inside the same file simply for convenience.

Prefer a feature-oriented or domain-oriented structure when the application grows.

Example:

```text
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── schemas/
│   │   └── types/
│   │
│   ├── users/
│   └── dashboard/
│
├── components/
│   ├── ui/
│   └── shared/
│
├── hooks/
├── lib/
├── services/
├── types/
├── constants/
└── config/
```

Do not force this exact structure if the existing project already follows a different well-organized architecture. Preserve consistency with the existing codebase.

---

# 3. Frontend Development Standards

## Component Design

- Keep components focused on a single responsibility.
- Avoid overly large "god components."
- Extract reusable logic when it is genuinely reused or significantly improves readability.
- Do not over-componentize trivial markup.
- Prefer composition over deeply nested conditional components.
- Use reusable UI primitives for commonly repeated patterns.

Examples of reusable primitives may include:

- Button
- Input
- Select
- Modal/Dialog
- Card
- Badge
- Table
- Pagination
- Empty State
- Loading State
- Error State
- Page Header
- Section Header
- Form Field

Do not create multiple visually different versions of the same UI pattern without a clear reason.

---

## Avoid Unnecessary Containers

Do not add unnecessary wrapper elements or `<div>` containers.

Every container should have a purpose such as:

- Layout
- Spacing
- Semantic grouping
- Accessibility
- Positioning
- Styling that cannot be applied elsewhere

Avoid patterns such as:

```tsx
<div>
  <div>
    <div>
      <Component />
    </div>
  </div>
</div>
```

unless each layer has a genuine layout or functional purpose.

Prefer semantic HTML whenever appropriate:

```tsx
<header>
<nav>
<main>
<section>
<article>
<aside>
<footer>
<button>
<form>
<label>
```

---

# 4. Design System and Visual Consistency

## No Random Styling

Do not introduce arbitrary values repeatedly throughout the project.

Centralize and standardize:

- Colors
- Typography
- Font sizes
- Font weights
- Spacing
- Border radius
- Layout widths
- Breakpoints
- Component sizes
- Z-index levels

Use design tokens, CSS variables, Tailwind configuration, theme configuration, or the project's existing design system.

The same type of UI element should look and behave consistently across the entire application.

For example:

- All primary buttons should follow one primary style.
- All page titles should follow a consistent hierarchy.
- All form labels should use the same pattern.
- All cards of the same category should have consistent spacing.
- All tables should follow the same visual system.
- All destructive actions should use consistent visual treatment.

---

# 5. Color System

## Do Not Default to Blue

Do not automatically use blue as the primary, accent, link, button, focus, or decorative color.

The primary color must be intentionally selected based on:

- The project domain
- Brand identity
- Existing design system
- Overall visual direction

Do not introduce blue merely because it is a common default in UI frameworks.

If no brand palette exists, establish a restrained and coherent color system instead of randomly assigning colors.

Use colors purposefully.

Typical semantic colors may include:

- Primary
- Secondary
- Success
- Warning
- Error/Destructive
- Information
- Neutral

Do not use excessive colors merely for decoration.

---

# 6. Light and Dark Theme

The application must properly support both light and dark themes unless explicitly excluded.

Do not simply invert the page background.

Define semantic theme variables such as:

```css
--background
--foreground
--surface
--surface-foreground
--muted
--muted-foreground
--primary
--primary-foreground
--border
--input
--error
--success
--warning
```

Components should consume semantic colors instead of hardcoded colors wherever possible.

Avoid:

```css
color: #111;
background: white;
```

when a semantic token should be used.

Instead, use theme-aware values.

### Contrast Requirements

Ensure sufficient contrast between:

- Text and background
- Muted text and background
- Buttons and button text
- Inputs and their background
- Disabled states
- Error messages
- Links
- Icons
- Focus indicators

Never assume that a color visible in light mode will also work in dark mode.

Every new UI element must be checked conceptually for both themes.

---

# 7. Typography System

Typography must follow a clear hierarchy.

Do not use random font sizes.

Define a consistent type scale.

Typical hierarchy:

```text
Display / Hero
Page Title
Section Title
Subsection Title
Body
Small Body
Caption / Metadata
```

Rules:

- Use consistent font sizes for equivalent hierarchy levels.
- Use font weight intentionally.
- Do not make everything bold.
- Do not make everything large.
- Do not use tiny text for important information.
- Maintain readable line-height.
- Keep paragraph widths readable.
- Use hierarchy to communicate importance.

Text should remain readable and appropriately scalable across screen sizes.

Avoid hardcoding unrelated values such as:

```text
17px
19px
23px
27px
31px
```

throughout the application without a defined typography system.

Use the project's standardized scale.

---

# 8. Responsive Design

The UI must be responsive by design, not patched after desktop development.

Support at minimum:

- Mobile
- Tablet
- Laptop/Desktop
- Large screens where applicable

Do not design exclusively for one screen width.

### Responsive Rules

- Avoid fixed widths unless necessary.
- Avoid layouts that overflow horizontally.
- Use flexible layouts.
- Use `min-width`, `max-width`, flexible grids, and responsive sizing appropriately.
- Ensure text remains readable on small screens.
- Ensure buttons and controls remain usable on touch devices.
- Reorganize layouts when necessary instead of simply shrinking everything.
- Do not hide critical functionality on mobile without an alternative.
- Tables should have an intentional mobile strategy.
- Sidebars and navigation should adapt appropriately.

Do not add arbitrary media queries for individual components when a consistent responsive system can solve the problem.

---

# 9. Visual Hierarchy

Every screen should clearly communicate:

1. What is this page?
2. What information is most important?
3. What action should the user take?
4. What information is secondary?
5. What can safely receive less visual emphasis?

Use:

- Typography
- Spacing
- Position
- Grouping
- Alignment
- Color
- Size

to create hierarchy.

Do not rely on excessive decoration.

Avoid interfaces where:

- Everything is bold.
- Everything is inside a card.
- Everything has a border.
- Everything has an icon.
- Everything has a different color.
- Every section looks equally important.

Visual emphasis should be deliberate.

---

# 10. Spacing and Layout

Use a consistent spacing scale.

Do not randomly mix margins and padding values.

Maintain consistent:

- Page padding
- Section spacing
- Component spacing
- Form spacing
- Grid gaps
- Card padding

Related elements should be visually grouped.

Unrelated elements should have more separation.

Do not use excessive empty space merely to make a page look "modern."

Do not make layouts cramped either.

Spacing should communicate structure.

---

# 11. Borders, Shadows, Blur and Effects

Do not apply borders, shadows, blur, or visual effects everywhere.

### Borders

Use borders only when they provide meaningful separation or interaction clarity.

Do not put every section inside a bordered box.

### Shadows

Do not use shadows by default.

Use shadows only when they communicate elevation, layering, or interaction where necessary.

Avoid:

- Heavy shadows
- Multiple stacked shadows
- Excessive floating-card designs

### Backdrop Blur

Do not use `backdrop-filter`, glassmorphism, or blur effects unless explicitly justified by the design.

Do not add blur simply to make the UI look modern.

### Decorative Effects

Avoid unnecessary:

- Gradients
- Glow effects
- Glass effects
- Noise textures
- Animated backgrounds
- Excessive rounded containers
- Decorative shapes

The interface should remain clean and purposeful.

---

# 12. Animations and Transitions

Do not add transitions or animations by default.

Animations must have a functional purpose such as:

- Showing state changes
- Providing interaction feedback
- Communicating movement
- Improving orientation

Avoid unnecessary animations on:

- Every hover
- Every card
- Every button
- Page elements
- Decorative UI components

Respect reduced-motion preferences where applicable.

Do not add animation simply because a UI component can be animated.

---

# 13. Accessibility

Accessibility is a default requirement.

Ensure:

- Semantic HTML is used where possible.
- Inputs have associated labels.
- Buttons have meaningful accessible names.
- Icon-only buttons have accessible labels.
- Keyboard navigation works.
- Focus states are visible.
- Focus is managed correctly in dialogs and modals.
- Color is not the only method used to communicate meaning.
- Error messages are understandable.
- Interactive elements have appropriate sizes.
- Images have appropriate alternative text.
- Heading hierarchy is logical.

Do not remove focus outlines without replacing them with an accessible alternative.

---

# 14. Forms

All forms must have proper validation.

Prefer schema-based validation where supported by the project's stack.

Validation should occur:

- Before submission where appropriate
- On the server
- With clear user-facing feedback

Do not rely exclusively on client-side validation.

Rules:

- Clearly indicate required fields.
- Display validation messages near the relevant field.
- Preserve user input when possible after recoverable errors.
- Disable submission only when necessary.
- Prevent accidental duplicate submissions.
- Show submission/loading state.
- Clearly communicate success or failure.

Sensitive data such as passwords should not remain in unnecessary client state longer than required.

---

# 15. Loading, Empty and Error States

Every asynchronous operation must consider all relevant states:

```text
Idle
Loading
Success
Empty
Error
```

Do not assume that data will always load successfully.

Provide intentional UI for:

- Initial loading
- Background loading where relevant
- Empty results
- API failures
- Permission failures
- Missing resources

Avoid blank screens.

Do not use generic "Something went wrong" messages when a more useful explanation can safely be provided.

---

# 16. Frontend State Management

Use the simplest state management approach that fits the problem.

Distinguish between:

- Local UI state
- Shared client state
- Server/API state
- URL state
- Persistent state

Do not put everything into global state.

Avoid prop drilling when composition, context, or another appropriate pattern would be cleaner.

Do not use global state for temporary state that belongs inside a component.

Server state should be handled with appropriate caching, invalidation, loading, and error strategies.

---

# 17. API Communication

Centralize API communication.

Avoid scattering raw API calls throughout unrelated UI components.

Prefer a clear separation such as:

```text
components → hooks/services → API client
```

Requirements:

- Handle loading states.
- Handle errors.
- Validate API responses where appropriate.
- Avoid duplicated requests.
- Cancel or ignore obsolete requests where relevant.
- Use consistent error handling.
- Do not expose internal server details directly to users.

---

# 18. Routing and Route Security

- Protect authenticated routes.
- Implement role-based access control where applicable.
- Do not rely solely on hiding UI elements for authorization.
- Unauthorized users must be blocked at the appropriate application or backend layer.
- Handle non-existent routes intentionally.
- Preserve the intended destination during authentication flows where appropriate.

For example:

```text
/login?redirect=/dashboard/settings
```

or an equivalent safe approach.

After successful login, redirect users to their intended destination when safe and appropriate.

---

# 19. Backend Architecture

Keep backend responsibilities clearly separated.

A typical flow may look like:

```text
Route / Controller
        ↓
Service / Business Logic
        ↓
Repository / Data Access
        ↓
Database
```

The exact architecture may vary depending on the framework.

Do not place all business logic directly inside route handlers.

Avoid controllers that contain:

- Complex database logic
- Validation logic
- Business rules
- Authorization logic
- External service integrations

mixed together without separation.

Keep each layer focused.

---

# 20. API Design

Design APIs consistently.

Use predictable:

- Naming
- Request structures
- Response structures
- Error formats
- Pagination formats
- HTTP status codes

Do not return completely different response structures for similar endpoints without a reason.

Example concept:

```json
{
  "success": true,
  "data": {}
}
```

or use the project's existing standardized response format.

Error responses should be structured and predictable.

Do not expose:

- Stack traces
- Database errors
- Internal file paths
- Secrets
- Sensitive implementation details

to clients.

---

# 21. Backend Validation

Never trust client input.

Validate all external input, including:

- Request body
- Query parameters
- Route parameters
- File uploads
- Headers where relevant

Validation should include:

- Type
- Format
- Required fields
- Length
- Allowed values
- Range
- File size
- File type

Client-side validation improves user experience.

Server-side validation protects the system.

Both may be required.

---

# 22. Authentication

Follow secure authentication practices appropriate to the selected stack.

Requirements:

- Passwords must be securely hashed.
- Never store plain-text passwords.
- Tokens and sessions must be handled securely.
- Authentication secrets must never be hardcoded.
- Expiration and refresh strategies should be intentional.
- Logout must properly invalidate or clear relevant authentication state.
- Authentication failures should not leak unnecessary account information.

Do not expose whether an account exists when doing so creates avoidable security risks.

---

# 23. Authorization

Authentication and authorization are separate.

Every protected operation must verify:

1. Who is the user?
2. Is the user allowed to perform this action on this resource?

Never trust:

- Client-provided roles
- Hidden buttons
- Frontend route protection alone
- User IDs supplied by the client without authorization checks

Enforce authorization on the backend.

---

# 24. Security

Security is required throughout the project.

## General

- Never hardcode secrets.
- Never commit `.env` files containing real credentials.
- Do not expose private API keys to the frontend.
- Validate and sanitize external input where appropriate.
- Use parameterized database queries or ORM protections.
- Protect against injection attacks.
- Implement appropriate rate limiting for sensitive endpoints.
- Restrict CORS intentionally.
- Use secure HTTP headers where applicable.
- Handle file uploads carefully.
- Apply the principle of least privilege.

## CSRF

If using token-based authentication through an `Authorization` header instead of cookies, CSRF exposure is generally reduced because credentials are not automatically attached by the browser.

If using cookie-based authentication:

- Configure `SameSite` appropriately.
- Use `Secure` cookies in production.
- Use `HttpOnly` where applicable.
- Implement CSRF protection where required.

Do not assume authentication automatically provides CSRF protection.

---

# 25. Database Practices

- Design schemas intentionally.
- Use appropriate relationships and constraints.
- Enforce data integrity at the database level where possible.
- Add indexes based on real query requirements.
- Avoid unnecessary indexes.
- Avoid N+1 query patterns.
- Use transactions for operations that must succeed or fail together.
- Do not fetch unnecessary data.
- Paginate potentially large result sets.
- Never expose sensitive database fields by default.

Examples of sensitive fields:

- Password hashes
- Authentication tokens
- Internal metadata
- Security-related fields

---

# 26. Error Handling

Use consistent error handling throughout the application.

Differentiate between:

- Validation errors
- Authentication errors
- Authorization errors
- Not found errors
- Conflict errors
- External service failures
- Internal server errors

Log sufficient information for debugging without logging secrets or unnecessary sensitive data.

Users should receive useful messages.

Developers should receive sufficient diagnostic information through secure logs and monitoring.

Do not silently swallow errors.

---

# 27. Logging and Monitoring

Logs should be structured and useful.

Avoid excessive logging in production.

Never log:

- Passwords
- Authentication tokens
- API keys
- Secret values
- Sensitive personal information unless explicitly required and properly protected

Use appropriate log levels:

```text
debug
info
warn
error
```

Production systems should support appropriate error tracking and monitoring where applicable.

---

# 28. Environment Variables and Configuration

All environment-specific configuration should be externalized.

Examples:

```text
DATABASE_URL
JWT_SECRET
API_BASE_URL
SMTP_HOST
STORAGE_BUCKET
```

Requirements:

- Do not hardcode environment-specific values.
- Provide an `.env.example` when appropriate.
- Document required variables.
- Validate required environment variables at startup.
- Clearly distinguish public and server-only environment variables.

Never expose server secrets to frontend bundles.

---

# 29. Dependency Management

Before introducing a dependency:

1. Check whether the functionality already exists in the project.
2. Check whether native platform functionality is sufficient.
3. Prefer actively maintained libraries.
4. Avoid dependencies for trivial tasks.
5. Check compatibility with the existing stack.

Do not add multiple libraries solving the same problem.

Examples:

- Multiple date libraries without reason
- Multiple state management libraries
- Multiple UI component systems
- Multiple validation libraries

Run dependency security checks where supported.

Remove unused dependencies.

Use reproducible dependency installation practices in CI.

---

# 30. Code Quality

Code should be:

- Readable
- Predictable
- Typed where the stack supports typing
- Consistent
- Easy to modify
- Free from unnecessary complexity

Prefer descriptive names.

Avoid:

```ts
const x = ...
const data2 = ...
const temp = ...
```

when a meaningful name can be used.

Functions should have focused responsibilities.

Avoid deeply nested conditional logic where a clearer structure can be used.

Use early returns when they improve readability.

Do not abstract prematurely.

---

# 31. Type Safety

When using TypeScript or another typed language:

- Avoid unnecessary `any`.
- Define meaningful interfaces and types.
- Reuse shared types where appropriate.
- Validate external data at runtime where type safety alone is insufficient.
- Do not assume API responses are valid simply because they have a TypeScript type.

Types do not replace runtime validation.

---

# 32. Testing

Test behavior that matters.

Prioritize:

- Critical business logic
- Authentication
- Authorization
- Validation
- Important API endpoints
- Complex calculations
- Important user flows

Do not write meaningless tests solely to increase coverage.

Tests should be:

- Deterministic
- Independent
- Readable
- Maintainable

Avoid tests that are tightly coupled to irrelevant implementation details when behavior can be tested instead.

---

# 33. Performance

Do not optimize prematurely, but do not introduce obvious performance problems.

Consider:

- Unnecessary re-renders
- Large bundle sizes
- Unnecessary API calls
- N+1 database queries
- Missing pagination
- Large images
- Blocking operations
- Repeated expensive calculations

Use lazy loading, caching, memoization, indexing, pagination, or background processing when they provide a measurable or logical benefit.

Do not add memoization everywhere by default.

---

# 34. File Uploads

For file uploads:

- Validate file type.
- Validate file size.
- Validate server-side, not only client-side.
- Generate safe file names where necessary.
- Do not trust user-provided file extensions.
- Restrict access appropriately.
- Avoid exposing internal storage paths.
- Consider malware scanning where the application's risk profile requires it.

---

# 35. Pagination and Large Data

Never load an unlimited dataset by default.

Use appropriate strategies such as:

- Pagination
- Cursor pagination
- Infinite loading
- Server-side filtering
- Server-side sorting

The chosen strategy should match the use case.

Do not fetch thousands of records simply to display a small subset in the frontend.

---

# 36. Search, Filtering and Sorting

When implementing data-heavy pages:

- Keep filters predictable.
- Reflect important state in the URL when useful.
- Debounce search inputs when appropriate.
- Perform large dataset filtering server-side.
- Clearly indicate active filters.
- Provide a clean way to reset filters.

Do not create unnecessarily complex filter interfaces.

---

# 37. Tables and Data-Heavy Interfaces

Tables should be designed intentionally.

Consider:

- Responsive behavior
- Sorting
- Filtering
- Pagination
- Empty state
- Loading state
- Error state
- Column priority on small screens

Do not force a wide desktop table to simply shrink onto a mobile screen.

---

# 38. Accessibility and Keyboard Interaction

Interactive functionality must not depend exclusively on mouse interaction.

Support appropriate:

- Tab navigation
- Enter/Space activation
- Escape to close dismissible UI
- Focus management
- Screen reader labels

Modal dialogs should:

- Move focus appropriately
- Prevent inappropriate interaction with background content
- Restore focus when closed

---

# 39. SEO and Metadata

For public-facing pages where relevant:

- Use meaningful page titles.
- Provide descriptions.
- Use semantic HTML.
- Use appropriate heading hierarchy.
- Provide useful image metadata.
- Avoid duplicate metadata.
- Handle canonical URLs where applicable.

Do not spend effort on SEO requirements for purely private authenticated application screens unless relevant.

---

# 40. CI/CD and Production Readiness

Before considering work complete, ensure where applicable:

- Project builds successfully.
- Type checks pass.
- Linting passes.
- Tests pass.
- Environment variables are documented.
- Production configuration is considered.
- Secrets are not included in source code.
- No unnecessary debug code remains.

Use reproducible dependency installation in CI.

---

# 41. Documentation

Document things that are not obvious.

Good candidates include:

- Complex business rules
- Non-obvious architectural decisions
- Environment setup
- External service integrations
- Important assumptions
- Security-sensitive flows

Do not write comments that merely repeat obvious code.

Avoid:

```ts
// Increment count
count++;
```

Prefer comments explaining why, not what.

---

# 42. Before Implementing a Feature

Before starting significant work:

1. Understand the existing architecture.
2. Identify affected frontend and backend areas.
3. Check for existing reusable components or utilities.
4. Identify data flow.
5. Identify authentication and authorization requirements.
6. Identify validation requirements.
7. Consider loading, empty and error states.
8. Consider responsiveness.
9. Consider accessibility.
10. Avoid changing unrelated functionality.

---

# 43. Before Marking Work Complete

Verify the following.

## Functionality

- [ ] The requested functionality works.
- [ ] Existing functionality is not unnecessarily broken.
- [ ] Edge cases have been considered.
- [ ] Loading states are handled.
- [ ] Empty states are handled.
- [ ] Error states are handled.

## UI

- [ ] The design is consistent with the existing system.
- [ ] No random colors were introduced.
- [ ] Blue was not used as a default accent without intentional design justification.
- [ ] Typography follows the established scale.
- [ ] Spacing is consistent.
- [ ] Visual hierarchy is clear.
- [ ] Light theme works correctly.
- [ ] Dark theme works correctly.
- [ ] Text contrast is sufficient.
- [ ] The UI is responsive.
- [ ] Unnecessary borders, shadows, blur, gradients, and decorative effects were avoided.
- [ ] Unnecessary wrapper elements were avoided.

## Accessibility

- [ ] Semantic HTML is used where appropriate.
- [ ] Keyboard navigation works.
- [ ] Focus states are visible.
- [ ] Forms have labels.
- [ ] Icon-only controls have accessible names.
- [ ] Color is not the only indicator of meaning.

## Backend

- [ ] Input validation exists.
- [ ] Authentication is handled where required.
- [ ] Authorization is enforced server-side.
- [ ] Errors are handled consistently.
- [ ] Sensitive information is not exposed.
- [ ] Database queries are efficient.
- [ ] Large datasets are paginated or otherwise handled appropriately.

## Security

- [ ] No secrets are hardcoded.
- [ ] Environment variables are used correctly.
- [ ] Client input is not trusted.
- [ ] Sensitive routes and operations are protected.
- [ ] API keys and secrets are not exposed to the frontend.
- [ ] File uploads are validated where applicable.
- [ ] Appropriate CSRF considerations exist for the authentication strategy.

## Code Quality

- [ ] No unnecessary dependencies were added.
- [ ] No unused imports remain.
- [ ] No dead code remains.
- [ ] No unnecessary duplication was introduced.
- [ ] Types are correct.
- [ ] Existing project conventions were followed.
- [ ] Build, lint, type checking, and relevant tests pass.

---

# 44. AI Agent Behavior

When working on this project:

- Do not blindly generate large amounts of code.
- Inspect existing patterns first.
- Maintain consistency with the current architecture.
- Reuse before creating.
- Do not introduce unnecessary abstractions.
- Do not add visual effects merely for appearance.
- Do not redesign unrelated parts of the application.
- Do not silently change APIs, schemas, authentication behavior, or database structures without considering downstream effects.
- Do not remove existing functionality unless explicitly requested.
- Prefer production-ready implementations over demos or shortcuts.
- Consider security, accessibility, responsiveness, performance, and maintainability as part of implementation, not optional post-processing.

When requirements are ambiguous, choose the solution most consistent with:

1. Existing project architecture
2. Existing design system
3. Security best practices
4. Accessibility
5. Maintainability
6. Simplicity
7. User experience

The goal is not to maximize the number of components, libraries, abstractions, animations, cards, borders, or visual effects.

The goal is to build a clean, coherent, secure, accessible, responsive, maintainable, and production-ready full-stack application.