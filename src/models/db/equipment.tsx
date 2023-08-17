import { Activation, SavingThrow } from './activation'
import { ArmorDefinition, WeaponDefinition } from './character-entity'
import { EntityModel } from './entity-model'

export type EquipmentCategory =
  | 'Adventuring Gear'
  | 'Potion'
  | 'Worn Item'
  | 'Fulu'
  | 'Alchemical Foods'
  | 'Held Item'
  | 'Weapon'
  | 'Armor'
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
  saving_throw?: SavingThrow
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
  saving_throw?: SavingThrow
  rarity?: Rarity
}

export interface Armor extends Equipment {
  properties: ArmorDefinition
}

export interface Weapon extends Equipment {
  properties: WeaponDefinition
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
