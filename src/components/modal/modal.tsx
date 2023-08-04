import { roboto_condensed, roboto_flex } from '@/utils/fonts'
import * as Dialog from '@radix-ui/react-dialog'
import { ReactNode } from 'react'

export function Modal({
  trigger,
  body,
}: {
  trigger: ReactNode
  body: ReactNode
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-stone-950 opacity-40 fixed h-full inset-0" />
        <Dialog.Content className="bg-stone-900 rounded-md fixed inset-20 focus:outline-none border border-stone-300/20">
          <Dialog.Title />
          <Dialog.Description className="h-full border-b-stone-300/25">
            {body}
          </Dialog.Description>
          <Dialog.Close>
            <div className="absolute bottom-11 border-t border-t-stone-300/25 w-full"></div>
            <span
              className={`absolute py-0.5 px-2 text-sm bottom-2 left-3 border border-stone-300 rounded-md ${roboto_flex.className} hover:bg-stone-500`}
              aria-label="Close"
            >
              Close
            </span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
