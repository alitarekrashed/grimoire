'use client'

import { Equipment } from '@/models/equipment'
import { useEffect, useState } from 'react'
import CardDisplayList from './card-display-list/card-display-list'
import EquipmentCard from './equipment-card'
import SelectableGrid from './selectable-grid/selectable-grid'

export default function EquipmentDisplay() {
  const [equipment, setEquipment] = useState([])
  const [cards, setCards] = useState<Equipment[]>([])
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

  function handleSelectedCard(item: Equipment) {
    setCards((cards) => {
      let index: number = cards.indexOf(item)
      if (index === -1) {
        return [item, ...cards]
      } else {
        // this shifts the selected card to the top... maybe unnecessary?
        // what if it autoscrolled to their position???
        let shiftedCards = cards.slice()
        shiftedCards.splice(index, 1)
        shiftedCards.unshift(item)
        return shiftedCards
      }
    })
  }

  return (
    <div className="h-full grid grid-cols-5 gap-x-4">
      <div className="bg-neutral-800 p-3 rounded col-span-3 shadow-slate-200 drop-shadow-md">
        <SelectableGrid
          rowData={equipment}
          onSelectedItem={handleSelectedCard}
          columnDefs={columnDefs}
        ></SelectableGrid>
      </div>
      <div className="h-full bg-neutral-800 p-3 rounded overflow-y-scroll col-span-2 shadow-slate-200 drop-shadow-md">
        <CardDisplayList
          children={cards.map((value) => (
            <div key={value.name} className="pb-4">
              <EquipmentCard value={value}></EquipmentCard>
            </div>
          ))}
        ></CardDisplayList>
      </div>
    </div>
  )
}
