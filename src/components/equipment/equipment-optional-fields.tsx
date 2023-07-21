import { Equipment, EquipmentWithVariants } from '@/models/equipment'
import { CardLabelList, FieldDefinition } from '../card/card-label-list'
import { getPriceValue } from '@/utils/services/currency-utils'

// TODO add equipment id to key here?
export function EquipmentOptionalFields({
  value,
}: {
  value: Equipment | EquipmentWithVariants
}) {
  const fields: FieldDefinition[] = [
    {
      label: 'Hands',
      value: value.hands,
    },
    {
      label: 'Usage',
      value: value.usage,
    },
    {
      label: 'Bulk',
      value: value.bulk,
    },
  ]

  if (value.entity_type === 'EQUIPMENT') {
    fields.splice(0, 0, {
      label: 'Price',
      value: getPriceValue((value as Equipment).price),
    })
    console.log(fields)
  }

  return <CardLabelList fieldDefinitions={fields}></CardLabelList>
}
