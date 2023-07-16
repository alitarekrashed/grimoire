import { EntityModel } from './entity-model'

// TODO really need to add an id here and update iterator keys to use that id
export interface Equipment extends EntityModel {
  category: string // enum e.g. Adventuring Gear
  price: Currency[] // refactor to allow multiple types of currencies?
  level: number
  bulk?: string // enum?
  hands?: string // enum? one-handed, two-handed, no hands?
  usage?: string
  traits?: string[] // enum?
  activation?: {
    numActions: number // 1-3?
    action: string // enum?
  }
  rarity?: string // enum?
}

export interface EquipmentWithVariant extends EntityModel {
  category: string // enum e.g. Adventuring Gear
  bulk?: string // enum?
  hands?: string // enum? one-handed, two-handed, no hands?
  usage?: string
  traits?: string[] // enum?
  activation?: {
    numActions: number // 1-3?
    action: string // enum?
  }
  types: EquipmentVariantType[]
  rarity?: string
}

export interface Currency {
  value: number
  type: string // enum: gp, sp, cp, pp
}

export interface EquipmentVariantType {
  name: string
  price: Currency[]
  level: number
  description: string
}
