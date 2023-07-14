'use client'

import ConditionCard from '@/components/conditions/condition-card'
import SplitViewDisplay from '@/components/split-view-list/split-view-list'
import Condition from '@/models/condition'
import { useEffect, useState } from 'react'

export default function ConditionsPage() {
  const [conditions, setConditions] = useState([])
  const [columnDefs, setColumnDefs] = useState([
    { field: 'name', filter: true, flex: 1 },
    { field: 'id', hide: true },
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
        buildCard={(
          condition: Condition,
          onRemoved: (condition: Condition) => void
        ) => (
          <ConditionCard
            value={condition}
            contentTextSizeClassName="sm"
            collapsible={true}
            onRemoved={onRemoved}
          ></ConditionCard>
        )}
        gridSize={1}
      ></SplitViewDisplay>
    </div>
  )
}
