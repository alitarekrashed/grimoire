import { AttributeModifier } from './ancestry'
import { EntityModel } from './entity-model'
import { Feature } from './feature'

export interface ClassEntity extends EntityModel {
  key_ability: AttributeModifier[][]
  features: { '1': Feature[] }
  hitpoints: number
}
