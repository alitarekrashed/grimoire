'use client'

import SplitViewDisplay from '@/components/split-view-list/split-view-list'
import { useEffect, useState } from 'react'

export default function TraitsPage() {
  const [traits, setTraits] = useState([])
  const [columnDefs, setColumnDefs] = useState([
    { field: 'name', filter: true, flex: 1 },
    { field: 'id', hide: true },
  ])

  useEffect(() => {
    fetch('http://localhost:3000/api/traits', {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((traits) => {
        setTraits(traits)
      })
  }, [])

  return (
    <div className="h-full">
      <SplitViewDisplay
        columnDefs={columnDefs}
        entities={traits}
        gridSize="small"
      ></SplitViewDisplay>
    </div>
  )
}
