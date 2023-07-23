'use client'

import { Activation } from '@/models/activation'
import { EntityModel } from '@/models/entity-model'
import { roboto_serif } from '@/utils/fonts'
import * as Collapsible from '@radix-ui/react-collapsible'
import * as Separator from '@radix-ui/react-separator'
import { RefObject, useCallback, useEffect, useState } from 'react'
import { ActivationDescription } from '../activation-displays/activation-description'
import { ParsedDescription } from '../parsed-description/parsed-description'
import styles from './card.module.css'
import SourceDisplay from './source-display'
import { TraitsList } from './traits-list'

export default function Card<T extends EntityModel>({
  reference,
  data,
  type,
  level,
  traits,
  rarity,
  attributes,
  activation,
  additionalContent,
  contentTextSizeClassName,
  collapsible,
  onRemoved,
}: {
  reference?: RefObject<HTMLDivElement>
  data: T
  type: string
  level?: number | number[] | undefined
  traits?: string[]
  rarity?: string
  attributes?: any
  activation?: Activation
  additionalContent?: any
  contentTextSizeClassName?: string
  collapsible?: boolean
  onRemoved?: (item: T) => void
}) {
  const [ref, setRef] = useState<RefObject<HTMLDivElement>>(reference)
  const [fadeIn, setFadeIn] = useState(false)

  const hasShortActivation = !activation?.effect

  useEffect(() => {
    setTimeout(() => {
      setFadeIn(() => true)
    }, 1)
  }, [])

  useEffect(() => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [ref])

  return (
    <div
      ref={reference}
      className={`transition-opacity duration-1000 ${
        fadeIn ? 'opacity-100' : 'opacity-0'
      } grid grid-cols-1 p-3 border border-stone-400 rounded bg-stone-800 shadow-stone-400 drop-shadow-md ${
        roboto_serif.className
      }`}
    >
      <Collapsible.Root defaultOpen={true} disabled={collapsible === false}>
        <Collapsible.Trigger className="w-full">
          <CardHeader name={data.name} type={type} level={level}></CardHeader>
        </Collapsible.Trigger>
        <Collapsible.Content className={`${styles.cardContent}`}>
          {traits && (
            <div className="my-1">
              <TraitsList rarity={rarity} traits={traits}></TraitsList>
            </div>
          )}
          {attributes}
          {hasShortActivation && (
            <span className="text-sm">
              <ActivationDescription
                value={activation}
                labelClassName="font-medium"
              ></ActivationDescription>
            </span>
          )}
          <Separator.Root
            className="w-full bg-stone-400	h-px"
            style={{ margin: '10px 0' }}
          />
          <div
            className={`${
              contentTextSizeClassName
                ? `text-${contentTextSizeClassName}`
                : 'text-xs'
            }`}
          >
            <ParsedDescription
              description={data.description}
            ></ParsedDescription>
            {hasShortActivation === false && (
              <>
                <br />
                <ActivationDescription
                  value={activation}
                ></ActivationDescription>
              </>
            )}

            {additionalContent}
          </div>
          <br />
          <div className="flex justify-between align-middle text-[10px]">
            {onRemoved && (
              <button
                className="border rounded-md border-stone-500 p-1 hover:bg-stone-700 bg-stone-900"
                onClick={() => onRemoved(data)}
              >
                Remove
              </button>
            )}
            <div className="flex place-self-center">
              <SourceDisplay value={data.source}></SourceDisplay>
            </div>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  )
}

function CardHeader({
  name,
  type,
  level,
}: {
  name: string
  type: string
  level: number | number[] | undefined
}) {
  let displayLevel: string = level ? '' + level : ''
  if (Array.isArray(level)) {
    level.sort((a, b) => a - b)
    displayLevel = '' + level[0]
    displayLevel = level.length > 1 ? displayLevel.concat('+') : displayLevel
  }

  return (
    <div className="grid grid-cols-4 justify-between text-xl font-semibold">
      <div className="col-span-3 justify-self-start capitalize">{name}</div>
      <div className="justify-self-end">
        {type} {displayLevel}
      </div>
    </div>
  )
}
