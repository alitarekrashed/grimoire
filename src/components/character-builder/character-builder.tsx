'use client'

import * as Dialog from '@radix-ui/react-dialog'
import styles from './character-builder.module.css'

import { PlayerCharacter } from '@/models/player-character'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function CharacterBuilderModal({
  playerCharacter,
}: {
  playerCharacter: PlayerCharacter
}) {
  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger>
          <span className="underline" tabIndex={0}>
            Edit build
          </span>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.DialogOverlay} />
          <Dialog.Content className={`bg-stone-800 ${styles.DialogContent}`}>
            <div className="mt-4">banana!!!</div>
            <Dialog.Close>
              <span
                className={`${styles.IconButton} rounded `}
                aria-label="Close"
              >
                <FontAwesomeIcon
                  className="p-1.5 bg-stone-800 rounded-full hover:bg-stone-400"
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
