import { ObjectId } from 'mongodb'
import { Attribute } from './ancestry'

export interface CharacterEntity {
  _id: string | ObjectId
  name: string
  level: number
  ancestry: CharacterAncestry
}

export interface CharacterAncestry {
  id: string
  attribute_boost_selections: (Attribute | undefined)[]
  language_selections: (string | undefined)[]
}
