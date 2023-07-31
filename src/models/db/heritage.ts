import { EntityModel } from './entity-model'
import { Feature } from './feature'

export interface Heritage extends EntityModel {
  ancestry: string
  features: Feature[]
  traits?: string[]
}
