'use client'

import EquipmentCard from '@/components/equipment/equipment-card'
import { Equipment } from '@/models/equipment'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function EquipmentRecordPage() {
  const [equipment, setEquipment] = useState<Equipment>()
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
      {equipment && <EquipmentCard value={equipment}></EquipmentCard>}
    </div>
  )
}
