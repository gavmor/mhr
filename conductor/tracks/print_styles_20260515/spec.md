# Specification: Enhanced Print PDF Styles

## Overview
The goal of this track is to implement a high-quality, professional print stylesheet for the Hero Datafile. The current print output includes unnecessary web UI elements and uses an unoptimized layout for physical paper.

## Functional Requirements
- **Print-Only Media Queries**: Implement `@media print` styles in `src/index.css`.
- **UI Chrome Removal**: Automatically hide the following elements when printing:
    - Global "MARVEL HEROIC ROLEPLAYING" titlebar.
    - Navigation tabs/panel (Mobile/Desktop view toggles).
    - "Edit / Play" mode toggle.
    - Footer action buttons (RESET DATA, IMPORT / EXPORT, PRINT PDF).
- **Ink-Friendly "Clean & Minimal" Styling**:
    - Force white backgrounds for all panels.
    - Use standard black borders (no drop shadows or 3D effects).
    - Ensure all text is high-contrast black on white.
- **Layout Optimization**:
    - Center the Datafile on the page.
    - Use a fixed-width container optimized for standard paper sizes (A4/Letter).
    - Ensure no elements are clipped at page margins.
- **Content Scope**: 
    - Render only the Character Datafile section.
    - Exclude the active Dice Pool Assembler from the print output.

## Acceptance Criteria
- Clicking "PRINT PDF" opens a print preview where the titlebar and buttons are hidden.
- The resulting sheet is monochromatic/grayscale and uses solid borders.
- The Hero Name and traits are clearly legible and properly centered.
- No scrollbars or web-specific artifacts (like cursor highlights) appear in the output.

## Out of Scope
- Multi-page reflow logic (assuming character fits on one page).
- Interactive PDF forms (print only).
