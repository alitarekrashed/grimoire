import ConditionCard from '@/components/conditions/condition-card'
import EquipmentCard from '@/components/equipment/equipment-card'
import EquipmentWithVariantsCard from '@/components/equipment/equipment-with-variants-card'
import TraitCard from '@/components/traits/trait-card'
import Condition from '@/models/condition'
import { EntityModel } from '@/models/entity-model'
import { Equipment, EquipmentWithVariants } from '@/models/equipment'
import Trait from '@/models/trait'
import { ReactNode } from 'react'

export function CardFactory<T extends EntityModel>({
  card,
  onRemoved,
  contentTextSizeClassName,
  collapsible,
}: {
  card: T
  onRemoved?: (item: T) => void
  contentTextSizeClassName?: string
  collapsible?: boolean
}): ReactNode {
  switch (card.entity_type) {
    case 'EQUIPMENT':
      return (
        <EquipmentCard
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
          value={card as unknown as Condition}
          collapsible={collapsible}
          onRemoved={onRemoved as unknown as (item: Condition) => void}
          contentTextSizeClassName={contentTextSizeClassName}
        ></ConditionCard>
      )
    case 'TRAIT':
      return (
        <TraitCard
          value={card as unknown as Trait}
          collapsible={collapsible}
          onRemoved={onRemoved as unknown as (item: Trait) => void}
          contentTextSizeClassName={contentTextSizeClassName}
        ></TraitCard>
      )
    default:
    // throw error
  }
}
