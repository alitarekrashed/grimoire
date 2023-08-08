import { AttributeModifier } from './ancestry'
import { EntityModel } from './entity-model'

export interface ClassEntity extends EntityModel {
  key_ability: AttributeModifier[][]
  hitpoints: number
}
