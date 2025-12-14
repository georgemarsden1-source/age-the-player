import p1 from '@assets/stock_images/professional_soccer__c5c9e72e.jpg';
import p2 from '@assets/stock_images/professional_soccer__1b935b23.jpg';
import p3 from '@assets/stock_images/professional_soccer__bb94267f.jpg';
import p4 from '@assets/stock_images/professional_soccer__43cb81e0.jpg';
import p5 from '@assets/stock_images/professional_soccer__13cac3bf.jpg';
import p6 from '@assets/stock_images/professional_soccer__57f21cf9.jpg';
import p7 from '@assets/stock_images/professional_soccer__4a476815.jpg';
import p8 from '@assets/stock_images/professional_soccer__fdba7555.jpg';
import p9 from '@assets/stock_images/professional_soccer__862d11c7.jpg';
import p10 from '@assets/stock_images/professional_soccer__79e846b1.jpg';

export interface Player {
  id: number;
  name: string;
  age: number;
  image: string;
  team: string;
}

export const PLAYERS: Player[] = [
  { id: 1, name: "Marcus 'The Flash' Sterling", age: 24, image: p1, team: "Manchester Blue" },
  { id: 2, name: "Lucas Silva", age: 29, image: p2, team: "Madrid Royal" },
  { id: 3, name: "Alessandro Rossi", age: 31, image: p3, team: "Milan Red" },
  { id: 4, name: "Johan Berg", age: 22, image: p4, team: "Munich Giants" },
  { id: 5, name: "David O'Connor", age: 27, image: p5, team: "London Cannons" },
  { id: 6, name: "Mateo Fernandez", age: 19, image: p6, team: "Barcelona Kings" },
  { id: 7, name: "Kevin De Vries", age: 33, image: p7, team: "Amsterdam Ajax" },
  { id: 8, name: "Hiroki Tanaka", age: 26, image: p8, team: "Liverpool Reds" },
  { id: 9, name: "Gabriel Santos", age: 21, image: p9, team: "Paris Saints" },
  { id: 10, name: "Thomas Müller-Schmidt", age: 28, image: p10, team: "Dortmund Yellows" },
];
