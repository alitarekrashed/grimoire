// TODO really need to add an id here and update iterator keys to use that id
export interface Equipment {
  id: string
  name: string
  description: string
  source: Source // should this store an array? for items appearing in multiple sources?
  category: string // enum e.g. Adventuring Gear
  price?: Currency[] // refactor to allow multiple types of currencies?
  level?: number
  bulk?: string // enum?
  hands?: string // enum? one-handed, two-handed, no hands?
  usage?: string
  traits?: string[] // enum?
  activation?: {
    numActions: number // 1-3?
    action: string // enum?
  }
  types?: EquipmentVariantType[]
  rarity?: string // enum?
}

export interface Currency {
  value: number
  type: string // enum: gp, sp, cp, pp
}

export interface Source {
  title: string
  page?: string
}

export interface EquipmentVariantType {
  name: string
  price: Currency[]
  level: number
  description: string
}
