import { EntityModel, ModelType } from '@/models/entity-model'
import { isString } from 'lodash'
import React, { FunctionComponent, ReactNode } from 'react'
import { retrieveCondition } from './condition.service'
import { retrieveTrait } from './trait.service'
import EntityHoverableDescription from '@/components/entity-hoverable-description/entity-description-hover'
import { retrieveEquipment } from './equipment.service'
import EntityModal from '@/components/entity-modal/entity-modal'

export function parseDescription(description: any[]): Promise<any[]> {
  return (async () => {
    let tokenizedDescription = [...description]
    for (let i = 0; i < tokenizedDescription.length; i++) {
      let currentPart = tokenizedDescription[i]

      let index = i

      if (isString(currentPart) && currentPart.includes('@condition:')) {
        const brokenUpDescription = await createComponentsForType(
          currentPart,
          'CONDITION'
        )
        tokenizedDescription.splice(index, 1, ...brokenUpDescription)
        index = index + (brokenUpDescription.length - 1)
        currentPart = brokenUpDescription[0]
      }

      if (isString(currentPart) && currentPart.includes('@equipment:')) {
        const brokenUpDescription = await createComponentsForType(
          currentPart,
          'EQUIPMENT'
        )
        tokenizedDescription.splice(index, 1, ...brokenUpDescription)
        index = index + (brokenUpDescription.length - 1)
        currentPart = brokenUpDescription[0]
      }

      if (isString(currentPart) && currentPart.includes('@trait:')) {
        const brokenUpDescription = await createComponentsForType(
          currentPart,
          'TRAIT'
        )
        tokenizedDescription.splice(i, 1, ...brokenUpDescription)
      }
    }
    return tokenizedDescription
  })()
}

export function createComponentsForType(
  currentPart: string,
  type: ModelType
): Promise<any[]> {
  return (async () => {
    let lookupFunction: (key: any) => Promise<EntityModel> =
      lookupFunctionFactory(type)
    let lowercasedKey = type.toLowerCase()
    const key = currentPart.split(`@${lowercasedKey}:`)[1].match(/^[^@]*/)![0]
    let tokens: any[] = currentPart.split(`@${lowercasedKey}:${key}@`)
    const entity: EntityModel = await lookupFunction(key)
    let newParts: any[] = []

    for (let j = 0; j < tokens.length; j++) {
      let mapping: any[] = [tokens[j]]
      let notLastToken = j !== tokens.length - 1
      if (entity) {
        notLastToken &&
          mapping.push(
            React.createElement(displayComponentFactory(type, entity), {
              value: entity,
              id: entity.id,
            })
          )
      } else {
        notLastToken &&
          mapping.push(
            <span key={key} tabIndex={0}>
              {key}
            </span>
          )
      }
      newParts = newParts.concat(mapping)
    }
    return newParts
  })()
}

function lookupFunctionFactory(
  type: ModelType
): (key: any) => Promise<EntityModel> {
  switch (type) {
    case 'CONDITION':
      return retrieveCondition
    case 'TRAIT':
      return retrieveTrait
    case 'EQUIPMENT':
      return retrieveEquipment
    default:
      return () => undefined!
  }
}

function displayComponentFactory(
  type: ModelType,
  value: EntityModel
): (value: any) => JSX.Element {
  switch (type) {
    case 'EQUIPMENT':
      return EntityModal
    default:
      return EntityHoverableDescription
  }
}
