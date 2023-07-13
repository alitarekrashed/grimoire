import { isString } from 'lodash'
import { retrieveCondition } from './condition.service'
import React from 'react'
import Condition from '@/models/condition'
import ConditionHover from '@/components/condition-hover/condition-hover'

export function parseDescription(description: any[]): Promise<any[]> {
  return (async () => {
    let tokenizedDescription = [...description]
    for (let i = 0; i < tokenizedDescription.length; i++) {
      let currentPart = tokenizedDescription[i]

      if (isString(currentPart) && currentPart.includes('@condition:')) {
        const brokenUpDescription = await createComponentsForConditions(
          currentPart
        )
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
      j !== tokens.length - 1 &&
        mapping.push(
          React.createElement(ConditionHover, {
            value: condition,
            key: condition.identifier,
          })
        )
      newParts = newParts.concat(mapping)
    }
    return newParts
  })()
}
