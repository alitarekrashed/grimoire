'use client'

import Condition from '@/models/condition'
import { useState } from 'react'
import Card from '../card/card'

export default function ConditionCard({ value }: { value: Condition }) {
  const [fadeIn, setFadeIn] = useState(false)

  return <Card data={value} type="Condition"></Card>
}
