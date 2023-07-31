export type FeatureType = 'SENSE' | 'MISC'
export type CalculationFormula = 'half-level'

export interface Feature {
  type: FeatureType
  value: any
}

export interface ResistanceFeatureValue {
  damage_type: string
  minimum: number
  formula: CalculationFormula
}
