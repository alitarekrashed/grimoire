import {
  Inter,
  DM_Serif_Display,
  Roboto_Serif,
  Ysabeau,
  Roboto_Condensed,
  Roboto_Flex,
  Roboto,
} from 'next/font/google'

export const inter = Inter({ subsets: ['latin'] })
export const dm_serif_display = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
})
export const roboto_serif = Roboto_Serif({ subsets: ['latin'] })
export const roboto = Roboto({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
})
export const roboto_condensed = Roboto_Condensed({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
})
export const roboto_flex = Roboto_Flex({
  subsets: ['latin'],
})
export const roboto_serif_italic = Roboto_Serif({
  subsets: ['latin'],
  style: 'italic',
})
export const ysabeau = Ysabeau({
  subsets: ['latin'],
  style: 'normal',
  weight: '800',
})

export const ysabeau_semibold = Ysabeau({
  subsets: ['latin'],
  style: 'normal',
  weight: '600',
})

export const ysabeau_thin = Ysabeau({
  subsets: ['latin'],
  style: 'normal',
  weight: '400',
})
