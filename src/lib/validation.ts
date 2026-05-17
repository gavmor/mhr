import { z } from 'zod';

const stepDieSchema = z.enum(['4', '6', '8', '10', '12']);
const stressLimitSchema = z.number().int().min(0).max(12);

const powerSchema = z.object({
  id: z.string(),
  die: stepDieSchema,
  name: z.string()
}).strict();

const sfxSchema = z.object({
  id: z.string(),
  type: z.string(),
  name: z.string(),
  desc: z.string()
}).strict();

const powerSetSchema = z.object({
  id: z.string(),
  name: z.string(),
  powers: z.array(powerSchema),
  sfx: z.array(sfxSchema)
}).strict();

const specialtySchema = z.object({
  id: z.string(),
  die: stepDieSchema,
  name: z.string()
}).strict();

const milestoneSchema = z.object({
  id: z.string(),
  name: z.string(),
  xp1: z.string(),
  xp3: z.string(),
  xp10: z.string()
}).strict();

export const characterSchema = z.object({
  heroName: z.string().min(1),
  realName: z.string(),
  identityStatus: z.string(),
  portrait: z.string().nullable(),
  affiliations: z.array(stepDieSchema),
  distinctions: z.array(z.string()),
  xp: z.number().int().min(0),
  pp: z.number().int().min(0),
  stress: z.object({
    p: stressLimitSchema,
    m: stressLimitSchema,
    e: stressLimitSchema
  }).strict(),
  powerSets: z.array(powerSetSchema),
  specialties: z.array(specialtySchema),
  milestones: z.array(milestoneSchema)
}).strict();

export type Power = z.infer<typeof powerSchema>;
export type SFX = z.infer<typeof sfxSchema>;
export type PowerSet = z.infer<typeof powerSetSchema>;
export type Specialty = z.infer<typeof specialtySchema>;
export type Milestone = z.infer<typeof milestoneSchema>;
export type CharacterDataValidation = z.infer<typeof characterSchema>;
