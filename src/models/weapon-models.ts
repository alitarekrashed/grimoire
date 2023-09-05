export type WeaponCategory = 'unarmed' | 'simple' | 'martial' | 'advanced'
export type WeaponGroup =
  | 'axe'
  | 'bomb'
  | 'bow'
  | 'brawling'
  | 'club'
  | 'dart'
  | 'firearm'
  | 'flail'
  | 'hammer'
  | 'knife'
  | 'pick'
  | 'polearm'
  | 'shield'
  | 'sling'
  | 'spear'
  | 'sword'
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
