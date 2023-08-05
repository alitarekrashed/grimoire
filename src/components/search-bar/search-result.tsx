import { EntityModel } from '@/models/db/entity-model'
import { EquipmentWithVariants } from '@/models/db/equipment'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'
import { Rarity } from '../card/traits-list'
import { Heritage } from '@/models/db/heritage'
import { Activation, isActionLongerThanTurn } from '@/models/db/activation'
import { buildActionValue } from '../activation-displays/activation-description'

export function SearchResult({
  data,
  handleClick,
}: {
  data: EntityModel
  handleClick: () => any
}) {
  const router = useRouter()

  const level: string | undefined = buildLevelDisplay(data)
  return (
    <div
      className="p-1 border-x border-t border-stone-300 hover:bg-stone-600 flex justify-between cursor-pointer"
      onClick={handleClick}
    >
      <span>
        {data.name} {buildActionDisplay(data)} {buildRarityDisplay(data)}
      </span>
      <span className="capitalize">
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
    case 'RULE':
      return 'Rule'
    case 'ANCESTRY':
      return 'Ancestry'
    case 'HERITAGE':
      return `${(data as Heritage).ancestry} heritage`
    case 'ACTION':
      return 'Action'
    case 'BACKGROUND':
      return 'Background'
    case 'FEAT':
      return 'Feat'
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

function buildActionDisplay(data: EntityModel): ReactNode | undefined {
  switch (data.entity_type) {
    case 'SPELL':
    case 'ACTION':
      const entityWithActivation = data as EntityModel & {
        activation: Activation
      }
      return (
        entityWithActivation.activation &&
        isActionLongerThanTurn(entityWithActivation.activation.num_actions) ===
          false && (
          <span>
            &nbsp;{buildActionValue(entityWithActivation.activation, 15)}
          </span>
        )
      )
    default:
      return undefined
  }
}
