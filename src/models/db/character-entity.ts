import { ObjectId } from 'mongodb'
import { SourcedFeature } from '../player-character'
import { Attribute } from './ancestry'

export interface CharacterEntity {
  _id: string | ObjectId
  name: string
  level: number
  attributes: CharacterAttributes
  ancestry: CharacterAncestry
  background: CharacterBackground
  character_class: CharacterClass
  features: { '1': SourcedFeature[] }
}

export interface CharacterAttributes {
  ancestry: Attribute[]
  background: Attribute[]
  class: Attribute[]
  level_1: Attribute[]
}

export interface CharacterAncestry {
  id: string
  language_selections: string[]
  free_attribute: boolean
  heritage_id: string
}

export interface CharacterBackground {
  id: string
}

export interface CharacterClass {
  id: string
}
