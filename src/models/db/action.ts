import { Activation } from './activation'
import { EntityModel } from './entity-model'

export interface Action extends EntityModel {
  activation: Activation
}
