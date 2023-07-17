import { EntityModel } from './entity-model'

export type EquipmentCategory = 'Adventuring Gear' | 'Potion' | 'Worn Item'
export type Bulk = 'L'
export type EquipmentUsage = 'held in 1 hand' | 'worn mask'
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
  action: ActionName
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
