import { parseDescription } from '@/utils/services/description-parser.service'
import { isString } from 'lodash'
import { useEffect, useState } from 'react'

export function ParsedDescription({ description }: { description: string }) {
  const [parsed, setParsed] = useState([description])

  const parseDescriptionForRendering = () => {
    ;(async () => {
      let updated: any[] = await parseDescription(parsed)
      setParsed(updated)
    })()
  }

  useEffect(() => {
    parseDescriptionForRendering()
  }, [])

  return (
    <div>
      {/* TODO This allows the descriptions be html-like but comes at the risk of injection attacks... need to revist */}
      {/* TODO look into: https://www.npmjs.com/package/react-sanitized-html */}
      {parsed.map((value, index) => {
        return isString(value) ? (
          <span key={index} dangerouslySetInnerHTML={{ __html: value }}></span>
        ) : (
          <span key={index}>{value}</span>
        )
      })}
    </div>
  )
}
