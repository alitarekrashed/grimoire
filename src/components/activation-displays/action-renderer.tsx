import { ActionType, Activation } from '@/models/db/activation'
import Image from 'next/image'
import { ReactNode } from 'react'
import HoverableImage from '../base/hoverable-image'

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
      return renderWithMultipleImages('one', 'to', 'three', activation, size)
    case 'one-or-two':
      return renderWithMultipleImages('one', 'or', 'two', activation, size)
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
      <HoverableImage
        src={`/${actionValues.file}dark.png`}
        width={size}
        height={size}
        alt={actionValues.alt}
        className="inline"
      ></HoverableImage>
      &nbsp;
      {!activation?.override_label ?? activation.action}
    </>
  )
}

function renderWithMultipleImages(
  first: ActionType,
  preposition: string,
  last: ActionType,
  activation: Activation,
  size: number
) {
  const firstValue = getActionValues(first)
  const lastValue = getActionValues(last)
  return (
    <>
      <HoverableImage
        src={`/${firstValue.file}dark.png`}
        width={size}
        height={size}
        alt={firstValue.alt}
        className="inline"
      ></HoverableImage>
      &nbsp;{preposition}&nbsp;
      <HoverableImage
        src={`/${lastValue.file}dark.png`}
        width={size}
        height={size}
        alt={lastValue.alt}
        className="inline"
      ></HoverableImage>
      &nbsp;
      {!activation?.override_label ?? activation.action}
    </>
  )
}

function renderWithoutImage(activation: Activation) {
  return (
    <>
      {activation.num_actions}
      {activation.override_label || !activation.action
        ? ''
        : ` (${activation.action})`}
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
