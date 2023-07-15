'use client'

import { Source } from '@/models/equipment'
import { roboto_serif } from '@/utils/fonts'
import * as Collapsible from '@radix-ui/react-collapsible'
import * as Separator from '@radix-ui/react-separator'
import { useEffect, useState } from 'react'
import { ParsedDescription } from '../parsed-description/parsed-description'
import styles from './card.module.css'
import Traits from './traits-display'
import SourceDisplay from './source-display'

export interface CardData {
  name: string
  level?: number
  types?: { level: number }[]
  description: string
  traits?: string[]
  rarity?: string
  source: Source
}

export default function Card<T extends CardData>({
  data,
  type,
  attributes,
  additionalContent,
  contentTextSizeClassName,
  collapsible,
  onRemoved,
}: {
  data: T
  type: string
  attributes?: any
  additionalContent?: any
  contentTextSizeClassName?: string
  collapsible?: boolean
  onRemoved?: (item: T) => void
}) {
  const [fadeIn, setFadeIn] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setFadeIn(() => true)
    }, 1)
  }, [])

  return (
    <div
      className={`transition-opacity duration-1000 ${
        fadeIn ? 'opacity-100' : 'opacity-0'
      } grid grid-cols-1 p-3 border border-stone-400 rounded bg-stone-800 shadow-stone-400 drop-shadow-md ${
        roboto_serif.className
      }`}
    >
      <Collapsible.Root defaultOpen={true} disabled={collapsible === false}>
        <Collapsible.Trigger className="w-full">
          <CardHeader
            name={data.name}
            type={type}
            level={
              data.level ?? data.types?.map((val) => val.level) ?? undefined
            }
          ></CardHeader>
        </Collapsible.Trigger>
        <Collapsible.Content className={`${styles.cardContent}`}>
          {data.traits && (
            <Traits rarity={data.rarity} traits={data.traits}></Traits>
          )}
          {attributes}
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
            {additionalContent}
          </div>
          <br />
          <div className="flex justify-between align-middle text-[10px]">
            {onRemoved && (
              <button
                className="border rounded-md border-stone-500 p-1 hover:bg-stone-400 bg-stone-900"
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
