import { Activation } from './activation'
import { EntityModel } from './entity-model'

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
