import { Ancestry } from '@/models/db/ancestry'
import { roboto_condensed } from '@/utils/fonts'
import { useEffect, useState } from 'react'
import AncestryCard from '../ancestries/ancestry-card'
import { Modal, ModalCloseButton } from '../modal/modal'
import styles from './character-builder.module.css'

export function AncestryChoiceModal({
  ancestryId,
  onAncestryEdit,
}: {
  ancestryId: string
  onAncestryEdit: (ancestryId: string) => void
}) {
  const [ancestries, setAncestries] = useState<Ancestry[]>([])
  const [selected, setSelected] = useState<Ancestry>()

  useEffect(() => {
    fetch('http://localhost:3000/api/ancestries', {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((ancestries) => {
        setSelected(
          ancestries.find((ancestry: Ancestry) => ancestry._id === ancestryId)
        )
        setAncestries(ancestries)
      })
  }, [])

  const updateAncestry = (id: string) => {
    onAncestryEdit(id)
  }

  return (
    <>
      <Modal
        trigger={
          <span className="bg-stone-700 p-1 rounded-md" tabIndex={0}>
            {ancestries.find((val) => val._id === ancestryId)?.name}
          </span>
        }
        body={
          <div
            className={`${roboto_condensed.className} grid grid-rows-1 grid-cols-8 h-full w-full`}
          >
            <div className="col-span-1 grid grid-cols-1 auto-rows-min border-r border-r-stone-300/25">
              {ancestries.map((ancestry) => (
                <div className={`h-full`}>
                  <div
                    className={`w-full pl-2 pr-4 border-b border-b-stone-300/25 ${styles.splitItem}`}
                    data-value={ancestry._id}
                    data-state={ancestry._id === selected?._id && 'active'}
                    onClick={(e) => {
                      setSelected(
                        ancestries.find(
                          (ancestry: Ancestry) =>
                            ancestry._id ===
                            (e.target as HTMLElement).dataset.value
                        )
                      )
                    }}
                  >
                    {ancestry.name}
                  </div>
                </div>
              ))}
            </div>
            <div className="col-span-7 w-full h-full p-4">
              {selected && (
                <AncestryCard
                  value={selected}
                  collapsible={false}
                ></AncestryCard>
              )}
            </div>
          </div>
        }
        closeButtons={[
          <ModalCloseButton
            label="Save"
            onClick={() => updateAncestry(selected?._id.toString() ?? '')}
          ></ModalCloseButton>,
          <ModalCloseButton
            label="Cancel"
            onClick={() =>
              setSelected(
                ancestries.find(
                  (ancestry: Ancestry) => ancestry._id === ancestryId
                )
              )
            }
          ></ModalCloseButton>,
        ]}
      ></Modal>
    </>
  )
}
