# Plan: Edit vs Play Mode Toggle

## Phase 1: Foundation & Library Setup [checkpoint: 7ba256b]
- [x] Task: Install and Configure Shadcn & Utils [f7e190a]
    - [x] Initialize shadcn-ui using `npx shadcn@latest init`.
    - [x] Install required components: `Switch`, `Badge`.
    - [x] Install `react-easy-edit`.
- [x] Task: Define Mode State and Storage Utility [df1c642]
    - [x] Write tests for mode persistence in `persistence.test.ts`.
    - [x] Implement `getMode` / `saveMode` in `src/lib/persistence.ts`.
- [x] Task: Conductor - User Manual Verification 'Foundation & Library Setup' (Protocol in workflow.md)

## Phase 2: Refactor for Easy-Edit & Read-Only [checkpoint: c59c1b2]
- [x] Task: Refactor EditableTextarea with `react-easy-edit` [custom]
    - [x] Update `EditableTextarea` to use `react-easy-edit` for inline editing.
    - [x] Implement the `isReadOnly` toggle within the new component structure.
- [x] Task: Apply Mode to All Inputs [9ebf628]
    - [x] Update `App.tsx` and character sections to pass `isPlayMode` down to all editable fields.
    - [x] Update global CSS in `index.css` to hide dashed borders when not in edit mode.
- [x] Task: Conductor - User Manual Verification 'Refactor & Read-Only' (Protocol in workflow.md)

## Phase 3: Play-Mode Interactions
- [~] Task: Implement the Global Toggle with Shadcn
    - [ ] Create a `ModeSelector` component using Shadcn Switch and Badges.
    - [ ] Place it in the top-right of the datafile and hook up to global state.
- [ ] Task: Enable Trait Clicking
    - [ ] Write tests for trait clicking behavior in Play Mode.
    - [ ] Update `DieIcon` and trait name fields to trigger a new `onTraitClick` callback when in Play Mode.
- [ ] Task: Conductor - User Manual Verification 'Play-Mode Interactions' (Protocol in workflow.md)

## Phase 4: Integration & Polish
- [ ] Task: Assembler Integration
    - [ ] Update `Assembler` state to support dice with custom labels/names.
    - [ ] Implement the logic to catch trait clicks and add the corresponding labeled die to the pool.
- [ ] Task: Visual Polish
    - [ ] Add `cursor-pointer` and hover highlights to all clickable traits in Play Mode.
- [ ] Task: Conductor - User Manual Verification 'Integration & Polish' (Protocol in workflow.md)
