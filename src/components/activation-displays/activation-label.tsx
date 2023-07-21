import { Activation } from '@/models/equipment'
import { LabelsList } from '../labels-list/labels-list'
import { ParsedToken } from '../parsed-description/parsed-description'
import { ActionRenderer } from './action-renderer'

export function ActivationLabel({
  value,
  iconSize,
  labelClassName,
}: {
  value: Activation | undefined
  iconSize: number
  labelClassName?: string
}) {
  return value ? (
    <>
      <LabelsList
        fieldDefinitions={[
          {
            label: 'Activate',
            value: (
              <ActionRenderer value={value} size={iconSize}></ActionRenderer>
            ),
          },
        ]}
        labelClassName={labelClassName}
      ></LabelsList>
      {value.traits &&
        value.traits.map((trait) => (
          <ParsedToken key={trait} token={trait} type="TRAIT"></ParsedToken>
        ))}
      {value.traits && '; '}
    </>
  ) : (
    <></>
  )
}
