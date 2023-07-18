'use client'

import Trait from '@/models/trait'
import { CardFactory } from '@/utils/services/card-factory'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function TraitRecordPage() {
  const [trait, setTrait] = useState<Trait>()
  const path: string[] = usePathname().split('/')

  useEffect(() => {
    const id = path[path.length - 1]
    fetch(`http://localhost:3000/api/traits/${id}`, {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((trait) => {
        setTrait(trait)
      })
  }, [])

  return (
    <div className="p-4">
      {trait &&
        CardFactory<T>({
          card: trait,
          contentTextSizeClassName: 'md',
          collapsible: false,
        })}
    </div>
  )
}
