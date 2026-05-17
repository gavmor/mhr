# Plan: Enhanced Print PDF Styles

## Phase 1: Basic Print Infrastructure [checkpoint: b40ae6a]
- [x] Task: Identify and tag elements for print exclusion [28cc723]
    - [x] Locate titlebar, navigation, toggles, and action buttons.
- [x] Task: Implement `@media print` base overrides in `src/index.css` [23adfdf]
    - [x] Hide identified UI elements using `display: none`.
    - [x] Ensure the main application container allows full-page printing without scrollbars.
- [x] Task: Conductor - User Manual Verification 'Basic Print Infrastructure' (Protocol in workflow.md)

## Phase 2: Datafile Print Formatting [checkpoint: d4b992d]
- [x] Task: Apply "Clean & Minimal" visual overrides [01c200e]
    - [x] Force `background-color: white` and `color: black` for all printed elements.
    - [x] Simplify borders (remove shadow-comic and excessive thickness).
    - [x] Ensure `Bangers` and `Oswald` fonts are optimized for print legibility.
- [x] Task: Optimize page layout and alignment [01c200e]
    - [x] Center the Datafile using margin/padding adjustments.
    - [x] Set a fixed width optimized for A4/Letter (approx 800px).
    - [x] Implement `@page` rules for margin management.
- [x] Task: Conductor - User Manual Verification 'Datafile Print Formatting' (Protocol in workflow.md)

## Phase 3: Validation & Polish
- [ ] Task: Final cross-browser print verification
    - [ ] Test layout in Chrome/Edge and Safari print previews.
- [ ] Task: Conductor - User Manual Verification 'Validation & Polish' (Protocol in workflow.md)
