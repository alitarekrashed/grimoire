import { ActionType, Activation } from '@/models/equipment'
import Image from 'next/image'
import { ReactNode } from 'react'

export function ActionRenderer({
  activation,
  size,
}: {
  activation: Activation
  size: number
}) {
  const values = getActionValues(activation.num_actions)

  return (
    <>
      {values
        ? renderWithImage(activation, values, size)
        : renderWithoutImage(activation)}
    </>
  )
}

function renderWithImage(
  activation: Activation,
  actionValues: ActionValues,
  size: number
) {
  return (
    <>
      <Image
        src={`/${actionValues.file}dark.png`}
        width={size}
        height={size}
        alt={actionValues.alt}
        className="inline"
      ></Image>
      &nbsp;
      {activation.action}
    </>
  )
}

function renderWithoutImage(activation: Activation) {
  return (
    <>
      {activation.num_actions}
      &nbsp;
      {`(${activation.action})`}
    </>
  )
}

interface ActionValues {
  file: string
  alt: string
}

function getActionValues(type: ActionType): ActionValues | undefined {
  switch (type) {
    case 'one':
      return {
        file: 'one-action-',
        alt: 'Single action',
      }
    case 'two':
      return {
        file: 'two-actions-',
        alt: 'Two actions',
      }
    case 'three':
      return {
        file: 'three-actions-',
        alt: 'Three actions',
      }
    case 'reaction':
      return {
        file: 'reaction-',
        alt: 'Reaction',
      }
    case 'free':
      return {
        file: 'free-action-',
        alt: 'Free action',
      }
    default:
      return undefined
  }
}
