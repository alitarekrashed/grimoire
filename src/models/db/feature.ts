import { SourcedFeature } from '../player-character'
import { Attribute } from './ancestry'
import { ProficiencyRank } from './background'

export type FeatureType =
  | 'SENSE'
  | 'MISC'
  | 'RESISTANCE'
  | 'VULNERABILITY'
  | 'ACTION'
  | 'CONDITIONAL'
  | 'PROFICIENCY'
  | 'LANGUAGE'
  | 'MODIFIER'
  | 'OVERRIDE'
  | 'FEAT'
  | 'SKILL_SELECTION'
  | 'FEAT_SELECTION'
  | 'SUBCLASS'
  | 'SUBCLASS_FEATURE'
export type CalculationFormula = 'half-level'
export type ConditionalOperator = 'has'
export type ModifierType = 'Perception' | 'Speed' | 'AttackDamage'

export interface Feature {
  type: FeatureType
  name?: string
  value: any
  context?: string[]
}

export interface MiscFeatureValue {
  value: { description: string }
}

export interface OverrideFeatureValue {
  type: 'Attack'
  name: string
  dice: string
}

export interface ModifierFeatureValue {
  type: ModifierType
  condition?: 'string'
  context?: any
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
