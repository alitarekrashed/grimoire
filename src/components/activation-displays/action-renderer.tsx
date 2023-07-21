import { ActionType, Activation } from '@/models/activation'
import Image from 'next/image'
import { ReactNode } from 'react'

export function ActionRenderer({
  activation,
  size,
}: {
  activation: Activation
  size: number
}) {
  return <>{getRendererByType(activation, size)}</>
}

function getRendererByType(activation: Activation, size: number): ReactNode {
  switch (activation.num_actions) {
    case 'one':
    case 'two':
    case 'three':
    case 'reaction':
    case 'free':
      return renderWithImage(
        activation,
        getActionValues(activation.num_actions),
        size
      )
    case 'one-to-three':
      return renderWithMultipleImages(activation, size)
    default:
      return renderWithoutImage(activation)
  }
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

function renderWithMultipleImages(activation: Activation, size: number) {
  const firstValue = getActionValues('one')
  const lastValue = getActionValues('three')
  return (
    <>
      <Image
        src={`/${firstValue.file}dark.png`}
        width={size}
        height={size}
        alt={firstValue.alt}
        className="inline"
      ></Image>
      &nbsp;to&nbsp;
      <Image
        src={`/${lastValue.file}dark.png`}
        width={size}
        height={size}
        alt={lastValue.alt}
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

function getActionValues(type: ActionType): ActionValues {
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
  }
}
