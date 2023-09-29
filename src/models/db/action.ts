import { Activation, SavingThrow } from './activation'
import { EntityModel } from './entity-model'

export interface Action extends EntityModel {
  activation: Activation
  saving_throw?: SavingThrow
  traits?: string[]
  tags?: string[]
}
