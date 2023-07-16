'use client'

import Condition from '@/models/condition'
import { CardFactory } from '@/utils/services/card-factory'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ConditionRecordPage() {
  const [condition, setCondition] = useState<Condition>()
  const path: string[] = usePathname().split('/')

  useEffect(() => {
    const id = path[path.length - 1]
    fetch(`http://localhost:3000/api/conditions/${id}`, {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((condition) => {
        setCondition(condition)
      })
  }, [])

  return (
    <div className="p-4">
      {condition &&
        CardFactory<T>({
          card: condition,
          contentTextSizeClassName: 'md',
          collapsible: false,
        })}
    </div>
  )
}
