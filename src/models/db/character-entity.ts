import { ObjectId } from 'mongodb'
import { SourcedFeature } from '../player-character'
import { Attribute } from './ancestry'

export interface CharacterEntity {
  _id: string | ObjectId
  name: string
  level: number
  attributes: CharacterAttributes
  class_id: string
  ancestry: CharacterAncestry
  background: CharacterBackground
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
  language_selections: string[]
  heritage_id: string
}

export interface CharacterBackground {
  id: string
}
