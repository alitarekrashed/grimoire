'use client'

import Condition from '@/models/condition'
import * as Dialog from '@radix-ui/react-dialog'
import styles from './condition-modal.module.css'

import ConditionCard from './condition-card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

// TODO eventually the display should be clickable and allow the user to go to a page for the condition?
// TODO maybe this should open a modal instead of a link to a new page
export default function ConditionModal({ value }: { value: Condition }) {
  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button>
            <span className="underline" tabIndex={0}>
              {value.name}
            </span>
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.DialogOverlay} />
          <Dialog.Content className={`bg-stone-800 ${styles.DialogContent}`}>
            <div className="mt-4">
              <ConditionCard
                value={value}
                collapsible={false}
                contentTextSizeClassName="md"
              ></ConditionCard>
            </div>
            <Dialog.Close asChild>
              <button
                className={`${styles.IconButton} rounded `}
                aria-label="Close"
              >
                <FontAwesomeIcon
                  className="p-1.5 bg-stone-800 rounded-full hover:bg-stone-400"
                  icon={faXmark}
                />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
