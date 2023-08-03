import ActionCard from '@/components/actions/action-card'
import AncestryCard from '@/components/ancestries/ancestry-card'
import BackgroundCard from '@/components/backgrounds/background-card'
import ConditionCard from '@/components/conditions/condition-card'
import EquipmentCard from '@/components/equipment/equipment-card'
import EquipmentWithVariantsCard from '@/components/equipment/equipment-with-variants-card'
import FeatCard from '@/components/feats/feat-card'
import HeritageCard from '@/components/heritages/heritage-card'
import RuleCard from '@/components/rules/rule-card'
import SpellCard from '@/components/spells/spell-card'
import TraitCard from '@/components/traits/trait-card'
import { Action } from '@/models/db/action'
import { Ancestry } from '@/models/db/ancestry'
import { Background } from '@/models/db/background'
import Condition from '@/models/db/condition'
import { EntityModel } from '@/models/db/entity-model'
import { Equipment, EquipmentWithVariants } from '@/models/db/equipment'
import { Feat } from '@/models/db/feat'
import { Heritage } from '@/models/db/heritage'
import Rule from '@/models/db/rule'
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
    case 'ANCESTRY':
      return (
        <AncestryCard
          reference={reference}
          value={card as unknown as Ancestry}
          collapsible={collapsible}
          onRemoved={onRemoved as unknown as (item: Ancestry) => void}
        ></AncestryCard>
      )
    case 'RULE':
      return (
        <RuleCard
          reference={reference}
          value={card as unknown as Rule}
          collapsible={collapsible}
          onRemoved={onRemoved as unknown as (item: Rule) => void}
        ></RuleCard>
      )
    case 'HERITAGE':
      return (
        <HeritageCard
          reference={reference}
          value={card as unknown as Heritage}
          collapsible={collapsible}
          onRemoved={onRemoved as unknown as (item: Heritage) => void}
        ></HeritageCard>
      )
    case 'ACTION':
      return (
        <ActionCard
          reference={reference}
          value={card as unknown as Action}
          collapsible={collapsible}
          onRemoved={onRemoved as unknown as (item: Action) => void}
        ></ActionCard>
      )
    case 'BACKGROUND':
      return (
        <BackgroundCard
          reference={reference}
          value={card as unknown as Background}
          collapsible={collapsible}
          onRemoved={onRemoved as unknown as (item: Background) => void}
        ></BackgroundCard>
      )
    case 'FEAT':
      return (
        <FeatCard
          reference={reference}
          value={card as unknown as Feat}
          collapsible={collapsible}
          onRemoved={onRemoved as unknown as (item: Feat) => void}
        ></FeatCard>
      )
    default:
    // throw error
  }
}
