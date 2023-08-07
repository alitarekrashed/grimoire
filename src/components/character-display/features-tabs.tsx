import * as Tabs from '@radix-ui/react-tabs'
import { ParsedDescription } from '../parsed-description/parsed-description'
import { SourcedFeature } from '@/models/player-character'
import { LabelsList } from '../labels-list/labels-list'
import styles from './features-tabs.module.css'
import { ActionInlineDisplay } from '../actions/action-inline-display'

export function FeaturesTabs({
  features,
  actions,
  proficiencies,
}: {
  features: SourcedFeature[]
  actions: SourcedFeature[]
  proficiencies: SourcedFeature[]
}) {
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
            <ActionInlineDisplay
              key={`${action}-${index}`}
              actionName={action.feature.value}
            ></ActionInlineDisplay>
          ))}
        </span>
      </Tabs.Content>
      <Tabs.Content value="features">
        <span className="text-xs">
          {features.map((feature: SourcedFeature, index) => {
            return (
              <div className="mb-2" key={`${feature.feature.value}-${index}`}>
                <span className="capitalize font-semibold">{`${feature.source} `}</span>
                <ParsedDescription
                  description={feature.feature.value}
                ></ParsedDescription>
              </div>
            )
          })}
        </span>
      </Tabs.Content>
      <Tabs.Content value="proficiencies">
        <span className="text-xs">
          {proficiencies.map((proficiency, index) => {
            return (
              <div key={`${proficiency.feature.value.value}-${index}`}>
                <LabelsList
                  fieldDefinitions={[
                    {
                      label:
                        proficiency.feature.value.type === 'Lore'
                          ? `Lore ${proficiency.feature.value.value}`
                          : proficiency.feature.value.value,
                      value: proficiency.feature.value.rank,
                    },
                  ]}
                ></LabelsList>
              </div>
            )
          })}
        </span>
      </Tabs.Content>
    </Tabs.Root>
  )
}
