import { ObjectId } from 'mongodb'
import { SourcedFeature } from '../player-character'
import { Attribute } from './ancestry'

export interface CharacterEntity {
  _id: string | ObjectId
  name: string
  level: number
  attributes: CharacterAttributes
  languages: string[]
  ancestry_id: string
  background_id: string
  class_id: string
  heritage_id: string
  features: { '1': SourcedFeature[] }
}

export interface CharacterAttributes {
  free_ancestry_attribute_selection: boolean
  ancestry: Attribute[]
  background: Attribute[]
  class: Attribute[]
  level_1: Attribute[]
}

export interface CharacterArmor {
  name: string
  definition: ArmorDefinition
}

export type ArmorCategory = 'unarmored' | 'light' | 'medium' | 'heavy'
export type ArmorGroup = 'cloth'

export interface ArmorDefinition {
  category: ArmorCategory
  group: ArmorGroup
  ac_bonus: number
  strength?: number
  dex_cap?: number
  check_penalty?: number
  speed_penalty?: number
}
