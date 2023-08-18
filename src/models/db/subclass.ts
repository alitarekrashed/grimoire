import { EntityModel } from './entity-model'
import { Feature } from './feature'

export interface Subclass extends EntityModel {
  class_name: string
  features: Feature[]
}
