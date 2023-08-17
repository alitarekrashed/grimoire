import { ObjectId } from 'mongodb'
import { SourcedFeature } from '../player-character'
import { Attribute } from './ancestry'
import { Equipment } from './equipment'

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
  equipment: Equipment[]
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
  traits: string[]
  definition: ArmorDefinition
}

export interface CharacterWeapon {
  name: string
  traits: string[]
  definition: WeaponDefinition
}

export type ArmorCategory = 'unarmored' | 'light' | 'medium' | 'heavy'
export type ArmorGroup = 'cloth' | 'chain'

export interface ArmorDefinition {
  category: ArmorCategory
  group: ArmorGroup
  ac_bonus: number
  strength?: number
  dex_cap?: number
  check_penalty?: number
  speed_penalty?: number
}

export type WeaponCategory = 'unarmed' | 'martial'
export type WeaponGroup = 'brawling' | 'sword'
export type WeaponType = 'melee' | 'ranged'
export type DamageType = 'bludgeoning' | 'piercing'

export interface WeaponDefinition {
  category: WeaponCategory
  group: WeaponGroup
  type: WeaponType
  damage: WeaponDamageDefinition[]
}

export interface WeaponDamageDefinition {
  type: DamageType
  dice: string
}
