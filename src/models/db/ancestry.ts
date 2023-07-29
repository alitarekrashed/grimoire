import { ObjectId } from 'mongodb'
import { EntityModel } from './entity-model'

export type AttributeModifier =
  | 'Strength'
  | 'Dexterity'
  | 'Constitution'
  | 'Intelligence'
  | 'Wisdom'
  | 'Charisma'
  | 'Free'

export type Attribute =
  | 'Strength'
  | 'Dexterity'
  | 'Constitution'
  | 'Intelligence'
  | 'Wisdom'
  | 'Charisma'

export type AdditionalFeatureType = 'Sense'

export interface AdditionalFeature {
  type: AdditionalFeatureType
  value: string
}

export interface Ancestry extends EntityModel {
  hitpoints: number
  size: string // should be typed
  speed: number
  attribute_boosts: AttributeModifier[]
  attribute_flaws: AttributeModifier[]
  traits: string[]
  languages: {
    given: string[] // typed eventually maybe?
    options: string[]
    additional: string // '+Intelligence'
  }
  additional: AdditionalFeature[] // this will eventually have to include extra things, TODO will need to support things like adding equipment (clan dagger) or rules (darkvision)
}
