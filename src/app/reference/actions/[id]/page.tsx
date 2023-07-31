'use client'

import { EntityRecordPage } from '@/components/entity-record-page/entity-record-page'
import { usePathname } from 'next/navigation'

export default function ActionRecordpage() {
  const path: string[] = usePathname().split('/')
  const id = path[path.length - 1]

  return <EntityRecordPage _id={id} type="ACTION"></EntityRecordPage>
}
