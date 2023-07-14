'use client'

import Condition from '@/models/condition'
import { useEffect, useState } from 'react'
import SplitViewDisplay from '../split-view-list/split-view-list'
import ConditionCard from './condition-card'

export default function ConditionsDisplay() {
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
    <SplitViewDisplay
      columnDefs={columnDefs}
      entities={conditions}
      buildCard={(condition: Condition) => (
        <ConditionCard value={condition}></ConditionCard>
      )}
    ></SplitViewDisplay>
  )
}
