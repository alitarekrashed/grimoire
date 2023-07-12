'use client'

import { Equipment } from '@/models/equipment'
import EquipmentCardList from './equipment-card-list'
import EquipmentGrid from './equipment-grid'
import { useEffect, useState } from 'react'

export default function EquipmentDisplay() {
  const [cards, setCards] = useState<Equipment[]>([])

  function displayCard(item: Equipment) {
    setCards((cards) => [...cards, item])
  }

  return (
    <div className="grid grid-cols-5">
      <div className="pl-5 col-span-3">
        <EquipmentGrid onSelectedItem={displayCard}></EquipmentGrid>
      </div>
      <div>
        <EquipmentCardList equipment={cards}></EquipmentCardList>
      </div>
    </div>
  )
}
