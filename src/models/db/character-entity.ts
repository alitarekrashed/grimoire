import { ObjectId } from 'mongodb'
import { SourcedFeature } from '../player-character'
import { Attribute } from './ancestry'

export interface CharacterEntity {
  _id: string | ObjectId
  name: string
  level: number
  attributes: CharacterAttributes
  languages: string[]
  background_id: string
  class_id: string
  heritage_id: string
  ancestry: CharacterAncestry
  features: { '1': SourcedFeature[] }
}

export interface CharacterAttributes {
  free_ancestry_attribute_selection: boolean
  ancestry: Attribute[]
  background: Attribute[]
  class: Attribute[]
  level_1: Attribute[]
}

export interface CharacterAncestry {
  id: string
}
