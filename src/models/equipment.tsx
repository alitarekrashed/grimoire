import { EntityModel } from './entity-model'

export interface Equipment extends EntityModel {
  category: 'Adventuring Gear' | 'Potion' | 'Worn Item'
  price: Currency[]
  level: number
  bulk?: 'L'
  hands?: number
  usage?: 'held in 1 hand' | 'worn mask'
  traits?: string[] // eventually Trait object
  activation?: Activation
  rarity?: 'uncommon' | 'rariry'
}

export interface EquipmentWithVariants extends EntityModel {
  category: 'Adventuring Gear' | 'Potion' | 'Worn Item'
  bulk?: 'L'
  hands?: number
  usage?: 'held in 1 hand' | 'worn mask'
  traits?: string[] // eventually Trait object
  activation?: Activation
  types: EquipmentVariantType[]
  rarity?: string
}

export interface Activation {
  num_actions: 'single'
  action: 'Interact'
}

export interface Currency {
  value: number
  type: 'gp'
}

export interface EquipmentVariantType {
  name: string
  price: Currency[]
  level: number
  description: string
}
