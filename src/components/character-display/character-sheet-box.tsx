import { ReactNode } from 'react'

export function CharacterSheetBox({
  children,
}: {
  children: ReactNode[] | ReactNode
}) {
  return (
    <div className="text-xs w-full text-center mx-2 mb-2 p-2 rounded-md border border-b-stone-300 bg-stone-800">
      {children}
    </div>
  )
}
