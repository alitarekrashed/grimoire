import { ObjectId } from 'mongodb'
import { SourcedFeature } from '../player-character'
import { Attribute } from './ancestry'
import { SpellcastingDefinition } from './class-entity'
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
  features: SourcedFeature[]
  spellcasting: {
    source: string
    value: SpellcastingDefinition
  }[]
  player_state: PlayerState
  equipped_armor: string
  equipment: CharacterEquipment[]
}

export interface PlayerState {
  focus_points: boolean[]
}

export type WithNameAndId = { name: string; id: string }

export interface CharacterEquipment {
  name: string
  id: string
  item: Equipment
}

export interface CharacterAttributes {
  free_ancestry_attribute_selection: boolean
  ancestry: Attribute[]
  background: Attribute[]
  class: Attribute[]
  levels: { level: number; attributes: Attribute[] }[]
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
export type WeaponGroup = 'brawling' | 'sword' | 'firearm'
export type WeaponType = 'melee' | 'ranged'
export type DamageType = 'bludgeoning' | 'piercing' | 'persistent bleed'

export interface WeaponDefinition {
  category: WeaponCategory
  group: WeaponGroup
  type: WeaponType
  additional: { value: string }[]
  damage: WeaponDamageDefinition[]
  reload?: number
  range?: number
}

export interface WeaponDamageDefinition {
  type: DamageType
  dice: string
}
