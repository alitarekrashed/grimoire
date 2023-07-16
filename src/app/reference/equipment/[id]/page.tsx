'use client'

import EquipmentCard from '@/components/equipment/equipment-card'
import { Equipment, EquipmentWithVariant } from '@/models/equipment'
import { CardFactory } from '@/utils/services/card-factory'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function EquipmentRecordPage() {
  const [equipment, setEquipment] = useState<Equipment | EquipmentWithVariant>()
  const path: string[] = usePathname().split('/')

  useEffect(() => {
    const id = path[path.length - 1]
    fetch(`http://localhost:3000/api/equipment/${id}`, {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((equipment) => {
        setEquipment(equipment)
      })
  }, [])

  return (
    <div className="p-4">
      {equipment &&
        CardFactory<T>({
          card: equipment,
          contentTextSizeClassName: 'md',
          collapsible: false,
        })}
    </div>
  )
}
