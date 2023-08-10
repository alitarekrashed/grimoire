import { SourcedFeature } from '../player-character'
import { Attribute } from './ancestry'
import { ProficiencyRank } from './background'

export type FeatureType =
  | 'SENSE'
  | 'MISC'
  | 'RESISTANCE'
  | 'ACTION'
  | 'CONDITIONAL'
  | 'PROFICIENCY'
  | 'LANGUAGE'
  | 'MODIFIER'
  | 'FEAT'
  | 'SKILL_SELECTION'
  | 'CLASS_FEAT_SELECTION'
export type CalculationFormula = 'half-level'
export type ConditionalOperator = 'has'
export type ModifierType = 'Perception' | 'Speed'

export interface Feature {
  type: FeatureType
  value: any
}

export interface ModifierFeatureValue {
  type: ModifierType
  condition?: 'string'
  modifier: {
    value: number
    type?: 'circumstance'
  }
}

export interface ResistanceFeatureValue {
  damage_type: string
  minimum: number
  formula: CalculationFormula
}

export interface ConditionalFeatureValue {
  default: Feature
  matched: Feature
  condition: Conditional
}

export interface Conditional {
  operator: ConditionalOperator
  operand: Feature
}

export interface SkillSelectionFeatureValue {
  configuration: SkillSelectionConfiguration
  value: string[]
}

export interface SkillSelectionConfiguration {
  options: string[] | 'Free'
  max_rank: ProficiencyRank
  formula?: (number | Attribute)[]
}

export function featureMatcher(other: SourcedFeature) {
  switch (other.feature.type) {
    case 'RESISTANCE':
      return (val: SourcedFeature) => {
        const resistance: ResistanceFeatureValue = val.feature
          .value as ResistanceFeatureValue
        return (
          resistance.damage_type === resistance.damage_type &&
          val.feature.type === other.feature.type
        )
      }
    default:
      return (val: SourcedFeature) =>
        val.feature.value === other.feature.value &&
        val.feature.type === other.feature.type
  }
}
