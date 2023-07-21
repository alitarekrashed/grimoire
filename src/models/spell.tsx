import { EntityModel } from './entity-model'
import { Activation } from './equipment'

export type Tradition = 'arcane' | 'primal' | 'divine' | 'occult'
export type RangeUnit = 'feet'
export type AreaUnit = 'emanataion'
export type Targets = '1 or 2 creatures'
export type SavingThrowType = 'basic Reflex'
export type HeightenedType = 'formula' | 'explicit'

export interface Spell extends EntityModel {
  rank: number
  rarity?: string
  traits: string[]
  traditions: Tradition[]
  activation: Activation
  saving_throw?: SavingThrowType
  heightened: HeightenedDefinition
}

export interface RangeDefinition {
  value: number
  unit: RangeUnit
}

export interface AreaDefinition {
  value: number
  unit: AreaUnit
}

export interface HeightenedDefinition {
  type: HeightenedType
  value: HeightenedExplicit[] | HeightenedFormula
}

export interface HeightenedExplicit {
  level: number
  description: string
}

export interface HeightenedFormula {
  level_modifier: number
  description: string
}
