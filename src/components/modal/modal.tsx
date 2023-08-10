import { roboto_flex } from '@/utils/fonts'
import * as Dialog from '@radix-ui/react-dialog'
import { ReactNode } from 'react'

export function Modal({
  size,
  trigger,
  body,
  closeButtons,
}: {
  size?: 'large' | 'medium' | 'small'
  trigger: ReactNode
  body: ReactNode
  closeButtons: { label: string; onClick: () => void; disabled?: boolean }[]
}) {
  const modalSize = () => {
    switch (size) {
      case 'large':
        return 'inset-5 h-[90%]'
      case 'small':
        return 'inset-56 h-2/5'
      default:
        return 'inset-20 h-3/5'
    }
  }
  return (
    <Dialog.Root>
      <Dialog.Trigger>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-stone-950 opacity-40 fixed h-full inset-0"></Dialog.Overlay>
        <div className={`fixed ${modalSize()}`}>
          <Dialog.Content
            onInteractOutside={(e) => e.preventDefault()}
            className={`bg-stone-900 rounded-md focus:outline-none border border-stone-300/20 h-full`}
          >
            <Dialog.Title />
            {body}
            <div className="absolute w-full bottom rounded-b-md border-y border-r border-stone-300/20 bg-stone-900 bottom-0 min-w-min">
              <div className="inline-flex gap-2 p-2">
                {closeButtons.map((button) => (
                  <Dialog.Close asChild key={button.label}>
                    <button
                      className={`py-0.5 px-2 text-sm border border-stone-300 rounded-md ${roboto_flex.className} hover:bg-stone-600  disabled:bg-stone-600/50 disabled:border-stone-600 disabled:text-stone-400/50`}
                      aria-label={button.label}
                      disabled={button.disabled}
                      onClick={button.onClick}
                    >
                      {button.label}
                    </button>
                  </Dialog.Close>
                ))}
              </div>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
