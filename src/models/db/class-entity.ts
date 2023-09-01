import { AttributeModifier } from './ancestry'
import { ProficiencyRank } from './background'
import { EntityModel } from './entity-model'
import { Rarity } from './equipment'
import { Feature } from './feature'
import { Tradition } from './spell'

export interface SpellcastingDefinition {
  type: string
  condition?: string
  tradition: {
    value: Tradition
    options?: Tradition[]
  }
  progression: {
    level: number
    type: 'attack' | 'saving_throw'
    rank: ProficiencyRank
  }[]
}

export interface ClassEntity extends EntityModel {
  key_ability: AttributeModifier[][]
  spellcasting: SpellcastingDefinition
  rarity?: Rarity
  features: Feature[]
  hitpoints: number
}
