import { ModelType } from '@/models/db/entity-model'
import {
  createComponentsForType,
  parseDescription,
} from '@/utils/services/description-parser.service'
import { isString } from 'lodash'
import { useEffect, useState } from 'react'

export function ParsedDescription({ description }: { description: string }) {
  const [parsed, setParsed] = useState([description])

  const parseDescriptionForRendering = (toParse: string) => {
    ;(async () => {
      let updated: any[] = await parseDescription([toParse])
      setParsed(updated)
    })()
  }

  useEffect(() => {
    parseDescriptionForRendering(description)
  }, [description])

  return (
    <>
      {/* TODO This allows the descriptions be html-like but comes at the risk of injection attacks... need to revist */}
      {/* TODO look into: https://www.npmjs.com/package/react-sanitized-html */}
      {parsed.map((value, index) => {
        return isString(value) ? (
          <span key={index} dangerouslySetInnerHTML={{ __html: value }}></span>
        ) : (
          <span key={index}>{value}</span>
        )
      })}
    </>
  )
}

export function ParsedToken({
  token,
  type,
}: {
  token: string
  type: ModelType
}) {
  const [parsed, setParsed] = useState([token])

  const parseTokenForRendering = () => {
    ;(async () => {
      let updated: any[] = await createComponentsForType(
        `@${type.toLowerCase()}:${token}@`,
        type
      )
      setParsed(updated)
    })()
  }

  useEffect(() => {
    parseTokenForRendering()
  }, [])

  // this is hacky, should be smarter, maybe map all of them with a key, even if two of the elements are empty arrays
  // returns ['', <element>, '']
  return <>{parsed[1]}</>
}
