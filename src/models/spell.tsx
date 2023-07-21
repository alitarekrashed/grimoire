import { EntityModel } from './entity-model'

export type Tradition = 'arcane' | 'primal' | 'divine' | 'occult'
export type RangeUnit = 'feet'
export type Targets = '1 or 2 creatures'
export type SavingThrowType = 'basic Reflex'

export interface Spell extends EntityModel {
  traits: string[]
  traditions: Tradition[]
  range: Range
  targets: Targets
  saving_throw: SavingThrowType
  heightened: HeightenedFormula
}

export interface Range {
  value: number
  unit: RangeUnit
}

export interface HeightenedFormula {
  level_modifier: number
  description: string
}
