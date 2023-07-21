import { Activation } from '@/models/equipment'
import { LabelsList } from '../labels-list/labels-list'
import { ActionRenderer } from './action-renderer'
import { ParsedToken } from '../parsed-description/parsed-description'
import { ReactNode } from 'react'

export function ActivationLabel({ value }: { value: Activation | undefined }) {
  return value ? (
    <>
      <LabelsList
        fieldDefinitions={[
          {
            label: 'Activate',
            value: <ActionRenderer value={value} size={18}></ActionRenderer>,
          },
        ]}
        labelClassName="font-bold"
      ></LabelsList>
      &nbsp;
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
