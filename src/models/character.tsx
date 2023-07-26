import { ObjectId } from 'mongodb'

export interface Character {
  _id: string | ObjectId
  name: string
  level: number
  ancestry: {
    id: string
  }
}
