import {
  Inter,
  DM_Serif_Display,
  Roboto_Serif,
  Ysabeau,
} from 'next/font/google'

export const inter = Inter({ subsets: ['latin'] })
export const dm_serif_display = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
})
export const roboto_serif = Roboto_Serif({ subsets: ['latin'] })
export const roboto_serif_italic = Roboto_Serif({
  subsets: ['latin'],
  style: 'italic',
})
export const ysabeau = Ysabeau({
  subsets: ['latin'],
  style: 'normal',
  weight: '800',
})
