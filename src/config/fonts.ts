import { Montserrat } from 'next/font/google';

export const fontSans = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-sans',
  display: 'swap',
});

export const fontHeading = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-heading',
  display: 'swap',
});