export type FeatureType =
  | 'SENSE'
  | 'MISC'
  | 'RESISTANCE'
  | 'ACTION'
  | 'CONDITIONAL'
export type CalculationFormula = 'half-level'
export type ConditionalOperator = 'has'

export interface Feature {
  type: FeatureType
  value: any
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
