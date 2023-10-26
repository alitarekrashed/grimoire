import { roboto_serif } from '@/utils/fonts'
import * as HoverCard from '@radix-ui/react-hover-card'
import { ReactNode } from 'react'

export function HoverDisplay({
  title,
  size,
  content,
}: {
  size?: 'fit' | 'small'
  title: ReactNode
  content: ReactNode
}) {
  const width: string = (() => {
    switch (size) {
      case 'fit':
        return ''
      case 'small':
        return 'w-56'
      default:
        return 'w-128'
    }
  })()

  return (
    <>
      <HoverCard.Root openDelay={200} closeDelay={100}>
        <HoverCard.Trigger>{title}</HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content
            className={`data-[side=bottom]:animate-slideUpAndFade data-[side=right]:animate-slideLeftAndFade data-[side=left]:animate-slideRightAndFade data-[side=top]:animate-slideDownAndFade rounded-md border border-stone-300 p-4 ${width} text-xs bg-stone-800 shadow-stone-400 shadow ${roboto_serif.className}`}
          >
            {content}
            <HoverCard.Arrow className="fill-stone-600" />
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </>
  )
}
