import { getAllCharacters } from '@/utils/services/db.service'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  return NextResponse.json(await getAllCharacters())
}
