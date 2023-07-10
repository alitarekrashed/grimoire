// TODO really need to add an id here and update iterator keys to use that id
export interface Equipment {
  name: string
  description: string
  price: string // refactor to allow multiple types of currencies?
  bulk?: string // enum?
  level: number
  source: string // should allow for book + pages?
  category: string // enum e.g. Adventuring Gear
  hands?: string // enum? one-handed, two-handed, no hands?
  usage?: string
  traits?: string[] // enum?
  activation?: {
    numActions: number // 1-3?
    action: string // enum?
  }
}
