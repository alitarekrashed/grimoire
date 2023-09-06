import { ProficiencyRank } from '../proficiency-rank'
import { WeaponCategory, WeaponGroup } from '../weapon-models'
import { AttributeModifier } from './ancestry'
import { ArmorCategory, ArmorGroup } from './character-entity'
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

export interface ProficiencyFeatureValue {
  type: ProficiencyType
  value: string
  rank: string
}

export interface WeaponProficiencyValue {
  category?: WeaponCategory
  group?: WeaponGroup
  weapon?: string
}

export interface ArmorProficiencyValue {
  category?: ArmorCategory
  group?: ArmorGroup
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
      sword: ProficiencyRank.UNTRAINED,
      spear: ProficiencyRank.UNTRAINED,
      sling: ProficiencyRank.UNTRAINED,
      shield: ProficiencyRank.UNTRAINED,
      polearm: ProficiencyRank.UNTRAINED,
      pick: ProficiencyRank.UNTRAINED,
      knife: ProficiencyRank.UNTRAINED,
      hammer: ProficiencyRank.UNTRAINED,
      flail: ProficiencyRank.UNTRAINED,
      firearm: ProficiencyRank.UNTRAINED,
      dart: ProficiencyRank.UNTRAINED,
      club: ProficiencyRank.UNTRAINED,
      brawling: ProficiencyRank.UNTRAINED,
      bow: ProficiencyRank.UNTRAINED,
      bomb: ProficiencyRank.UNTRAINED,
      axe: ProficiencyRank.UNTRAINED,
    }
  }
  return {
    simple: getProfs(),
    martial: getProfs(),
    advanced: getProfs(),
    unarmed: ProficiencyRank.UNTRAINED,
  }
}
