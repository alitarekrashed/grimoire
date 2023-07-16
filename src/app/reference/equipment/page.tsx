'use client'

import EquipmentCard from '@/components/equipment/equipment-card'
import SplitViewDisplay from '@/components/split-view-list/split-view-list'
import { Equipment, EquipmentWithVariant } from '@/models/equipment'
import { SortDirection } from 'ag-grid-community'
import { useEffect, useState } from 'react'

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState([])
  const [columnDefs, setColumnDefs] = useState([
    {
      field: 'level',
      filter: true,
      sort: 'asc' as SortDirection,
      maxWidth: 90,
      flex: 1,
    },
    { field: 'name', filter: true, flex: 1 },
    { field: 'category', filter: true, flex: 1 },
    { field: 'source.title', headerName: 'Source', filter: true, flex: 1 },
    {
      field: 'rarity',
      filter: true,
      valueFormatter: (value: any): string => value.data.rarity ?? 'common',
      flex: 1,
      maxWidth: 150,
    },
  ])

  useEffect(() => {
    fetch('http://localhost:3000/api/equipment', {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((equipment) => {
        setEquipment(equipment)
      })
  }, [])

  return (
    <div className="h-full">
      <SplitViewDisplay
        columnDefs={columnDefs}
        entities={equipment}
      ></SplitViewDisplay>
    </div>
  )
}
