import { EntityModel } from '@/models/db/entity-model'
import { roboto_condensed } from '@/utils/fonts'
import { CardFactory } from '@/utils/services/card-factory'
import { useEffect, useState } from 'react'
import { Modal } from '../modal/modal'

export function FeatureChoiceModal<T extends EntityModel>({
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

  const resolveIdField: () => keyof EntityModel = () => idField ?? '_id'

  useEffect(() => {
    const entity = entities.find(
      (entity: EntityModel) =>
        entity[resolveIdField()].toString().toLowerCase() ===
        initialId.toString().toLowerCase()
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
  }, [entities, initialId])

  return (
    <>
      <Modal
        size="medium"
        trigger={
          <span
            className="border border-stone-300 rounded-md relative flex w-44 h-9 p-1 hover:bg-stone-600"
            tabIndex={0}
          >
            <span className="text-stone-300 absolute top-0 text-[9px]">
              {label}
            </span>
            <span className="absolute bottom-0">{saved && saved.name}</span>
          </span>
        }
        body={
          <div
            className={`${roboto_condensed.className} grid grid-rows-1 grid-cols-8 h-full min-h-full w-full`}
          >
            <div className="col-span-1 grid grid-cols-1 auto-rows-min h-full border-r border-r-stone-300/25 overflow-y-scroll text-sm">
              {entities.map((entity) => (
                <div
                  className={`h-full`}
                  key={entity[resolveIdField()].toString()}
                >
                  <div
                    className={`w-full pl-2 pr-4 border-b border-b-stone-300/25 data-[state=active]:text-rose-400 data-[state=active]:border-b-rose-300`}
                    data-value={entity[resolveIdField()]}
                    data-state={
                      entity[resolveIdField()] ===
                        (selected && selected[resolveIdField()]) && 'active'
                    }
                    onClick={(e) => {
                      setSelected(
                        entities.find(
                          (entity: T) =>
                            entity[resolveIdField()] ===
                            (e.target as HTMLElement).dataset.value
                        )
                      )
                    }}
                  >
                    {entity.name}
                  </div>
                </div>
              ))}
            </div>
            <div className="col-span-7 w-full h-full p-4 overflow-y-scroll pb-16">
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
          },
          {
            label: 'Cancel',
            onClick: () => {
              setSelected(
                entities.find(
                  (entity: T) =>
                    entity[resolveIdField()].toString().toLowerCase() ===
                    initialId.toString().toLowerCase()
                )
              )
            },
          },
        ]}
      ></Modal>
    </>
  )
}
