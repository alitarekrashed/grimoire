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
  closeButtons: { label: string; onClick: () => void }[]
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
            className={`bg-stone-900 rounded-md focus:outline-none border border-stone-300/20 h-full overflow-y-scroll`}
          >
            <Dialog.Title />
            {body}
            <div className="absolute w-full bottom rounded-b-md border-y border-r border-stone-300/20 bg-stone-900 bottom-0 min-w-min">
              <div className="inline-flex gap-2 p-2">
                {closeButtons.map((button) => (
                  <Dialog.Close key={button.label}>
                    <span
                      className={`py-0.5 px-2 text-sm border border-stone-300 rounded-md ${roboto_flex.className} hover:bg-stone-600`}
                      aria-label={button.label}
                      onClick={button.onClick}
                    >
                      {button.label}
                    </span>
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
