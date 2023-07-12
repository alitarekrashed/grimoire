'use client'

import { Equipment } from '@/models/equipment'
import { useState } from 'react'
import EquipmentCardList from './equipment-card-list'
import EquipmentGrid from './equipment-grid'

export default function EquipmentDisplay() {
  const [cards, setCards] = useState<Equipment[]>([])

  function displayCard(item: Equipment) {
    setCards((cards) => {
      let index: number = cards.indexOf(item)
      if (index === -1) {
        return [item, ...cards]
      } else {
        // this shifts the selected card to the top... maybe unnecessary?
        let shiftedCards = cards.slice()
        shiftedCards.splice(index, 1)
        shiftedCards.unshift(item)
        return shiftedCards
      }
    })
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
