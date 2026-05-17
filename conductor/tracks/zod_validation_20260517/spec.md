# Specification: Zod JSON Import Validation

## Overview
Introduce a Zod schema to validate character JSON files during import. This ensures that the application only accepts properly formatted and valid Marvel Heroic Roleplaying character data, preventing runtime errors and corrupted state.

## Functional Requirements
- **Zod Schema Definition:** Create a comprehensive Zod schema representing the application's Character data structure.
- **Strict Validation:** The schema must run in "Strict Mode", rejecting any JSON files that contain unrecognized or extraneous properties.
- **Robust Field Rules:**
  - **Dice Values:** Validate that all dice fields are restricted to valid MHR step dice (4, 6, 8, 10, 12).
  - **Stress/Trauma:** Validate that stress and trauma track values stay within their allowed limits.
- **Detailed Error Handling:** When an import fails validation, the application must provide specific, detailed error feedback to the user, identifying exactly which fields failed and why.
- **Import Interception:** Integrate the schema validation into the existing JSON import workflow, aborting the import and displaying errors before any application state is mutated.

## Non-Functional Requirements
- **Type Safety:** The Zod schema should ideally be used to infer or enforce TypeScript types for the character data, aligning with the existing project types.
- **Dependency:** Add `zod` as a project dependency.

## Acceptance Criteria
- [ ] Attempting to import a completely valid JSON character file succeeds.
- [ ] Attempting to import a JSON file with missing required fields fails, and the user sees an error specifying the missing fields.
- [ ] Attempting to import a JSON file with invalid dice values (e.g., 5, 7) fails with a specific error message.
- [ ] Attempting to import a JSON file with extra, unrecognized properties fails (Strict Mode enforced).
- [ ] Attempting to import a JSON file with invalid stress/trauma values fails.
- [ ] Existing character data is not modified if an import fails validation.

## Out of Scope
- Validating the logical consistency of a character build (e.g., checking if power sets make thematic sense).
- Providing an interactive UI to fix the errors directly; the user must fix the file and re-import.