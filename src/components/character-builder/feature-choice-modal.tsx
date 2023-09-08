import { EntityModel } from '@/models/db/entity-model'
import { roboto_condensed } from '@/utils/fonts'
import { CardFactory } from '@/utils/services/card-factory'
import { useCallback, useEffect, useState } from 'react'
import { Modal } from '../base/modal'
import { OptionInlineIndicator } from '../indicators/indicator'
import { caseInsensitiveMatch } from '@/utils/helpers'
import { init } from 'next/dist/compiled/@vercel/og/satori'
import { initial } from 'lodash'
import { FaCheck } from 'react-icons/fa'

type FeatureChoice = EntityModel & { disabled?: boolean; selected?: boolean }

export function FeatureChoiceModal<T extends FeatureChoice>({
  label,
  entities,
  initialId,
  idField,
  onSave,
  onClear,
}: {
  label: string
  entities: T[]
  initialId: string
  idField?: keyof EntityModel
  onSave: (entity: T) => void
  onClear?: () => void
}) {
  const [saved, setSaved] = useState<T>()
  const [selected, setSelected] = useState<T>()

  const resolveIdField: () => keyof EntityModel = useCallback(
    () => idField ?? '_id',
    [idField]
  )

  useEffect(() => {
    const entity = entities.find((entity: EntityModel) =>
      caseInsensitiveMatch(
        entity[resolveIdField()].toString(),
        initialId.toString()
      )
    )
    setSelected(entity)
    setSaved(entity)

    // i should look into seeing if there's a way to clean this up.
    // basically this allows a modal's value to be completely cleared if the set id is not in the entities list...
    if (
      onClear &&
      initialId &&
      entity === undefined &&
      entities &&
      entities.length > 0
    ) {
      onClear()
    }

    if (onClear && entity?.disabled) {
      onClear()
    }
  }, [entities, initialId, onClear, resolveIdField])

  return (
    <>
      <Modal
        size="medium"
        trigger={
          <button
            className="border border-stone-300 rounded-md relative flex items-center w-full h-9 p-1 hover:bg-stone-600"
            tabIndex={0}
          >
            <span className="text-stone-300 absolute top-0 text-[9px]">
              {label}
            </span>
            <span className="absolute bottom-0">{saved && saved.name}</span>
            {!saved && <OptionInlineIndicator />}
          </button>
        }
        body={
          <div
            className={`${roboto_condensed.className} grid grid-rows-1 grid-cols-8 h-full min-h-full w-full`}
          >
            <div className="col-span-2 grid grid-cols-1 auto-rows-min h-full pb-[42px] border-r border-r-stone-300/25 overflow-y-scroll text-sm">
              {entities.map((entity) => (
                <div
                  className={`h-full w-full flex flex-row items-center pl-2 pr-0.5 border-b border-b-stone-300/25 data-[state=active]:text-rose-400 data-[state=active]:border-b-rose-300 data-[disabled=true]:text-stone-500`}
                  key={entity[resolveIdField()].toString()}
                  data-value={entity[resolveIdField()]}
                  data-state={
                    entity[resolveIdField()] ===
                      (selected && selected[resolveIdField()]) && 'active'
                  }
                  data-disabled={entity.disabled}
                  onClick={(e) => {
                    setSelected(
                      entities.find(
                        (entity: T) =>
                          entity[resolveIdField()] ===
                          (e.currentTarget as HTMLElement).dataset.value
                      )
                    )
                  }}
                >
                  <span className="flex-1 flex flex-row items-center">
                    {entity.name}
                    {entity.selected && <FaCheck className="ml-1" />}
                  </span>
                  <span>{getLevelIfExists(entity)}</span>
                </div>
              ))}
            </div>
            <div className="col-span-6 w-full h-full p-4 overflow-y-scroll pb-16">
              {selected && (
                <CardFactory card={selected} collapsible={false}></CardFactory>
              )}
            </div>
          </div>
        }
        closeButtons={[
          {
            label: 'Save',
            onClick: () => {
              onSave(selected!)
              setSaved(selected!)
            },
            disabled: selected?.disabled,
          },
          {
            label: 'Cancel',
            onClick: () => {
              setSelected(
                entities.find((entity: T) =>
                  caseInsensitiveMatch(
                    entity[resolveIdField()].toString(),
                    initialId.toString()
                  )
                )
              )
            },
          },
        ]}
      ></Modal>
    </>
  )
}

function getLevelIfExists<T extends EntityModel>(entity: T) {
  if (entity.hasOwnProperty('level')) {
    return (entity as unknown as { level: number }).level
  }
  return undefined
}
