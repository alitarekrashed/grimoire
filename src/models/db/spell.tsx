import { Activation, SavingThrow } from './activation'
import { EntityModel } from './entity-model'

export type Tradition = 'arcane' | 'primal' | 'divine' | 'occult'
export type HeightenedType = 'formula' | 'explicit'

export interface Spell extends EntityModel {
  short_description?: string
  rank: number
  rarity?: string
  focus?: string
  traits: string[]
  traditions: Tradition[]
  activation: Activation
  saving_throw?: SavingThrow
  heightened: HeightenedDefinition
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
