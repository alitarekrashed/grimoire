import { EntityModel } from './entity-model'
import { AreaDefinition, RangeDefinition, Targets } from './spell'

export type EquipmentCategory =
  | 'Adventuring Gear'
  | 'Potion'
  | 'Worn Item'
  | 'Fulu'
  | 'Alchemical Foods'
export type Bulk = 'L'
export type EquipmentUsage =
  | 'held in 1 hand'
  | 'worn mask'
  | 'worn cloak'
  | 'affixed to armor'
  | 'held in 2 hands'
export type Rarity = 'uncommon' | 'rare'
export type ActionName = 'Interact' | 'Cast a Spell'
export type ActionType =
  | 'one'
  | 'two'
  | 'three'
  | 'reaction'
  | 'free'
  | '10 minutes'
export type CurrencyType = 'gp'

export interface Equipment extends EntityModel {
  category: EquipmentCategory
  price: Currency[]
  level: number
  bulk?: Bulk
  hands?: number
  usage?: EquipmentUsage
  traits?: string[] // eventually Trait object
  activation?: Activation
  rarity?: Rarity
}

export interface EquipmentWithVariants extends EntityModel {
  category: EquipmentCategory
  bulk?: Bulk
  hands?: number
  usage?: EquipmentUsage
  traits?: string[] // eventually Trait object
  activation?: Activation
  types: EquipmentVariantType[]
  rarity?: Rarity
}

export interface Activation {
  num_actions: ActionType
  action?: ActionName
  traits?: string[]
  frequency?: string // should this be an enum?
  trigger?: string
  effect?: Effect
  targets?: Targets
  range?: RangeDefinition
  area?: AreaDefinition
  override_label?: string
}

export interface Effect {
  description: string
  saving_throw?: SavingThrow
}

export interface SavingThrow {
  critical_success?: string
  success?: string
  failure?: string
  critical_failure?: string
}

export interface Currency {
  value: number
  type: CurrencyType
}

export interface EquipmentVariantType {
  name: string
  price: Currency[]
  level: number
  description: string
}
