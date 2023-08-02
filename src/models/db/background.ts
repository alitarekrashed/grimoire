import { AttributeModifier } from './ancestry'
import { EntityModel } from './entity-model'

export interface Background extends EntityModel {
  attributes: AttributeModifier[][]
  skills: ProficiencyFeatureValue[]
  feat: string
}

export type ProficiencyType = 'Lore' | 'Skill'
export type ProficiencyRank = 'trained'

export interface ProficiencyFeatureValue {
  type: ProficiencyType
  value: string
  rank: ProficiencyRank
}
