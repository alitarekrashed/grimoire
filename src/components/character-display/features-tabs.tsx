import * as Tabs from '@radix-ui/react-tabs'
import { ParsedDescription } from '../parsed-description/parsed-description'
import { SourcedFeature } from '@/models/player-character'
import { LabelsList } from '../labels-list/labels-list'
import styles from './features-tabs.module.css'
import { ActionInlineDisplay } from '../actions/action-inline-display'
import { ProficiencyRank, ProficiencyType } from '@/models/db/background'

export function FeaturesTabs({
  features,
  actions,
  proficiencies,
}: {
  features: SourcedFeature[]
  actions: SourcedFeature[]
  proficiencies: {
    Perception: Map<string, ProficiencyRank>
    Skill: Map<string, ProficiencyRank>
    Lore: Map<string, ProficiencyRank>
    SavingThrow: Map<string, ProficiencyRank>
    Weapon: Map<string, ProficiencyRank>
    Defense: Map<string, ProficiencyRank>
    DifficultyClass: Map<string, ProficiencyRank>
  }
}) {
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
    <Tabs.Root defaultValue="actions">
      <Tabs.List className="flex gap-2 mb-2 border-b border-b-stone-300">
        <Tabs.Trigger value="actions" className={styles.tabHeader}>
          Actions
        </Tabs.Trigger>
        <Tabs.Trigger value="features" className={styles.tabHeader}>
          Features
        </Tabs.Trigger>
        <Tabs.Trigger value="proficiencies" className={styles.tabHeader}>
          Proficiencies
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="actions">
        <span className="text-xs">
          {actions.map((action, index) => (
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
          {features.map((feature: SourcedFeature, index) =>
            parseFeature(feature, index)
          )}
        </span>
      </Tabs.Content>
      <Tabs.Content value="proficiencies">
        <span className="text-xs">
          {Object.keys(proficiencies).map((type: string, index) => {
            return (
              <div key={`${type}-${index}`}>
                <span className="font-semibold">{type}</span>
                {Array.from(proficiencies[type as ProficiencyType].keys()).map(
                  (proficiency: string, index) => {
                    return (
                      <div key={`${proficiency}-${index}`}>
                        <LabelsList
                          fieldDefinitions={[
                            {
                              label:
                                type === 'Lore'
                                  ? `Lore ${proficiency}`
                                  : proficiency,
                              value:
                                proficiencies[type as ProficiencyType].get(
                                  proficiency
                                ),
                            },
                          ]}
                        ></LabelsList>
                      </div>
                    )
                  }
                )}
              </div>
            )
          })}
        </span>
      </Tabs.Content>
    </Tabs.Root>
  )
}
