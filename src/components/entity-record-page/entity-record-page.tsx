'use client'

import { EntityModel, ModelType } from '@/models/db/entity-model'
import { CardFactory } from '@/utils/services/card-factory'
import { useEffect, useState } from 'react'

export function EntityRecordPage<T extends EntityModel>({
  _id,
  type,
}: {
  _id: string
  type: ModelType
}) {
  const [entity, setEntity] = useState<T>()

  useEffect(() => {
    fetch(`${baseUrlFactory(type)}/${_id}`, {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((val) => {
        setEntity(val)
      })
  }, [])

  return (
    <div className="p-4">
      {entity &&
        CardFactory<T>({
          card: entity,
          contentTextSizeClassName: 'md',
          collapsible: false,
        })}
    </div>
  )
}

// TODO ALI can this be a relative URL call?
function baseUrlFactory(type: ModelType) {
  switch (type) {
    case 'EQUIPMENT':
      return 'http://localhost:3000/api/equipment'
    case 'SPELL':
      return 'http://localhost:3000/api/spells'
    case 'TRAIT':
      return 'http://localhost:3000/api/traits'
    case 'CONDITION':
      return 'http://localhost:3000/api/conditions'
    case 'ANCESTRY':
      return 'http://localhost:3000/api/ancestries'
    case 'RULE':
      return 'http://localhost:3000/api/rules'
    case 'HERITAGE':
      return 'http://localhost:3000/api/heritages'
    case 'ACTION':
      return 'http://localhost:3000/api/actions'
    case 'BACKGROUND':
      return 'http://localhost:3000/api/backgrounds'
    default: // throw exception?
  }
}
