import { ProficiencyRank, ProficiencyType } from '@/models/db/background'
import { SourcedFeature } from '@/models/player-character'
import * as Tabs from '@radix-ui/react-tabs'
import { useContext } from 'react'
import { ActionInlineDisplay } from '../actions/action-inline-display'
import { ParsedDescription } from '../parsed-description/parsed-description'
import styles from './features-tabs.module.css'
import { PlayerCharacterContext } from './player-character-context'
import { SkillDisplay } from './skill-display'

export function FeaturesTabs() {
  const { playerCharacter } = useContext(PlayerCharacterContext)

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
          <div className="flex flex-col text-xs">
            {playerCharacter.getCharacter().equipment.map((value) => (
              <span key={value.name}>{value.name}</span>
            ))}
          </div>
        </Tabs.Content>
        <Tabs.Content value="proficiencies">
          <span className="text-xs">
            {['Weapon', 'Defense'].map((type: string, index) => {
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
