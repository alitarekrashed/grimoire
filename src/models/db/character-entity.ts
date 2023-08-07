import { ObjectId } from 'mongodb'
import { Attribute } from './ancestry'
import { SourcedFeature } from '../player-character'

export interface CharacterEntity {
  _id: string | ObjectId
  name: string
  level: number
  ancestry: CharacterAncestry
  background: CharacterBackground
  features: { '1': SourcedFeature[] }
}

export interface CharacterAncestry {
  id: string
  attribute_boost_selections: Attribute[]
  language_selections: string[]
  free_attribute: boolean
  heritage_id: string
}

export interface CharacterBackground {
  id: string
  attribute_boost_selections: Attribute[]
}
