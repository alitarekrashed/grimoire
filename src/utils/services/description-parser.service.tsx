import EntityDescriptionHover from '@/components/entity-description-hover'
import Condition from '@/models/condition'
import Trait from '@/models/trait'
import { cond, isString } from 'lodash'
import React from 'react'
import { retrieveCondition } from './condition.service'
import { retrieveTrait } from './trait.service'

export function parseDescription(description: any[]): Promise<any[]> {
  return (async () => {
    let tokenizedDescription = [...description]
    for (let i = 0; i < tokenizedDescription.length; i++) {
      let currentPart = tokenizedDescription[i]

      let index = i

      if (isString(currentPart) && currentPart.includes('@condition:')) {
        const brokenUpDescription = await createComponentsForConditions(
          currentPart
        )
        tokenizedDescription.splice(index, 1, ...brokenUpDescription)
        index = index + (brokenUpDescription.length - 1)
        currentPart = brokenUpDescription[0]
      }

      if (isString(currentPart) && currentPart.includes('@trait:')) {
        const brokenUpDescription = await createComponentsForTraits(currentPart)
        tokenizedDescription.splice(i, 1, ...brokenUpDescription)
      }
    }
    return tokenizedDescription
  })()
}

function createComponentsForConditions(currentPart: string): Promise<any[]> {
  return (async () => {
    const key = currentPart.split('@condition:')[1].match(/^[^@]*/)![0]
    let tokens: any[] = currentPart.split(`@condition:${key}@`)
    const condition: Condition = await retrieveCondition(key)
    let newParts: any[] = []
    for (let j = 0; j < tokens.length; j++) {
      let mapping: any[] = [tokens[j]]
      let notLastToken = j !== tokens.length - 1
      if (condition) {
        notLastToken &&
          mapping.push(
            React.createElement(EntityDescriptionHover, {
              value: condition,
              key: condition.id,
            })
          )
      } else {
        notLastToken &&
          mapping.push(
            <span className="underline" tabIndex={0}>
              {key}
            </span>
          )
      }
      newParts = newParts.concat(mapping)
    }
    return newParts
  })()
}

function createComponentsForTraits(currentPart: string): Promise<any[]> {
  return (async () => {
    const key = currentPart.split('@trait:')[1].match(/^[^@]*/)![0]
    let tokens: any[] = currentPart.split(`@trait:${key}@`)
    const trait: Trait = await retrieveTrait(key)
    let newParts: any[] = []

    for (let j = 0; j < tokens.length; j++) {
      let mapping: any[] = [tokens[j]]
      let notLastToken = j !== tokens.length - 1
      if (trait) {
        notLastToken &&
          mapping.push(
            React.createElement(EntityDescriptionHover, {
              value: trait,
              key: trait.id,
            })
          )
      } else {
        notLastToken &&
          mapping.push(
            <span className="underline" tabIndex={0}>
              {key}
            </span>
          )
      }
      newParts = newParts.concat(mapping)
    }
    return newParts
  })()
}
