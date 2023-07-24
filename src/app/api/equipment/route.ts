import {
  Equipment,
  EquipmentVariantType,
  EquipmentWithVariants,
} from '@/models/equipment'
import { getAllEntities } from '@/utils/services/db.service'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const keepCollapsed = searchParams.get('keepCollapsed')
  const name = searchParams.get('name') ?? undefined

  let equipment: (Equipment | EquipmentWithVariants)[] = await getAllEntities(
    ['EQUIPMENT', 'EQUIPMENT_WITH_VARIANTS'],
    name
  )

  if (!keepCollapsed) {
    for (let i = 0; i < equipment.length; i++) {
      // converts an item with variants into their own standalone items.
      if (equipment[i].entity_type === 'EQUIPMENT_WITH_VARIANTS') {
        let item = equipment[i] as EquipmentWithVariants
        const variants: Equipment[] = item.types.map(
          (variant: EquipmentVariantType) => {
            return {
              ...item,
              ...variant,
              _id: item._id + '_' + variant.name,
              name: variant.name,
              description:
                item.description +
                (variant.description
                  ? '<br /><br />' + variant.description
                  : ''),
              types: [],
              entity_type: 'EQUIPMENT',
            }
          }
        )
        equipment.splice(i, 1, ...variants)
      }
    }
  }

  if (name) {
    equipment = equipment.filter((equipment) => equipment.name === name)
  }

  return NextResponse.json(equipment)
}
