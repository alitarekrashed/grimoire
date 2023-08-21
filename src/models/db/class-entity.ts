import { AttributeModifier } from './ancestry'
import { EntityModel } from './entity-model'
import { Rarity } from './equipment'
import { Feature } from './feature'

export interface ClassEntity extends EntityModel {
  key_ability: AttributeModifier[][]
  rarity?: Rarity
  features: Feature[]
  hitpoints: number
}
