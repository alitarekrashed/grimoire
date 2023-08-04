import * as Tabs from '@radix-ui/react-tabs'
import { ParsedDescription } from '../parsed-description/parsed-description'
import { SourcedFeature } from '@/models/player-character'
import { LabelsList } from '../labels-list/labels-list'

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
    <Tabs.Root>
      <Tabs.List>
        <Tabs.Trigger value="actions">Actions</Tabs.Trigger>
        <Tabs.Trigger value="features">Features</Tabs.Trigger>
        <Tabs.Trigger value="proficiencies">Proficiencies</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="actions">
        <span className="text-xs">
          {actions.map((action, index) => {
            return (
              <ParsedDescription
                description={action.feature.value}
                key={`${action}-${index}`}
              ></ParsedDescription>
            )
          })}
        </span>
      </Tabs.Content>
      <Tabs.Content value="features">
        <span className="text-xs">
          {features.map((feature, index) => {
            return (
              <div className="mb-2" key={`${feature.feature.value}-${index}`}>
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
