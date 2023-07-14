'use client'

import ConditionCard from '@/components/conditions/condition-card'
import Condition from '@/models/condition'
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
      {condition && <ConditionCard value={condition}></ConditionCard>}
    </div>
  )
}
