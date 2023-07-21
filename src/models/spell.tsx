import { EntityModel } from './entity-model'
import { Activation } from './equipment'

export type Tradition = 'arcane' | 'primal' | 'divine' | 'occult'
export type RangeUnit = 'feet'
export type Targets = '1 or 2 creatures'
export type SavingThrowType = 'basic Reflex'

export interface Spell extends EntityModel {
  rank: number
  rarity?: string
  traits: string[]
  traditions: Tradition[]
  activation: Activation
  saving_throw: SavingThrowType
  heightened: HeightenedFormula
}

export interface RangeDefinition {
  value: number
  unit: RangeUnit
}

export interface HeightenedFormula {
  level_modifier: number
  description: string
}
