import { Equipment, EquipmentWithVariants } from '@/models/db/equipment'
import { LabelsList, FieldDefinition } from '../labels-list/labels-list'
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

  return (
    <>
      {value.entity_type === 'EQUIPMENT' && (
        <div>
          <LabelsList
            fieldDefinitions={[
              {
                label: 'Price',
                value: getPriceValue((value as Equipment).price),
              },
            ]}
          ></LabelsList>
        </div>
      )}
      <LabelsList fieldDefinitions={fields}></LabelsList>
    </>
  )
}
