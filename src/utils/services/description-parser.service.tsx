import EntityHoverableDescription from '@/components/entity-hoverable-description/entity-description-hover'
import EntityModal from '@/components/entity-modal/entity-modal'
import { EntityModel, ModelType } from '@/models/db/entity-model'
import { isString } from 'lodash'
import React from 'react'
import { retrieveCondition } from './condition.service'
import { retrieveEquipment } from './equipment.service'
import { retrieveSpell } from './spell.service'
import { retrieveTrait } from './trait.service'
import { retrieveRule } from './rule.service'

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

      if (isString(currentPart) && currentPart.includes('@spell:')) {
        const brokenUpDescription = await createComponentsForType(
          currentPart,
          'SPELL'
        )
        tokenizedDescription.splice(index, 1, ...brokenUpDescription)
        index = index + (brokenUpDescription.length - 1)
        currentPart = brokenUpDescription[0]
      }

      if (isString(currentPart) && currentPart.includes('@rule:')) {
        const brokenUpDescription = await createComponentsForType(
          currentPart,
          'RULE'
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
              _id: entity._id,
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
    case 'SPELL':
      return retrieveSpell
    case 'RULE':
      return retrieveRule

    default:
      return () => undefined!
  }
}

function displayComponentFactory(
  type: ModelType,
  value: EntityModel
): (value: any) => JSX.Element {
  switch (type) {
    case 'SPELL':
    case 'EQUIPMENT':
      return EntityModal
    default:
      return EntityHoverableDescription
  }
}
