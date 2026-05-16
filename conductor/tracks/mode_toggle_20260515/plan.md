# Plan: Edit vs Play Mode Toggle

## Phase 1: Foundation & Shadcn Setup
- [ ] Task: Install and Configure Shadcn UI
    - [ ] Initialize shadcn-ui using `npx shadcn@latest init`.
    - [ ] Install required components: `Switch`, `Badge`.
- [ ] Task: Define Mode State and Storage Utility
    - [ ] Write tests for mode persistence in `persistence.test.ts`.
    - [ ] Implement `getMode` / `saveMode` in `src/lib/persistence.ts`.
- [ ] Task: Conductor - User Manual Verification 'Foundation & Shadcn Setup' (Protocol in workflow.md)

## Phase 2: Read-Only Datafile
- [ ] Task: Implement Input Locking
    - [ ] Write tests for `EditableTextarea` read-only behavior in `EditableTextarea.test.tsx`.
    - [ ] Update `EditableTextarea` to accept an `isReadOnly` prop and prevent interaction.
- [ ] Task: Apply Mode to All Inputs
    - [ ] Update `App.tsx` and character sections to pass `isPlayMode` down to all editable fields.
    - [ ] Update global CSS in `index.css` to hide dashed borders when not in edit mode.
- [ ] Task: Conductor - User Manual Verification 'Read-Only Datafile' (Protocol in workflow.md)

## Phase 3: Play-Mode Interactions
- [ ] Task: Implement the Global Toggle with Shadcn
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
