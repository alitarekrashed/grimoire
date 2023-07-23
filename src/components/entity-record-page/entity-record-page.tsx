'use client'

import { EntityModel, ModelType } from '@/models/entity-model'
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
    default: // throw exception?
  }
}
