import { ObjectId } from 'mongodb'
import { EntityModel } from './entity-model'

export type Attribute =
  | 'Strength'
  | 'Dexterity'
  | 'Constitution'
  | 'Intelligence'
  | 'Wisdom'
  | 'Charisma'
  | 'Free'

export interface Ancestry extends EntityModel {
  hitpoints: number
  size: string // should be typed
  speed: number
  attribute_boosts: Attribute[]
  attribute_flaws: Attribute[]
  languages: {
    given: string[] // typed eventually maybe?
    options: string[]
  }
  additional: any[] // this will eventually have to include extra things, TODO will need to support things like adding equipment (clan dagger) or rules (darkvision)
}
