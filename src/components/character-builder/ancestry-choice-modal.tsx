import * as Dialog from '@radix-ui/react-dialog'
import styles from './character-builder.module.css'
import { roboto_condensed } from '@/utils/fonts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { Ancestry } from '@/models/db/ancestry'
import AncestryCard from '../ancestries/ancestry-card'

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
      <Dialog.Root>
        <Dialog.Trigger>
          <span className="bg-stone-700 p-1 rounded-md" tabIndex={0}>
            {ancestries.find((val) => val._id === ancestryId)?.name}
          </span>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className={` ${styles.DialogOverlay}`} />
          <Dialog.Content
            className={`bg-stone-900 ${roboto_condensed.className} ${styles.DialogContent} w-3/4 h-3/4`}
            onInteractOutside={(e) => e.preventDefault()}
          >
            <div className="grid grid-rows-1 grid-cols-8 h-full w-full">
              <div className="col-span-1 grid grid-cols-1 auto-rows-min border-r h-full">
                {ancestries.map((ancestry) => (
                  <div className={`h-full`}>
                    <div
                      className={`w-full pr-4 border-b ${styles.splitItem}`}
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
            <Dialog.Close>
              <span
                className={`${styles.IconButton} rounded `}
                aria-label="Close"
                onClick={() => updateAncestry(selected?._id.toString() ?? '')}
              >
                <FontAwesomeIcon
                  className="p-1.5 bg-stone-700 rounded-full hover:bg-stone-400"
                  icon={faXmark}
                />
              </span>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
