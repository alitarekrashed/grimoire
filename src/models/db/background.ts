import { AttributeModifier } from './ancestry'
import { EntityModel } from './entity-model'

export interface Background extends EntityModel {
  attributes: AttributeModifier[][]
  skills: ProficiencyFeatureValue[]
  feat: string
}

export type ProficiencyType = 'Lore' | 'Skill' | 'Perception' | 'SavingThrow'
export type ProficiencyRank = 'trained' | 'expert'

export interface ProficiencyFeatureValue {
  type: ProficiencyType
  value: string
  rank: ProficiencyRank
}
