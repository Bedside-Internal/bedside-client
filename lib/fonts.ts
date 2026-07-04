import { DM_Sans, Instrument_Serif, Poppins } from "next/font/google";

export const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700", "800"],
});