# Plan: Enhanced Print PDF Styles

## Phase 1: Basic Print Infrastructure
- [ ] Task: Identify and tag elements for print exclusion
    - [ ] Locate titlebar, navigation, toggles, and action buttons.
- [ ] Task: Implement `@media print` base overrides in `src/index.css`
    - [ ] Hide identified UI elements using `display: none`.
    - [ ] Ensure the main application container allows full-page printing without scrollbars.
- [ ] Task: Conductor - User Manual Verification 'Basic Print Infrastructure' (Protocol in workflow.md)

## Phase 2: Datafile Print Formatting
- [ ] Task: Apply "Clean & Minimal" visual overrides
    - [ ] Force `background-color: white` and `color: black` for all printed elements.
    - [ ] Simplify borders (remove shadow-comic and excessive thickness).
    - [ ] Ensure `Bangers` and `Oswald` fonts are optimized for print legibility.
- [ ] Task: Optimize page layout and alignment
    - [ ] Center the Datafile using margin/padding adjustments.
    - [ ] Set a fixed width optimized for A4/Letter (approx 800px).
    - [ ] Implement `@page` rules for margin management.
- [ ] Task: Conductor - User Manual Verification 'Datafile Print Formatting' (Protocol in workflow.md)

## Phase 3: Validation & Polish
- [ ] Task: Final cross-browser print verification
    - [ ] Test layout in Chrome/Edge and Safari print previews.
- [ ] Task: Conductor - User Manual Verification 'Validation & Polish' (Protocol in workflow.md)
