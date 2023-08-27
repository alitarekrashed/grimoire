import { inter } from '@/utils/fonts'
import { Activation, SavingThrow } from './activation'
import { ProficiencyRank } from './background'
import { EntityModel } from './entity-model'
import { Feature } from './feature'

export interface Feat extends EntityModel {
  traits: string[]
  features: Feature[]
  level: number
  prerequisites: Prerequisite[]
  configuration?: FeatConfiguration
  repeatable?: boolean
  activation?: Activation
  saving_throw?: SavingThrow
}

export type PrerequisiteType = 'SKILL' | 'FEAT' | 'ACTION' | 'OTHER'

export interface Prerequisite {
  type: PrerequisiteType
  value: any
}

export interface PrerequisiteSkillValue {
  skill: string
  minimum_rank: ProficiencyRank
}

export interface FeatConfiguration {
  title: string
  options: string[]
}
