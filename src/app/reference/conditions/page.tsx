'use client'

import ConditionCard from '@/components/conditions/condition-card'
import SplitViewDisplay from '@/components/split-view-list/split-view-list'
import { useEffect, useState } from 'react'

export default function ConditionsPage() {
  const [conditions, setConditions] = useState([])
  const [columnDefs, setColumnDefs] = useState([
    { field: 'name', filter: true, flex: 1 },
  ])

  useEffect(() => {
    fetch('http://localhost:3000/api/conditions', {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((conditions) => {
        setConditions(conditions)
      })
  }, [])

  return (
    <div className="h-full">
      <SplitViewDisplay
        columnDefs={columnDefs}
        entities={conditions}
        buildCard={(condition: Condition) => (
          <ConditionCard value={condition}></ConditionCard>
        )}
      ></SplitViewDisplay>
    </div>
  )
}
