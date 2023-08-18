import { ProficiencyRank, ProficiencyType } from '@/models/db/background'
import { CharacterEquipment } from '@/models/db/character-entity'
import { EquipmentCategory } from '@/models/db/equipment'
import { PlayerCharacter, SourcedFeature } from '@/models/player-character'
import * as Tabs from '@radix-ui/react-tabs'
import { useContext } from 'react'
import { ActionInlineDisplay } from '../actions/action-inline-display'
import { ParsedDescription } from '../parsed-description/parsed-description'
import styles from './features-tabs.module.css'
import { PlayerCharacterContext } from './player-character-context'
import { SkillDisplay } from './skill-display'
import { cloneDeep } from 'lodash'

export function FeaturesTabs() {
  const { playerCharacter, updateAndSavePlayerCharacter } = useContext(
    PlayerCharacterContext
  )

  const parseFeature = (feature: SourcedFeature, index: number) => {
    if (feature.feature.type === 'MISC') {
      const title = feature.feature.value.name
        ? `${feature.source} - ${feature.feature.value.name} `
        : `${feature.source} `

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
          <span className="text-xs">
            {playerCharacter.getActions().map((action, index) => (
              <div key={`${action}-${index}`} className="mb-1">
                <ActionInlineDisplay
                  actionName={action.feature.value}
                ></ActionInlineDisplay>
              </div>
            ))}
          </span>
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
                          <button
                            onClick={() => {
                              updateEquippedArmor(item.id)
                            }}
                            className="ml-2 rounded border border-stone-300 p-0.5"
                          >
                            Equip
                          </button>
                        )}
                      {value[0] === 'Armor' &&
                        item.id ===
                          playerCharacter.getCharacter().equipped_armor && (
                          <button
                            onClick={() => {
                              updateEquippedArmor('')
                            }}
                            className="ml-2 rounded border border-stone-300 p-0.5"
                          >
                            Remove
                          </button>
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
            {['Defense'].map((type: string, index) => {
              return (
                <div key={`${type}-${index}`}>
                  <span className="font-semibold">{type}</span>
                  {Array.from(
                    playerCharacter
                      .getProficiencies()
                      [type as ProficiencyType].keys()
                  ).map((proficiency: string, index) => {
                    return (
                      <div className="mb-1" key={`${proficiency}-${index}`}>
                        <SkillDisplay
                          name={proficiency}
                          rank={
                            (
                              playerCharacter.getProficiencies()[
                                type as ProficiencyType
                              ] as Map<any, ProficiencyRank>
                            ).get(proficiency)!
                          }
                        ></SkillDisplay>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </span>
        </Tabs.Content>
      </Tabs.Root>
    )
  )
}
