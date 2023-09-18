import {
  ArmorProficiencyValue,
  WeaponProficiencyValue,
} from '@/models/db/background'
import { CharacterEquipment } from '@/models/db/character-entity'
import { EquipmentCategory } from '@/models/db/equipment'
import { SpellFeatureValue } from '@/models/db/feature'
import { PlayerCharacter, SourcedFeature } from '@/models/player-character'
import { ProficiencyRank } from '@/models/proficiency-rank'
import * as Tabs from '@radix-ui/react-tabs'
import { cloneDeep } from 'lodash'
import { useContext } from 'react'
import { Button } from '../base/button'
import { ParsedDescription } from '../parsed-description/parsed-description'
import { ActionDisplay } from './actions-display/actions-display'
import styles from './features-tabs.module.css'
import { PlayerCharacterContext } from './player-character-context'
import { SkillDisplay } from './skill-display'
import { Spells } from './spells-display/spells'

export function FeaturesTabs() {
  const { playerCharacter, updateAndSavePlayerCharacter } = useContext(
    PlayerCharacterContext
  )

  const parseFeature = (feature: SourcedFeature, index: number) => {
    if (feature.feature.type === 'MISC') {
      const title =
        (feature.feature.value.name
          ? `${feature.source} - ${feature.feature.value.name}`
          : `${feature.source}`) +
        (feature.feature.context && feature.feature.context.length > 0
          ? `: ${feature.feature.context} `
          : ' ')

      return (
        <div className="mb-2" key={`${feature.feature.value}-${index}`}>
          <span className="capitalize font-semibold">{title}</span>
          <ParsedDescription
            description={feature.feature.value.description}
          ></ParsedDescription>
        </div>
      )
    }
    return (
      <div className="mb-2" key={`${feature.feature.value}-${index}`}>
        <span className="capitalize font-semibold">{`${feature.source} `}</span>
        <ParsedDescription
          description={feature.feature.value}
        ></ParsedDescription>
      </div>
    )
  }

  const groupedEquipment: Map<EquipmentCategory, CharacterEquipment[]> =
    playerCharacter
      .getCharacter()
      .equipment.reduce(
        (entryMap, e) =>
          entryMap.set(e.item.category, [
            ...(entryMap.get(e.item.category) || []),
            e,
          ]),
        new Map()
      )

  const updateEquippedArmor = (id: string) => {
    const updated = cloneDeep(playerCharacter.getCharacter())
    updated.equipped_armor = id
    PlayerCharacter.build(updated).then((val) =>
      updateAndSavePlayerCharacter(val)
    )
  }

  return (
    playerCharacter && (
      <Tabs.Root defaultValue="actions">
        <Tabs.List className="flex gap-2 mb-2 border-b border-b-stone-300 text-sm font-light">
          <Tabs.Trigger value="actions" className={styles.tabHeader}>
            Actions
          </Tabs.Trigger>
          <Tabs.Trigger value="spells" className={styles.tabHeader}>
            Spells
          </Tabs.Trigger>
          <Tabs.Trigger value="features" className={styles.tabHeader}>
            Features
          </Tabs.Trigger>
          <Tabs.Trigger value="equipment" className={styles.tabHeader}>
            Equipment
          </Tabs.Trigger>
          <Tabs.Trigger value="proficiencies" className={styles.tabHeader}>
            Proficiencies
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="actions">
          <ActionDisplay></ActionDisplay>
        </Tabs.Content>
        <Tabs.Content value="spells">
          <Spells
            features={playerCharacter
              .getSpells()
              .map((sourced) => sourced.feature.value as SpellFeatureValue)}
          ></Spells>
        </Tabs.Content>
        <Tabs.Content value="features">
          <span className="text-xs">
            {playerCharacter
              .getAdditionalFeatures()
              .map((feature: SourcedFeature, index) =>
                parseFeature(feature, index)
              )}
          </span>
        </Tabs.Content>
        <Tabs.Content value="equipment">
          <div className="flex flex-col">
            {Array.from(groupedEquipment.entries()).map(
              (value: [EquipmentCategory, CharacterEquipment[]]) => (
                <div
                  className="flex flex-col text-base font-extralight"
                  key={value[0]}
                >
                  {value[0]}
                  {value[1].map((item) => (
                    <span className="text-xs font-light" key={`${item.id}`}>
                      {item.name}
                      {value[0] === 'Armor' &&
                        item.id !==
                          playerCharacter.getCharacter().equipped_armor && (
                          <Button
                            onClick={() => {
                              updateEquippedArmor(item.id)
                            }}
                            label="EQUIP"
                            className="ml-2"
                          />
                        )}
                      {value[0] === 'Armor' &&
                        item.id ===
                          playerCharacter.getCharacter().equipped_armor && (
                          <Button
                            onClick={() => {
                              updateEquippedArmor('')
                            }}
                            label="REMOVE"
                            className="ml-2 border-rose-600"
                          />
                        )}
                    </span>
                  ))}
                </div>
              )
            )}
          </div>
        </Tabs.Content>
        <Tabs.Content value="proficiencies">
          <span className="text-xs">
            <div>
              <span className="font-semibold">Defense</span>
              {playerCharacter
                .getGearProficiencyManager()
                .getArmorProficiencies()
                .map(
                  (
                    proficiency: {
                      value: ArmorProficiencyValue
                      rank: ProficiencyRank
                    },
                    index
                  ) => {
                    return (
                      <div className="mb-1" key={`${proficiency}-${index}`}>
                        <SkillDisplay
                          name={`${proficiency.value.category ?? ''} ${
                            proficiency.value.group ?? ''
                          } armor`}
                          rank={proficiency.rank}
                        ></SkillDisplay>
                      </div>
                    )
                  }
                )}
            </div>
            <div>
              <span className="font-semibold">Weapons</span>
              {playerCharacter
                .getGearProficiencyManager()
                .getWeaponProficiencies()
                .map(
                  (
                    proficiency: {
                      value: WeaponProficiencyValue
                      rank: ProficiencyRank
                    },
                    index
                  ) => {
                    return (
                      <div className="mb-1" key={`${proficiency}-${index}`}>
                        <SkillDisplay
                          name={`${proficiency.value.category ?? ''} ${
                            proficiency.value.weapon ?? ''
                          } ${proficiency.value.group ?? 'weapons'}`}
                          rank={proficiency.rank}
                        ></SkillDisplay>
                      </div>
                    )
                  }
                )}
            </div>
          </span>
        </Tabs.Content>
      </Tabs.Root>
    )
  )
}
