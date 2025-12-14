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

export const PLAYERS: Player[] = [
  { id: 1, name: "Thiago Silva", age: 24, image: p1, team: "Rio FC" },
  { id: 2, name: "Luka Modric-Style", age: 29, image: p2, team: "Zagreb Dinamo" },
  { id: 3, name: "Antoine Griezmann-Look", age: 31, image: p3, team: "Paris Elite" },
  { id: 4, name: "Erling Haaland-Esq", age: 22, image: p4, team: "Nordic Storm" },
  { id: 5, name: "Harry Kane-Like", age: 27, image: p5, team: "London Spurs" },
  { id: 6, name: "Pedri Gonzalez-Type", age: 19, image: p6, team: "Catalonia FC" },
  { id: 7, name: "Kevin De Bruyne-ish", age: 33, image: p7, team: "Manchester Blue" },
  { id: 8, name: "Son Heung-min-Vibe", age: 26, image: p8, team: "Seoul FC" },
  { id: 9, name: "Kylian Mbappé-Aura", age: 21, image: p9, team: "France United" },
  { id: 10, name: "Robert Lewandowski-Feel", age: 28, image: p10, team: "Warsaw Eagles" },
];
