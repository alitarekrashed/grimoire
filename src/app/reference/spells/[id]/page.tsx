'use client'

import { EntityRecordPage } from '@/components/entity-record-page/entity-record-page'
import { usePathname } from 'next/navigation'

export default function SpellRecordPage() {
  const path: string[] = usePathname().split('/')
  const id = path[path.length - 1]

  return <EntityRecordPage id={id} type="SPELL"></EntityRecordPage>
}
