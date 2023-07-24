import { debounce } from 'lodash'
import { MutableRefObject, useEffect, useMemo, useRef } from 'react'

// https://www.developerway.com/posts/debouncing-in-react
const useDebounce = (callback: any) => {
  const ref: MutableRefObject<any> = useRef()

  useEffect(() => {
    ref.current = callback
  }, [callback])

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.()
    }

    return debounce(func, 250)
  }, [])

  return debouncedCallback
}

export { useDebounce }
