import { Activation, SavingThrow } from './activation'
import { EntityModel } from './entity-model'
import { Prerequisite } from './feat'

export interface Action extends EntityModel {
  activation: Activation
  saving_throw?: SavingThrow
  prerequisites?: Prerequisite[]
  traits?: string[]
}
