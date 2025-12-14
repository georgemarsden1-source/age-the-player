import p1 from '@assets/stock_images/professional_soccer__d8d58f8f.jpg';
import p2 from '@assets/stock_images/professional_soccer__32e10e7b.jpg';
import p3 from '@assets/stock_images/professional_soccer__ea6b2853.jpg';
import p4 from '@assets/stock_images/professional_soccer__aa7d810d.jpg';
import p5 from '@assets/stock_images/professional_soccer__da0227c9.jpg';
import p6 from '@assets/stock_images/professional_soccer__44197ccd.jpg';
import p7 from '@assets/stock_images/professional_soccer__b3b6cedc.jpg';
import p8 from '@assets/stock_images/professional_soccer__df9f4d7e.jpg';
import p9 from '@assets/stock_images/professional_soccer__0dade223.jpg';
import p10 from '@assets/stock_images/professional_soccer__84c421c3.jpg';

export interface Player {
  id: number;
  name: string;
  age: number;
  image: string;
  team: string;
}

// Age calculation helper
function calculateAge(birthDateString: string): number {
  const today = new Date('2025-12-14');
  const birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Data sourced from FIFA Player Database (Birth Dates)
// Ages calculated relative to December 14, 2025
export const PLAYERS: Player[] = [
  { id: 1, name: "Lionel Messi", age: calculateAge('6/24/1987'), image: p1, team: "Inter Miami" },
  { id: 2, name: "Erling Haaland", age: calculateAge('7/21/2000'), image: p2, team: "Manchester City" },
  { id: 3, name: "Antoine Griezmann", age: calculateAge('3/21/1991'), image: p3, team: "Atlético de Madrid" },
  { id: 4, name: "Kylian Mbappé", age: calculateAge('12/20/1998'), image: p4, team: "Real Madrid" },
  { id: 5, name: "Harry Kane", age: calculateAge('7/28/1993'), image: p5, team: "Bayern Munich" },
  { id: 6, name: "Jude Bellingham", age: calculateAge('6/29/2003'), image: p6, team: "Real Madrid" }, // DOB from previous search
  { id: 7, name: "Kevin De Bruyne", age: calculateAge('6/28/1991'), image: p7, team: "Manchester City" },
  { id: 8, name: "Vinicius Junior", age: calculateAge('7/12/2000'), image: p8, team: "Real Madrid" }, // DOB from previous search
  { id: 9, name: "Mohamed Salah", age: calculateAge('6/15/1992'), image: p9, team: "Liverpool" },
  { id: 10, name: "Robert Lewandowski", age: calculateAge('8/21/1988'), image: p10, team: "FC Barcelona" },
];
