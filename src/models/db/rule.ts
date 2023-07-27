import { EntityModel } from './entity-model'

export type RuleCategory = 'Special senses'

export default interface Rule extends EntityModel {
  category: RuleCategory
}
