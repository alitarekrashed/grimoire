import { roboto_condensed, roboto_flex } from '@/utils/fonts'
import * as Dialog from '@radix-ui/react-dialog'
import { ReactNode } from 'react'

export function Modal({
  trigger,
  body,
  closeButtons,
}: {
  trigger: ReactNode
  body: ReactNode
  closeButtons: ReactNode[]
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-stone-950 opacity-40 fixed h-full inset-0" />
        <Dialog.Content className="bg-stone-900 rounded-md fixed inset-20 focus:outline-none border border-stone-300/20">
          <Dialog.Title />
          <Dialog.Description className="h-full">{body}</Dialog.Description>
          <div className="absolute bottom-0 border-t border-t-stone-300/25 w-full">
            <div className="inline-flex gap-2 p-2">
              {closeButtons.map((button) => (
                <Dialog.Close>{button}</Dialog.Close>
              ))}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function ModalCloseButton({ label }: { label: string }) {
  return (
    <span
      className={`py-0.5 px-2 text-sm border border-stone-300 rounded-md ${roboto_flex.className} hover:bg-stone-500`}
      aria-label={label}
    >
      {label}
    </span>
  )
}
