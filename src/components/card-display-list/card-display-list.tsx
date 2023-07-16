import { roboto_serif_italic } from '@/utils/fonts'

export default function CardDisplayList({ children }: { children: any }) {
  return (
    <div className="h-full w-full">
      {children.length < 1 && (
        <span
          className={`${roboto_serif_italic.className} flex justify-center mt-8 text-stone-400 text-sm`}
        >
          Try selecting an item
        </span>
      )}
      <div>{children}</div>
    </div>
  )
}
