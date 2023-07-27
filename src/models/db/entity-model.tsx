import { ObjectId } from 'mongodb'

export interface EntityModel {
  _id: ObjectId | string
  name: string
  description: string
  source: Source[]
  entity_type: ModelType
}

export interface Source {
  title: string
  page?: string
}

export type ModelType =
  | 'EQUIPMENT'
  | 'EQUIPMENT_WITH_VARIANTS'
  | 'CONDITION'
  | 'TRAIT'
  | 'SPELL'
  | 'ANCESTRY'
  | 'RULE'
