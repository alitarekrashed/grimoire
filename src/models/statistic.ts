import { Attribute } from './db/ancestry'
import { ProficiencyRank } from './proficiency-rank'

export type SavingThrowType = 'Reflex' | 'Will' | 'Fortitude'
export type SkillType =
  | 'Acrobatics'
  | 'Arcana'
  | 'Athletics'
  | 'Crafting'
  | 'Deception'
  | 'Diplomacy'
  | 'Intimidation'
  | 'Lore'
  | 'Medicine'
  | 'Nature'
  | 'Occultism'
  | 'Performance'
  | 'Religion'
  | 'Society'
  | 'Stealth'
  | 'Survival'
  | 'Thievery'

const savingThrowAttributes: [SavingThrowType, Attribute][] = [
  ['Reflex', 'Dexterity'],
  ['Fortitude', 'Constitution'],
  ['Will', 'Wisdom'],
]
export const SavingThrowAttributes: Map<SavingThrowType, Attribute> = new Map(
  savingThrowAttributes
)

const skillAttributes: [SkillType, Attribute][] = [
  ['Acrobatics', 'Dexterity'],
  ['Arcana', 'Intelligence'],
  ['Athletics', 'Strength'],
  ['Crafting', 'Intelligence'],
  ['Deception', 'Charisma'],
  ['Diplomacy', 'Charisma'],
  ['Intimidation', 'Charisma'],
  ['Medicine', 'Wisdom'],
  ['Nature', 'Wisdom'],
  ['Occultism', 'Intelligence'],
  ['Performance', 'Charisma'],
  ['Religion', 'Wisdom'],
  ['Society', 'Intelligence'],
  ['Stealth', 'Dexterity'],
  ['Survival', 'Wisdom'],
  ['Thievery', 'Dexterity'],
]

export const SkillAttributes: Map<SkillType, Attribute> = new Map(
  skillAttributes
)

export interface CalculatedProficiency {
  rank: ProficiencyRank
  modifier: number
}

export function generateUntrainedSkillMap(): Map<SkillType, ProficiencyRank> {
  const result = new Map()
  skillAttributes.forEach((value) => {
    result.set(value[0], ProficiencyRank.UNTRAINED)
  })
  return result
}
