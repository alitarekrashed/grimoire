import ConditionCard from '@/components/conditions/condition-card'
import EquipmentCard from '@/components/equipment/equipment-card'
import EquipmentWithVariantsCard from '@/components/equipment/equipment-with-variants-card'
import SpellCard from '@/components/spells/spell-card'
import TraitCard from '@/components/traits/trait-card'
import Condition from '@/models/db/condition'
import { EntityModel } from '@/models/db/entity-model'
import { Equipment, EquipmentWithVariants } from '@/models/db/equipment'
import { Spell } from '@/models/db/spell'
import Trait from '@/models/db/trait'
import { ReactNode, RefObject } from 'react'

export function CardFactory<T extends EntityModel>({
  reference,
  card,
  onRemoved,
  contentTextSizeClassName,
  collapsible,
}: {
  reference?: RefObject<HTMLDivElement>
  card: T
  onRemoved?: (item: T) => void
  contentTextSizeClassName?: string
  collapsible?: boolean
}): ReactNode {
  switch (card.entity_type) {
    case 'EQUIPMENT':
      return (
        <EquipmentCard
          reference={reference}
          value={card as unknown as Equipment}
          collapsible={collapsible}
          onRemoved={onRemoved as unknown as (item: Equipment) => void}
        ></EquipmentCard>
      )
    case 'EQUIPMENT_WITH_VARIANTS':
      return (
        <EquipmentWithVariantsCard
          value={card as unknown as EquipmentWithVariants}
          collapsible={collapsible}
          onRemoved={
            onRemoved as unknown as (item: EquipmentWithVariants) => void
          }
        ></EquipmentWithVariantsCard>
      )
    case 'CONDITION':
      return (
        <ConditionCard
          reference={reference}
          value={card as unknown as Condition}
          collapsible={collapsible}
          onRemoved={onRemoved as unknown as (item: Condition) => void}
          contentTextSizeClassName={contentTextSizeClassName}
        ></ConditionCard>
      )
    case 'TRAIT':
      return (
        <TraitCard
          reference={reference}
          value={card as unknown as Trait}
          collapsible={collapsible}
          onRemoved={onRemoved as unknown as (item: Trait) => void}
          contentTextSizeClassName={contentTextSizeClassName}
        ></TraitCard>
      )
    case 'SPELL':
      return (
        <SpellCard
          reference={reference}
          value={card as unknown as Spell}
          collapsible={collapsible}
          onRemoved={onRemoved as unknown as (item: Spell) => void}
        ></SpellCard>
      )
    default:
    // throw error
  }
}
