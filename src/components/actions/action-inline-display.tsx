import { Action } from '@/models/db/action'
import * as Collapsible from '@radix-ui/react-collapsible'
import { cloneDeep } from 'lodash'
import { ReactNode, useContext, useEffect, useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { ActionRenderer } from '../activation-displays/action-renderer'
import { SavingThrowDisplay } from '../activation-displays/activation-description'
import { Separator } from '../base/separator'
import { TraitsList } from '../card/traits-list'
import { PlayerCharacterContext } from '../character-display/player-character-context'
import { ParsedDescription } from '../parsed-description/parsed-description'
import { describe } from 'node:test'

interface Modification {
  name: string
  description: string
}

export function ActionInlineDisplay({ initial }: { initial: Action }) {
  const { playerCharacter } = useContext(PlayerCharacterContext)
  const [action, setAction] = useState<Action>()
  const [modifications, setModifications] = useState<Modification[]>([])
  const [expanded, setExpanded] = useState<boolean>(false)

  const additional: ReactNode[] = getAdditional(action)

  useEffect(() => {
    const value = cloneDeep(initial)

    const modificationsFromFeats = playerCharacter
      .getFeatModifications(value.name.toLowerCase())
      .map((value) => {
        return {
          name: value.name,
          description: value.value,
        }
      })

    const modificationsFromFeatures = playerCharacter
      .getResolvedFeatures()
      .filter(
        (sourced) =>
          sourced.feature.type === 'ACTION_MODIFIER' &&
          sourced.feature.value.name === value.name.toLowerCase()
      )
      .filter((sourced) => {
        return (
          playerCharacter.getFeatModifications(value.name.toLowerCase())
            .length === 0
        )
      })
      .map((value) => {
        return {
          name: value.source,
          description: value.feature.value.description,
        }
      })
    setModifications(modificationsFromFeatures.concat(modificationsFromFeats))
    setAction(value)
  }, [initial])

  const backgrounds =
    modifications.length > 0
      ? 'bg-blue-500/40 hover:bg-blue-700/40'
      : 'bg-emerald-500/40 hover:bg-emerald-700/40'

  return (
    <>
      {action && (
        <Collapsible.Root defaultOpen={false} onOpenChange={setExpanded}>
          <Collapsible.Trigger
            className={`w-full flex flex-col pt-1 pl-1 pb-1 justify-start rounded-md border ${backgrounds}`}
          >
            <div className="w-full h-full flex flex-row items-center">
              <div className="flex-1">
                <div className="float-left mb-1">
                  <span className="mr-1">{action.name}</span>
                  <ActionRenderer
                    activation={action.activation}
                    size={14}
                  ></ActionRenderer>
                </div>
              </div>
              <div className="pr-1">
                {expanded ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>
            <div className="flex flex-row items-center w-full">
              <TraitsList traits={action.traits ?? []}></TraitsList>
              {action.activation.tags && (
                <div className="flex-1 text-right mr-1">
                  {action.activation.tags.sort().join(', ')}
                </div>
              )}
            </div>
            {additional.length > 0 && <Separator className="w-full my-0.5" />}
            {additional.length > 0 && (
              <div className="text-left flex flex-col w-full">{additional}</div>
            )}
          </Collapsible.Trigger>
          <Collapsible.Content className="overflow-hidden">
            <div className="pl-1 pt-1 rounded-b-sm bg-stone-500/40 flex flex-col gap-1">
              <div>
                <ParsedDescription
                  description={action.description}
                ></ParsedDescription>
                {action.saving_throw && (
                  <div className="mt-2">
                    <SavingThrowDisplay
                      value={action.saving_throw}
                    ></SavingThrowDisplay>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 p-1">
                {modifications.map((modification, idx) => (
                  <div
                    key={idx}
                    className="border rounded bg-orange-500/40 p-1"
                  >
                    <div className="font-semibold capitalize italic mb-1">
                      {modification.name}
                    </div>
                    <ParsedDescription
                      description={modification.description}
                    ></ParsedDescription>
                  </div>
                ))}
              </div>
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      )}
    </>
  )
}

function getAdditional(action: Action | undefined) {
  const additional = []

  if (action && action.activation.requirements) {
    additional.push(
      <div key={`${action.name}-requirements`}>
        <span className="font-semibold">Requirements </span>
        <ParsedDescription
          description={action.activation.requirements}
        ></ParsedDescription>
      </div>
    )
  }

  if (action && action.activation.trigger) {
    additional.push(
      <div key={`${action.name}-trigger`}>
        <span className="font-semibold">Trigger </span>
        <ParsedDescription
          description={action.activation.trigger}
        ></ParsedDescription>
      </div>
    )
  }

  return additional
}
