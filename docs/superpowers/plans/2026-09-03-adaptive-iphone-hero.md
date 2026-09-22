# Adaptive iPhone Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent the desktop hero phone from being visually clipped while giving the existing chat demo a taller, more realistic iPhone frame.

**Architecture:** Keep the scripted conversation and phone screen content intact. Make the hero content-driven and overflow-safe, convert the phone frame into a bounded flex column with a responsive height, and add decorative hardware controls outside the frame without affecting document flow.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Vitest, Testing Library.

**Spec:** Current user request and attached desktop screenshot in the active task.

## Global Constraints

- Preserve the existing Retail, Travel, Klinik/Clinic, and Edukasi/Education tabs and all chat content.
- Preserve the prototype screen UI, animation behavior, product media treatment, and composer destination.
- The phone must remain readable; do not use scale-to-fit as the primary solution.
- Decorative iPhone hardware controls must not introduce interactive accessibility noise.
- Follow the local Next.js 16 documentation before changing component code.

---

### Task 1: Add layout and hardware regression coverage

**Files:**
- Modify: `src/components/sections/home/hero.test.tsx`

**Interfaces:**
- Consumes: Existing `renderHero()` test helper.
- Produces: Assertions covering desktop overflow behavior and the presence of decorative iPhone hardware markers.

- [ ] **Step 1: Add a failing test for the hero overflow contract and hardware markers**

Assert that the hero section is not configured with clipping overflow and that the phone exposes silent/action, volume, and power hardware markers.

- [ ] **Step 2: Run the focused test and verify it fails for the missing behavior**

Run: `pnpm vitest run src/components/sections/home/hero.test.tsx --maxWorkers=1`

Expected: the new assertions fail because the current hero still uses `overflow-hidden` and the phone has no hardware markers.

### Task 2: Re-layout the hero and phone frame

**Files:**
- Modify: `src/components/sections/home/hero.tsx`
- Modify: `src/components/sections/home/hero-chat-demo.tsx`

**Interfaces:**
- Consumes: Existing hero grid and `HeroChatDemo` state/content API.
- Produces: A content-driven hero, a responsive taller phone shell, and decorative iPhone hardware controls.

- [ ] **Step 1: Update the hero alignment and overflow behavior**

Use top alignment on large screens and allow the section to grow with its phone visual. Keep the existing single-screen minimum height as a minimum only.

- [ ] **Step 2: Compact the demo controls without changing their options**

Keep all industry tabs, mode tabs, and client labels, but place the mode selector and client label in one wrapping control row to reduce vertical pressure above the phone.

- [ ] **Step 3: Convert the phone into a responsive flex column**

Give the outer frame a `clamp()` height capped at a realistic iPhone size, make the inner screen fill the frame, and let only the chat thread consume flexible height and scroll.

- [ ] **Step 4: Add decorative iPhone hardware controls**

Add absolute, pointer-inert controls for action/silent, volume up/down, power, and bottom speaker/USB-C details. Mark the controls decorative for assistive technology.

### Task 3: Verify behavior and visual layout

**Files:**
- No additional files.

**Interfaces:**
- Consumes: Updated hero and phone layout.
- Produces: Verified tests, type safety, lint cleanliness, production build, and desktop visual inspection.

- [ ] **Step 1: Run focused hero tests**

Run: `pnpm vitest run src/components/sections/home/hero.test.tsx --maxWorkers=1`

- [ ] **Step 2: Run project checks**

Run: `pnpm typecheck`, `pnpm lint`, and `pnpm vitest run --maxWorkers=1`.

- [ ] **Step 3: Build the production bundle**

Run: `pnpm build` and confirm it exits successfully without hydration or font warnings.

- [ ] **Step 4: Inspect the desktop hero at a short and tall viewport**

Confirm the full phone frame and side controls are visible within the document layout, the phone does not get clipped by the hero, and chat text remains readable.
