import { Activation } from '@/models/equipment'
import { CardLabelList } from '../card/card-label-list'
import { ActionRenderer } from './action-renderer'
import { ParsedToken } from '../parsed-description/parsed-description'
import { ReactNode } from 'react'

export function ActivationLabel({ value }: { value: Activation | undefined }) {
  return value ? (
    <>
      <CardLabelList
        fieldDefinitions={[
          {
            label: 'Activate',
            value: <ActionRenderer value={value} size={18}></ActionRenderer>,
          },
        ]}
        labelClassName="font-bold"
      ></CardLabelList>
      &nbsp;
      {value.traits &&
        value.traits.map((trait) => (
          <ParsedToken key={trait} token={trait} type="TRAIT"></ParsedToken>
        ))}
      ;&nbsp;
    </>
  ) : (
    <></>
  )
}
