import { AttributeModifier } from './ancestry'
import { WeaponCategory, WeaponGroup } from './character-entity'
import { EntityModel } from './entity-model'

export interface Background extends EntityModel {
  attributes: AttributeModifier[][]
  skills: ProficiencyFeatureValue[]
  feat: string
}

export type ProficiencyType =
  | 'Lore'
  | 'Skill'
  | 'Perception'
  | 'SavingThrow'
  | 'Weapon'
  | 'Defense'
  | 'DifficultyClass'
export type ProficiencyRank = 'untrained' | 'trained' | 'expert'

export const RankModifierMap = {
  untrained: 0,
  trained: 2,
  expert: 4,
}

export interface ProficiencyFeatureValue {
  type: ProficiencyType
  value: string
  rank: ProficiencyRank
}

export interface WeaponProficiencyValue {
  category?: WeaponCategory
  group?: WeaponGroup
}

export interface WeaponProficiencies {
  simple: WeaponGroupProficiencies
  martial: WeaponGroupProficiencies
  advanced: WeaponGroupProficiencies
  unarmed: ProficiencyRank
}

export interface WeaponGroupProficiencies {
  sword: ProficiencyRank
  spear: ProficiencyRank
  sling: ProficiencyRank
  shield: ProficiencyRank
  polearm: ProficiencyRank
  pick: ProficiencyRank
  knife: ProficiencyRank
  hammer: ProficiencyRank
  flail: ProficiencyRank
  firearm: ProficiencyRank
  dart: ProficiencyRank
  club: ProficiencyRank
  brawling: ProficiencyRank
  bow: ProficiencyRank
  bomb: ProficiencyRank
  axe: ProficiencyRank
}

export function getUntrainedWeaponProficiences(): WeaponProficiencies {
  const getProfs = () => {
    return {
      sword: 'untrained' as ProficiencyRank,
      spear: 'untrained' as ProficiencyRank,
      sling: 'untrained' as ProficiencyRank,
      shield: 'untrained' as ProficiencyRank,
      polearm: 'untrained' as ProficiencyRank,
      pick: 'untrained' as ProficiencyRank,
      knife: 'untrained' as ProficiencyRank,
      hammer: 'untrained' as ProficiencyRank,
      flail: 'untrained' as ProficiencyRank,
      firearm: 'untrained' as ProficiencyRank,
      dart: 'untrained' as ProficiencyRank,
      club: 'untrained' as ProficiencyRank,
      brawling: 'untrained' as ProficiencyRank,
      bow: 'untrained' as ProficiencyRank,
      bomb: 'untrained' as ProficiencyRank,
      axe: 'untrained' as ProficiencyRank,
    }
  }
  return {
    simple: getProfs(),
    martial: getProfs(),
    advanced: getProfs(),
    unarmed: 'untrained',
  }
}
