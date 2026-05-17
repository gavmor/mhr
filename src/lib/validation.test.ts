import { describe, it, expect } from 'vitest';
import { characterSchema } from './validation';

describe('Zod JSON Import Validation', () => {
  const validCharacter = {
    heroName: "HERO NAME",
    realName: "Real Name",
    identityStatus: "secret",
    portrait: null,
    affiliations: ['8', '6', '10'],
    distinctions: ["DISTINCTION 1", "DISTINCTION 2", "DISTINCTION 3"],
    xp: 0,
    pp: 1,
    stress: { p: 0, m: 0, e: 0 },
    powerSets: [
      {
        id: "abc",
        name: "POWER SET",
        powers: [{ id: "def", die: "8", name: "POWER" }],
        sfx: [{ id: "ghi", type: "SFX:", name: "Name.", desc: "Desc." }]
      }
    ],
    specialties: [
      { id: "jkl", die: "8", name: "SPECIALTY" }
    ],
    milestones: [
      {
        id: "mno",
        name: "MILESTONE",
        xp1: "1",
        xp3: "3",
        xp10: "10"
      }
    ]
  };

  it('succeeds with a completely valid JSON character file', () => {
    const result = characterSchema.safeParse(validCharacter);
    expect(result.success).toBe(true);
  });

  it('fails when required fields are missing', () => {
    const invalid = { ...validCharacter };
    delete (invalid as any).heroName;
    const result = characterSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('fails with invalid dice values', () => {
    const invalidPowers = { ...validCharacter, powerSets: [{ ...validCharacter.powerSets[0], powers: [{ id: "def", die: "7", name: "POWER" }] }] };
    const resultPowers = characterSchema.safeParse(invalidPowers);
    expect(resultPowers.success).toBe(false);

    const invalidAffiliations = { ...validCharacter, affiliations: ['8', '6', '7'] };
    const resultAff = characterSchema.safeParse(invalidAffiliations);
    expect(resultAff.success).toBe(false);
  });

  it('fails when extra unrecognized properties exist (Strict Mode)', () => {
    const invalid = { ...validCharacter, someExtraProperty: "hi" };
    const result = characterSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('fails with invalid stress/trauma values', () => {
    const invalidStress = { ...validCharacter, stress: { p: 14, m: 0, e: 0 } };
    const result = characterSchema.safeParse(invalidStress);
    expect(result.success).toBe(false);
    
    const invalidStressNeg = { ...validCharacter, stress: { p: -2, m: 0, e: 0 } };
    const resultNeg = characterSchema.safeParse(invalidStressNeg);
    expect(resultNeg.success).toBe(false);
  });
});
