# Specification: Edit vs Play Mode Toggle

## Overview
The goal is to implement a global "Edit" vs "Play" mode toggle for the Character Sheet. This mode shift allows users to transition from character creation (editing text and values) to active gameplay (building dice pools by clicking traits).

## Functional Requirements
- **Global Toggle**: A prominent toggle switch or button located in the top-right corner of the Datafile component.
- **Edit Mode (Default)**:
    - All text fields are editable.
    - Die icons cycle values on click.
    - Standard UI feedback (dashed borders on hover).
- **Play Mode**:
    - **Input Locking**: All text inputs and textareas are disabled or set to `read-only`, preventing keyboard focus and accidental edits.
    - **Interactive Traits**: Clicking on any trait name or its associated die icon will **add** that die to the Dice Pool Assembler.
    - **Labeled Dice**: Dice added to the assembler in this mode should carry the label of the clicked trait (e.g., clicking the 'd8' next to 'Buddy' adds a 'd8' labeled 'Buddy' to the Affiliation pool).
    - **Visual Indicators**:
        - Cursor changes to `pointer` over all trait blocks.
        - Sublte hover highlight on trait blocks to indicate clickability.
        - "Read-only" styling: Remove dashed borders from inputs to simplify the look.
- **Persistence**: The current mode (Edit or Play) must be persisted in `localStorage`.

## Non-Functional Requirements
- **State Synchronization**: Ensure the "Play" mode state is accessible to all character sheet sub-sections and the Assembler.
- **Performance**: Clicking traits should provide immediate feedback in the Assembler.

## Acceptance Criteria
- Toggling the mode button instantly switches input behaviors.
- In Play mode, clicking a Power adds its die and name to the Assembler.
- The mode state survives a page refresh.
- The UI clearly distinguishes between the two modes (e.g., "EDITING" vs "PLAYING").

## Out of Scope
- Automated dice rolling (calculating results).
- Complexity tracking for labeled dice (just simple name labels for now).
