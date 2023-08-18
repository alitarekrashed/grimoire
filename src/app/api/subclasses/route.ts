import { getSubclasses } from '@/utils/services/db.service'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') ?? undefined
  const className: string | undefined =
    searchParams.get('class_name') ?? undefined

  return NextResponse.json(await getSubclasses(name, className))
}
