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

export function featureMatcher(other: Feature) {
  switch (other.type) {
    case 'RESISTANCE':
      return (val: Feature) => {
        const resistance: ResistanceFeatureValue =
          val.value as ResistanceFeatureValue
        return (
          resistance.damage_type === resistance.damage_type &&
          val.type === other.type
        )
      }
    default:
      return (val: Feature) =>
        val.value === other.value && val.type === other.type
  }
}
