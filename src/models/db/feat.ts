import { Activation } from './activation'
import { ProficiencyRank } from './background'
import { EntityModel } from './entity-model'
import { Feature } from './feature'

export interface Feat extends EntityModel {
  traits: string[]
  features: Feature[]
  level: number
  prerequisites: Prerequisite[]
  activation?: Activation
}

export type PrerequisiteType = 'SKILL' | 'OTHER'

export interface Prerequisite {
  type: PrerequisiteType
  value: any
}

export interface PrerequisiteSkillValue {
  skill: string
  minimum_rank: ProficiencyRank
}
