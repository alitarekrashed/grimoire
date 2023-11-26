'use client'

import SplitViewDisplay from '@/components/split-view-list/split-view-list'
import { Source } from '@/models/db/entity-model'
import { SortDirection } from 'ag-grid-community'
import { useEffect, useState } from 'react'

export default function SpellsPage() {
  const [spells, setSpells] = useState([])
  const [columnDefs, setColumnDefs] = useState([
    {
      field: 'rank',
      filter: true,
      sort: 'asc' as SortDirection,
      maxWidth: 90,
      flex: 1,
    },
    {
      field: 'type',
      filter: true,
      flex: 1,
      valueFormatter: (value: any): string => {
        if (value.data.traits.includes('cantrip')) {
          return 'Cantrip'
        }
        if (value.data.focus) {
          return 'Focus'
        }
        return 'Spell'
      },
    },
    { field: 'name', filter: true, flex: 1 },
    { field: 'traditions', filter: true, flex: 1 },
    {
      field: 'source',
      headerName: 'Source',
      filter: true,
      flex: 1,
      valueFormatter: (value: any): string => value.data.source[0]?.title,
    },
    {
      field: 'rarity',
      filter: true,
      valueFormatter: (value: any): string => value.data.rarity ?? 'common',
      flex: 1,
      maxWidth: 150,
    },
  ])

  useEffect(() => {
    fetch('http://localhost:3000/api/spells', {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((spells) => {
        setSpells(spells)
      })
  }, [])

  return (
    <div className="h-full">
      <SplitViewDisplay
        columnDefs={columnDefs}
        entities={spells}
      ></SplitViewDisplay>
    </div>
  )
}
