import { EntityModel } from '@/models/entity-model'
import { EquipmentWithVariants } from '@/models/equipment'
import { Rarity } from '../card/traits-list'
import { ReactNode } from 'react'
import React from 'react'

export function SearchResult({ data }: { data: EntityModel }) {
  const level: string | undefined = buildLevelDisplay(data)
  return (
    <div className="flex justify-between">
      <span>
        {data.name} {buildRarityDisplay(data)}
      </span>
      <span>
        {getType(data)} {level}
      </span>
    </div>
  )
}

function getType(data: EntityModel): string {
  switch (data.entity_type) {
    case 'EQUIPMENT':
    case 'EQUIPMENT_WITH_VARIANTS':
      return 'Equipment'
    case 'SPELL':
      return 'Spell'
    case 'CONDITION':
      return 'Condition'
    case 'TRAIT':
      return 'Trait'
  }
}

function buildLevelDisplay(data: EntityModel): string | undefined {
  switch (data.entity_type) {
    case 'EQUIPMENT':
      return (data as EntityModel & { level: number }).level.toString()
    case 'SPELL':
      return (data as EntityModel & { rank: number }).rank.toString()
    case 'EQUIPMENT_WITH_VARIANTS':
      const levels: number[] = (data as EquipmentWithVariants).types.map(
        (type) => type.level
      )
      levels.sort((a, b) => a - b)
      let level: string = '' + levels[0]
      level = levels.length > 1 ? level.concat('+') : level
      return level
    default:
      return undefined
  }
}

function buildRarityDisplay(data: EntityModel): ReactNode | undefined {
  switch (data.entity_type) {
    case 'SPELL':
    case 'EQUIPMENT_WITH_VARIANTS':
    case 'EQUIPMENT':
      const entityWithRarity = data as EntityModel & { rarity: string }
      return (
        entityWithRarity.rarity && (
          <span className="text-xs">
            <Rarity rarity={entityWithRarity.rarity}></Rarity>
          </span>
        )
      )
    default:
      return undefined
  }
}
