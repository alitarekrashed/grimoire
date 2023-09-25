import { Action } from '@/models/db/action'
import * as Collapsible from '@radix-ui/react-collapsible'
import { cloneDeep } from 'lodash'
import { ReactNode, useContext, useEffect, useState } from 'react'
import { ActionRenderer } from '../activation-displays/action-renderer'
import { SavingThrowDisplay } from '../activation-displays/activation-description'
import { Separator } from '../base/separator'
import { TraitsList } from '../card/traits-list'
import { PlayerCharacterContext } from '../character-display/player-character-context'
import { ParsedDescription } from '../parsed-description/parsed-description'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

export function ActionInlineDisplay({ initial }: { initial: Action }) {
  const { playerCharacter } = useContext(PlayerCharacterContext)
  const [action, setAction] = useState<Action>()
  const [expanded, setExpanded] = useState<boolean>(false)

  const additional: ReactNode[] = getAdditional(action)

  useEffect(() => {
    const value = cloneDeep(initial)
    let description = value.description
    playerCharacter
      .getFeatModifications(value.name.toLowerCase())
      .forEach((val) => {
        description = description.concat(
          `<br/><br/><i>${val.name}</i><br/>${val.value}`
        )
      })
    value.description = description
    setAction(value)
  }, [initial])

  return (
    <>
      {action && (
        <Collapsible.Root defaultOpen={false} onOpenChange={setExpanded}>
          <Collapsible.Trigger className="w-full flex flex-col pl-1 pb-1 justify-start rounded-sm bg-stone-300/40 hover:bg-stone-500/40">
            <div className="w-full h-full flex flex-row items-center">
              <div className="flex-1">
                <div className="float-left">
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
            <TraitsList traits={action.traits ?? []}></TraitsList>
            {additional.length > 0 && <Separator className="w-full my-0.5" />}
            {additional.length > 0 && (
              <div className="text-left flex flex-col w-full">{additional}</div>
            )}
          </Collapsible.Trigger>
          <Collapsible.Content className="overflow-hidden">
            <div className="pl-1 pt-1 rounded-b-sm bg-stone-500/40">
              <ParsedDescription
                description={action.description}
              ></ParsedDescription>
              {action.saving_throw && (
                <div className="mt-2">
                  <span className="font-semibold">Effect</span>
                  <SavingThrowDisplay
                    value={action.saving_throw}
                  ></SavingThrowDisplay>
                </div>
              )}
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
      <div>
        <span className="font-semibold">Requirements </span>
        <ParsedDescription
          description={action.activation.requirements}
        ></ParsedDescription>
      </div>
    )
  }

  if (action && action.activation.trigger) {
    additional.push(
      <div>
        <span className="font-semibold">Trigger </span>
        <ParsedDescription
          description={action.activation.trigger}
        ></ParsedDescription>
      </div>
    )
  }

  return additional
}
