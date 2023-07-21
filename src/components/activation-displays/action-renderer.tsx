import { Activation } from '@/models/equipment'
import Image from 'next/image'

export function ActionRenderer({
  value,
  size,
}: {
  value: Activation
  size: number
}) {
  const image = (
    <Image
      src={`/${actionMap[value.num_actions].file}dark.png`}
      width={size}
      height={size}
      alt={actionMap[value.num_actions].alt}
      className="inline"
    ></Image>
  )

  return (
    <>
      {image}&nbsp;{value.action}
    </>
  )
}

interface ActionValues {
  file: string
  alt: string
}

const actionMap: {
  one: ActionValues
  two: ActionValues
  three: ActionValues
  reaction: ActionValues
  free: ActionValues
} = {
  one: {
    file: 'one-action-',
    alt: 'Single action',
  },
  two: {
    file: 'two-actions-',
    alt: 'Two actions',
  },
  three: {
    file: 'three-actions-',
    alt: 'Three actions',
  },
  reaction: {
    file: 'reaction-',
    alt: 'Reaction',
  },
  free: {
    file: 'free-action-',
    alt: 'Free action',
  },
}
