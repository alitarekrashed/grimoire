import { EntityModel } from './entity-model'

export type EquipmentCategory = 'Adventuring Gear' | 'Potion' | 'Worn Item'
export type Bulk = 'L'
export type EquipmentUsage = 'held in 1 hand' | 'worn mask' | 'worn cloak'
export type Rarity = 'uncommon' | 'rare'
export type ActionName = 'Interact'
export type ActionType = 'single'
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
