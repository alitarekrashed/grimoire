import React, { useState } from 'react'

const DEFAULT_VALUE: {
  level: number
} = {
  level: 1,
}

export const CharacterLevelContext = React.createContext(DEFAULT_VALUE)
