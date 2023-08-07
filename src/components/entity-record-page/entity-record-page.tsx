'use client'

import { EntityModel, ModelType } from '@/models/db/entity-model'
import { baseApiRouteFactory } from '@/utils/entity-url.factory'
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
    fetch(`${baseApiRouteFactory(type)}/${_id}`, {
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
