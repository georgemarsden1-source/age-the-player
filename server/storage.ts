import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { eq, asc, sql, count, ilike, min, max } from "drizzle-orm";
import { 
  type User, 
  type InsertUser,
  type Player,
  type InsertPlayer,
  type Score,
  type InsertScore,
  users,
  players,
  scores
} from "@shared/schema";
import { readFileSync, existsSync } from "fs";
import { parse } from "csv-parse/sync";
import path from "path";

const { Pool } = pg;

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize Drizzle ORM
export const db = drizzle(pool);

// Icon pack data
const iconPacks = {
  '80s': [
    { name: 'Diego Maradona', birthDate: '1960-10-30', nationality: 'Argentina', position: 'Attacking Midfielder / Forward' },
    { name: 'Michel Platini', birthDate: '1955-06-21', nationality: 'France', position: 'Attacking Midfielder' },
    { name: 'Zico', birthDate: '1953-03-03', nationality: 'Brazil', position: 'Attacking Midfielder' },
    { name: 'Marco van Basten', birthDate: '1964-10-31', nationality: 'Netherlands', position: 'Striker' },
    { name: 'Ruud Gullit', birthDate: '1962-09-01', nationality: 'Netherlands', position: 'Midfielder / Forward' },
    { name: 'Franco Baresi', birthDate: '1960-05-08', nationality: 'Italy', position: 'Centre-back' },
    { name: 'Karl-Heinz Rummenigge', birthDate: '1955-09-25', nationality: 'Germany', position: 'Forward' },
    { name: 'Paolo Maldini', birthDate: '1968-06-26', nationality: 'Italy', position: 'Left-back / Centre-back' },
    { name: 'Lothar Matthäus', birthDate: '1961-03-21', nationality: 'Germany', position: 'Midfielder' },
    { name: 'Sócrates', birthDate: '1954-02-19', nationality: 'Brazil', position: 'Midfielder' },
    { name: 'Gary Lineker', birthDate: '1960-11-30', nationality: 'England', position: 'Striker' },
    { name: 'Hugo Sánchez', birthDate: '1958-07-11', nationality: 'Mexico', position: 'Striker' },
    { name: 'Kenny Dalglish', birthDate: '1951-03-04', nationality: 'Scotland', position: 'Forward' },
    { name: 'Alessandro Altobelli', birthDate: '1955-11-28', nationality: 'Italy', position: 'Striker' },
    { name: 'Preben Elkjær', birthDate: '1957-09-11', nationality: 'Denmark', position: 'Striker' },
    { name: 'Ian Rush', birthDate: '1961-10-20', nationality: 'Wales', position: 'Striker' },
    { name: 'Bryan Robson', birthDate: '1957-01-11', nationality: 'England', position: 'Midfielder' },
    { name: 'Michael Laudrup', birthDate: '1964-06-15', nationality: 'Denmark', position: 'Attacking Midfielder' },
    { name: 'Jean Tigana', birthDate: '1955-06-23', nationality: 'France', position: 'Midfielder' },
    { name: 'Gaetano Scirea', birthDate: '1953-05-25', nationality: 'Italy', position: 'Sweeper' },
    { name: 'Careca', birthDate: '1960-10-05', nationality: 'Brazil', position: 'Striker' },
    { name: 'Rudi Völler', birthDate: '1960-04-13', nationality: 'Germany', position: 'Forward' },
    { name: 'Peter Shilton', birthDate: '1949-09-18', nationality: 'England', position: 'Goalkeeper' },
    { name: 'Dino Zoff', birthDate: '1942-02-28', nationality: 'Italy', position: 'Goalkeeper' },
    { name: 'Graeme Souness', birthDate: '1953-05-06', nationality: 'Scotland', position: 'Midfielder' },
    { name: 'Frank Rijkaard', birthDate: '1962-09-30', nationality: 'Netherlands', position: 'Defensive Midfielder' },
    { name: 'Bernd Schuster', birthDate: '1959-12-22', nationality: 'Germany', position: 'Midfielder' },
    { name: 'José Antonio Camacho', birthDate: '1955-06-08', nationality: 'Spain', position: 'Left-back' },
    { name: 'Emilio Butragueño', birthDate: '1963-07-22', nationality: 'Spain', position: 'Forward' },
    { name: 'Claudio Gentile', birthDate: '1953-09-27', nationality: 'Italy', position: 'Defender' },
    { name: 'Trevor Francis', birthDate: '1954-04-19', nationality: 'England', position: 'Forward' },
    { name: 'Jean-Pierre Papin', birthDate: '1963-11-05', nationality: 'France', position: 'Striker' },
    { name: 'Eric Cantona', birthDate: '1966-05-24', nationality: 'France', position: 'Forward' },
    { name: 'Walter Zenga', birthDate: '1960-04-28', nationality: 'Italy', position: 'Goalkeeper' },
    { name: 'Andreas Brehme', birthDate: '1960-11-09', nationality: 'Germany', position: 'Full-back' },
    { name: 'Jürgen Klinsmann', birthDate: '1964-07-30', nationality: 'Germany', position: 'Striker' },
    { name: 'Fernando Chalana', birthDate: '1959-02-10', nationality: 'Portugal', position: 'Winger' },
    { name: 'Enzo Scifo', birthDate: '1966-02-19', nationality: 'Belgium', position: 'Attacking Midfielder' },
    { name: 'Mark Hughes', birthDate: '1963-11-01', nationality: 'Wales', position: 'Forward' },
    { name: 'Gheorghe Hagi', birthDate: '1965-02-05', nationality: 'Romania', position: 'Attacking Midfielder' },
    { name: 'Zbigniew Boniek', birthDate: '1956-03-03', nationality: 'Poland', position: 'Midfielder' },
    { name: 'Oleg Blokhin', birthDate: '1952-11-05', nationality: 'USSR', position: 'Forward' },
    { name: 'René Higuita', birthDate: '1966-08-27', nationality: 'Colombia', position: 'Goalkeeper' },
    { name: 'Ray Wilkins', birthDate: '1956-09-14', nationality: 'England', position: 'Midfielder' },
    { name: 'Paul Breitner', birthDate: '1951-09-05', nationality: 'Germany', position: 'Midfielder' },
    { name: 'Roberto Baggio', birthDate: '1967-02-18', nationality: 'Italy', position: 'Attacking Midfielder' },
    { name: 'Carlos Valderrama', birthDate: '1961-09-02', nationality: 'Colombia', position: 'Midfielder' },
    { name: 'Harald Schumacher', birthDate: '1954-03-06', nationality: 'Germany', position: 'Goalkeeper' },
    { name: 'Jean-Marie Pfaff', birthDate: '1953-12-04', nationality: 'Belgium', position: 'Goalkeeper' },
    { name: 'Manuel Amoros', birthDate: '1962-02-01', nationality: 'France', position: 'Defender' },
  ],
  '90s': [
    { name: 'Ronaldo Nazário', birthDate: '1976-09-18', nationality: 'Brazil', position: 'Striker' },
    { name: 'Zinedine Zidane', birthDate: '1972-06-23', nationality: 'France', position: 'Attacking Midfielder' },
    { name: 'George Weah', birthDate: '1966-10-01', nationality: 'Liberia', position: 'Striker' },
    { name: 'Roberto Baggio', birthDate: '1967-02-18', nationality: 'Italy', position: 'Attacking Midfielder' },
    { name: 'Paolo Maldini', birthDate: '1968-06-26', nationality: 'Italy', position: 'Defender' },
    { name: 'Romário', birthDate: '1966-01-29', nationality: 'Brazil', position: 'Striker' },
    { name: 'Luis Figo', birthDate: '1972-11-04', nationality: 'Portugal', position: 'Winger' },
    { name: 'Dennis Bergkamp', birthDate: '1969-05-10', nationality: 'Netherlands', position: 'Forward' },
    { name: 'Eric Cantona', birthDate: '1966-05-24', nationality: 'France', position: 'Forward' },
    { name: 'Alessandro Del Piero', birthDate: '1974-11-09', nationality: 'Italy', position: 'Forward' },
    { name: 'Hristo Stoichkov', birthDate: '1966-02-08', nationality: 'Bulgaria', position: 'Forward' },
    { name: 'Michael Laudrup', birthDate: '1964-06-15', nationality: 'Denmark', position: 'Attacking Midfielder' },
    { name: 'Peter Schmeichel', birthDate: '1963-11-18', nationality: 'Denmark', position: 'Goalkeeper' },
    { name: 'Lothar Matthäus', birthDate: '1961-03-21', nationality: 'Germany', position: 'Midfielder' },
    { name: 'Gabriel Batistuta', birthDate: '1969-02-01', nationality: 'Argentina', position: 'Striker' },
    { name: 'Raúl', birthDate: '1977-06-27', nationality: 'Spain', position: 'Forward' },
    { name: 'Patrick Vieira', birthDate: '1976-06-23', nationality: 'France', position: 'Midfielder' },
    { name: 'Rivaldo', birthDate: '1972-04-19', nationality: 'Brazil', position: 'Attacking Midfielder' },
    { name: 'Clarence Seedorf', birthDate: '1976-04-01', nationality: 'Netherlands', position: 'Midfielder' },
    { name: 'Marcelo Salas', birthDate: '1974-12-24', nationality: 'Chile', position: 'Striker' },
    { name: 'Alan Shearer', birthDate: '1970-08-13', nationality: 'England', position: 'Striker' },
    { name: 'Gianfranco Zola', birthDate: '1966-07-05', nationality: 'Italy', position: 'Forward' },
    { name: 'Cafu', birthDate: '1970-06-07', nationality: 'Brazil', position: 'Right-back' },
    { name: 'Fabien Barthez', birthDate: '1971-06-28', nationality: 'France', position: 'Goalkeeper' },
    { name: 'Fernando Hierro', birthDate: '1968-03-23', nationality: 'Spain', position: 'Defender' },
    { name: 'Marcel Desailly', birthDate: '1968-09-07', nationality: 'France', position: 'Defender' },
    { name: 'Rui Costa', birthDate: '1972-03-29', nationality: 'Portugal', position: 'Attacking Midfielder' },
    { name: 'Davor Šuker', birthDate: '1968-01-01', nationality: 'Croatia', position: 'Striker' },
    { name: 'Andriy Shevchenko', birthDate: '1976-09-29', nationality: 'Ukraine', position: 'Striker' },
    { name: 'Ryan Giggs', birthDate: '1973-11-29', nationality: 'Wales', position: 'Winger' },
    { name: 'Roberto Carlos', birthDate: '1973-04-10', nationality: 'Brazil', position: 'Left-back' },
    { name: 'Edgar Davids', birthDate: '1973-03-13', nationality: 'Netherlands', position: 'Midfielder' },
    { name: 'Jürgen Klinsmann', birthDate: '1964-07-30', nationality: 'Germany', position: 'Striker' },
    { name: 'David Beckham', birthDate: '1975-05-02', nationality: 'England', position: 'Midfielder' },
    { name: 'Oliver Kahn', birthDate: '1969-06-15', nationality: 'Germany', position: 'Goalkeeper' },
    { name: 'Laurent Blanc', birthDate: '1965-11-19', nationality: 'France', position: 'Defender' },
    { name: 'Gheorghe Hagi', birthDate: '1965-02-05', nationality: 'Romania', position: 'Attacking Midfielder' },
    { name: 'Carlos Valderrama', birthDate: '1961-09-02', nationality: 'Colombia', position: 'Midfielder' },
    { name: 'Javier Zanetti', birthDate: '1973-08-10', nationality: 'Argentina', position: 'Defender' },
    { name: 'Diego Simeone', birthDate: '1970-04-28', nationality: 'Argentina', position: 'Midfielder' },
    { name: 'Hernán Crespo', birthDate: '1975-07-05', nationality: 'Argentina', position: 'Striker' },
    { name: 'Bixente Lizarazu', birthDate: '1969-12-09', nationality: 'France', position: 'Left-back' },
    { name: 'Pep Guardiola', birthDate: '1971-01-18', nationality: 'Spain', position: 'Defensive Midfielder' },
    { name: 'Juan Sebastián Verón', birthDate: '1975-03-09', nationality: 'Argentina', position: 'Midfielder' },
    { name: 'Ronald de Boer', birthDate: '1970-05-15', nationality: 'Netherlands', position: 'Midfielder' },
    { name: 'Jay-Jay Okocha', birthDate: '1973-08-14', nationality: 'Nigeria', position: 'Attacking Midfielder' },
    { name: 'Fernando Redondo', birthDate: '1969-07-06', nationality: 'Argentina', position: 'Midfielder' },
    { name: 'Christian Vieri', birthDate: '1973-07-12', nationality: 'Italy', position: 'Striker' },
    { name: 'Roberto Ayala', birthDate: '1973-04-14', nationality: 'Argentina', position: 'Defender' },
    { name: 'Iván Zamorano', birthDate: '1967-01-18', nationality: 'Chile', position: 'Striker' },
  ],
  '00s': [
    { name: 'Lionel Messi', birthDate: '1987-06-24', nationality: 'Argentina', position: 'Forward' },
    { name: 'Cristiano Ronaldo', birthDate: '1985-02-05', nationality: 'Portugal', position: 'Forward' },
    { name: 'Ronaldinho', birthDate: '1980-03-21', nationality: 'Brazil', position: 'Attacking Midfielder' },
    { name: 'Zinedine Zidane', birthDate: '1972-06-23', nationality: 'France', position: 'Attacking Midfielder' },
    { name: 'Thierry Henry', birthDate: '1977-08-17', nationality: 'France', position: 'Forward' },
    { name: 'Ronaldo Nazário', birthDate: '1976-09-18', nationality: 'Brazil', position: 'Striker' },
    { name: 'Kaká', birthDate: '1982-04-22', nationality: 'Brazil', position: 'Attacking Midfielder' },
    { name: 'Andrea Pirlo', birthDate: '1979-05-19', nationality: 'Italy', position: 'Deep-lying Playmaker' },
    { name: 'Xavi', birthDate: '1980-01-25', nationality: 'Spain', position: 'Midfielder' },
    { name: 'Andrés Iniesta', birthDate: '1984-05-11', nationality: 'Spain', position: 'Midfielder' },
    { name: "Samuel Eto'o", birthDate: '1981-03-10', nationality: 'Cameroon', position: 'Striker' },
    { name: 'Iker Casillas', birthDate: '1981-05-20', nationality: 'Spain', position: 'Goalkeeper' },
    { name: 'Gianluigi Buffon', birthDate: '1978-01-28', nationality: 'Italy', position: 'Goalkeeper' },
    { name: 'David Beckham', birthDate: '1975-05-02', nationality: 'England', position: 'Midfielder' },
    { name: 'Steven Gerrard', birthDate: '1980-05-30', nationality: 'England', position: 'Midfielder' },
    { name: 'Frank Lampard', birthDate: '1978-06-20', nationality: 'England', position: 'Midfielder' },
    { name: 'Paul Scholes', birthDate: '1974-11-16', nationality: 'England', position: 'Midfielder' },
    { name: 'Didier Drogba', birthDate: '1978-03-11', nationality: 'Ivory Coast', position: 'Striker' },
    { name: 'Wayne Rooney', birthDate: '1985-10-24', nationality: 'England', position: 'Forward' },
    { name: 'Pavel Nedvěd', birthDate: '1972-08-30', nationality: 'Czech Republic', position: 'Midfielder' },
    { name: 'Luis Figo', birthDate: '1972-11-04', nationality: 'Portugal', position: 'Winger' },
    { name: 'Raúl', birthDate: '1977-06-27', nationality: 'Spain', position: 'Forward' },
    { name: 'Fabio Cannavaro', birthDate: '1973-09-13', nationality: 'Italy', position: 'Defender' },
    { name: 'Carlos Tevez', birthDate: '1984-02-05', nationality: 'Argentina', position: 'Forward' },
    { name: 'Zlatan Ibrahimović', birthDate: '1981-10-03', nationality: 'Sweden', position: 'Striker' },
    { name: 'Clarence Seedorf', birthDate: '1976-04-01', nationality: 'Netherlands', position: 'Midfielder' },
    { name: 'Deco', birthDate: '1977-08-27', nationality: 'Portugal', position: 'Midfielder' },
    { name: 'Michael Ballack', birthDate: '1976-09-26', nationality: 'Germany', position: 'Midfielder' },
    { name: 'Fernando Torres', birthDate: '1984-03-20', nationality: 'Spain', position: 'Striker' },
    { name: 'Patrick Vieira', birthDate: '1976-06-23', nationality: 'France', position: 'Midfielder' },
    { name: 'Arjen Robben', birthDate: '1984-01-23', nationality: 'Netherlands', position: 'Winger' },
    { name: 'Rivaldo', birthDate: '1972-04-19', nationality: 'Brazil', position: 'Attacking Midfielder' },
    { name: 'Hernán Crespo', birthDate: '1975-07-05', nationality: 'Argentina', position: 'Striker' },
    { name: 'Filippo Inzaghi', birthDate: '1973-08-09', nationality: 'Italy', position: 'Striker' },
    { name: 'Claude Makélélé', birthDate: '1973-02-18', nationality: 'France', position: 'Defensive Midfielder' },
    { name: 'Ashley Cole', birthDate: '1980-12-20', nationality: 'England', position: 'Left-back' },
    { name: 'Rio Ferdinand', birthDate: '1978-11-07', nationality: 'England', position: 'Centre-back' },
    { name: 'Nemanja Vidić', birthDate: '1981-10-21', nationality: 'Serbia', position: 'Centre-back' },
    { name: 'Carles Puyol', birthDate: '1978-04-13', nationality: 'Spain', position: 'Defender' },
    { name: 'Gerard Piqué', birthDate: '1987-02-02', nationality: 'Spain', position: 'Defender' },
    { name: 'Wesley Sneijder', birthDate: '1984-06-09', nationality: 'Netherlands', position: 'Midfielder' },
    { name: 'Yaya Touré', birthDate: '1983-05-13', nationality: 'Ivory Coast', position: 'Midfielder' },
    { name: 'Juan Román Riquelme', birthDate: '1978-06-24', nationality: 'Argentina', position: 'Attacking Midfielder' },
    { name: 'Robinho', birthDate: '1984-01-25', nationality: 'Brazil', position: 'Forward' },
    { name: 'David Villa', birthDate: '1981-12-03', nationality: 'Spain', position: 'Striker' },
    { name: 'Kolo Touré', birthDate: '1981-03-19', nationality: 'Ivory Coast', position: 'Defender' },
    { name: 'Javier Zanetti', birthDate: '1973-08-10', nationality: 'Argentina', position: 'Defender' },
    { name: 'Lilian Thuram', birthDate: '1972-01-01', nationality: 'France', position: 'Defender' },
  ],
  'alltime': [
    { name: 'Pelé', birthDate: '1940-10-23', nationality: 'Brazil', position: 'Forward' },
    { name: 'Diego Maradona', birthDate: '1960-10-30', nationality: 'Argentina', position: 'Attacking Midfielder' },
    { name: 'Lionel Messi', birthDate: '1987-06-24', nationality: 'Argentina', position: 'Forward' },
    { name: 'Cristiano Ronaldo', birthDate: '1985-02-05', nationality: 'Portugal', position: 'Forward' },
    { name: 'Zinedine Zidane', birthDate: '1972-06-23', nationality: 'France', position: 'Attacking Midfielder' },
    { name: 'Johan Cruyff', birthDate: '1947-04-25', nationality: 'Netherlands', position: 'Forward' },
    { name: 'Ronaldo Nazário', birthDate: '1976-09-18', nationality: 'Brazil', position: 'Striker' },
    { name: 'Michel Platini', birthDate: '1955-06-21', nationality: 'France', position: 'Attacking Midfielder' },
    { name: 'Ronaldinho', birthDate: '1980-03-21', nationality: 'Brazil', position: 'Attacking Midfielder' },
    { name: 'Franz Beckenbauer', birthDate: '1945-09-11', nationality: 'Germany', position: 'Sweeper' },
    { name: 'Paolo Maldini', birthDate: '1968-06-26', nationality: 'Italy', position: 'Defender' },
    { name: 'Alfredo Di Stéfano', birthDate: '1926-07-04', nationality: 'Argentina / Spain', position: 'Forward' },
    { name: 'George Best', birthDate: '1946-05-22', nationality: 'Northern Ireland', position: 'Winger' },
    { name: 'Zico', birthDate: '1953-03-03', nationality: 'Brazil', position: 'Attacking Midfielder' },
    { name: 'Garrincha', birthDate: '1933-10-28', nationality: 'Brazil', position: 'Winger' },
    { name: 'Marco van Basten', birthDate: '1964-10-31', nationality: 'Netherlands', position: 'Striker' },
    { name: 'Ruud Gullit', birthDate: '1962-09-01', nationality: 'Netherlands', position: 'Midfielder' },
    { name: 'Franco Baresi', birthDate: '1960-05-08', nationality: 'Italy', position: 'Defender' },
    { name: 'Andrés Iniesta', birthDate: '1984-05-11', nationality: 'Spain', position: 'Midfielder' },
    { name: 'Xavi', birthDate: '1980-01-25', nationality: 'Spain', position: 'Midfielder' },
    { name: 'Thierry Henry', birthDate: '1977-08-17', nationality: 'France', position: 'Forward' },
    { name: 'Kaká', birthDate: '1982-04-22', nationality: 'Brazil', position: 'Attacking Midfielder' },
    { name: 'Roberto Baggio', birthDate: '1967-02-18', nationality: 'Italy', position: 'Attacking Midfielder' },
    { name: 'Luis Figo', birthDate: '1972-11-04', nationality: 'Portugal', position: 'Winger' },
    { name: 'George Weah', birthDate: '1966-10-01', nationality: 'Liberia', position: 'Striker' },
    { name: 'Bobby Charlton', birthDate: '1937-10-11', nationality: 'England', position: 'Midfielder' },
    { name: 'Eusébio', birthDate: '1942-01-25', nationality: 'Portugal', position: 'Striker' },
    { name: 'Gianluigi Buffon', birthDate: '1978-01-28', nationality: 'Italy', position: 'Goalkeeper' },
    { name: 'Iker Casillas', birthDate: '1981-05-20', nationality: 'Spain', position: 'Goalkeeper' },
    { name: 'Lev Yashin', birthDate: '1929-10-22', nationality: 'USSR', position: 'Goalkeeper' },
    { name: 'Andrea Pirlo', birthDate: '1979-05-19', nationality: 'Italy', position: 'Deep-lying Playmaker' },
    { name: 'Lothar Matthäus', birthDate: '1961-03-21', nationality: 'Germany', position: 'Midfielder' },
    { name: 'Romário', birthDate: '1966-01-29', nationality: 'Brazil', position: 'Striker' },
    { name: 'Raúl', birthDate: '1977-06-27', nationality: 'Spain', position: 'Forward' },
    { name: 'Didier Drogba', birthDate: '1978-03-11', nationality: 'Ivory Coast', position: 'Striker' },
    { name: 'Zlatan Ibrahimović', birthDate: '1981-10-03', nationality: 'Sweden', position: 'Striker' },
    { name: 'David Beckham', birthDate: '1975-05-02', nationality: 'England', position: 'Midfielder' },
    { name: 'Carlos Alberto', birthDate: '1944-07-17', nationality: 'Brazil', position: 'Right-back' },
    { name: 'Cafu', birthDate: '1970-06-07', nationality: 'Brazil', position: 'Right-back' },
    { name: 'Roberto Carlos', birthDate: '1973-04-10', nationality: 'Brazil', position: 'Left-back' },
    { name: 'Clarence Seedorf', birthDate: '1976-04-01', nationality: 'Netherlands', position: 'Midfielder' },
    { name: "Samuel Eto'o", birthDate: '1981-03-10', nationality: 'Cameroon', position: 'Striker' },
    { name: 'Wayne Rooney', birthDate: '1985-10-24', nationality: 'England', position: 'Forward' },
    { name: 'Patrick Vieira', birthDate: '1976-06-23', nationality: 'France', position: 'Midfielder' },
    { name: 'Fabio Cannavaro', birthDate: '1973-09-13', nationality: 'Italy', position: 'Defender' },
    { name: 'Johan Neeskens', birthDate: '1951-09-15', nationality: 'Netherlands', position: 'Midfielder' },
    { name: 'Ronald Koeman', birthDate: '1963-03-21', nationality: 'Netherlands', position: 'Defender' },
    { name: 'Kevin De Bruyne', birthDate: '1991-06-28', nationality: 'Belgium', position: 'Midfielder' },
    { name: 'Neymar', birthDate: '1992-02-05', nationality: 'Brazil', position: 'Forward' },
    { name: 'Erling Haaland', birthDate: '2000-07-21', nationality: 'Norway', position: 'Striker' },
  ],
};

function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// Auto-seed players if database is empty or missing packs
export async function ensurePlayersSeeded(): Promise<void> {
  try {
    // Check for each pack
    for (const [packId, packPlayers] of Object.entries(iconPacks)) {
      const result = await db.select({ count: count() }).from(players).where(eq(players.pack, packId));
      const packCount = result[0]?.count || 0;
      
      if (packCount === 0) {
        console.log(`[seed] Seeding ${packId} pack with ${packPlayers.length} players...`);
        
        const playerData = packPlayers.map(p => ({
          name: p.name,
          fullName: p.name,
          birthDate: p.birthDate,
          age: calculateAge(p.birthDate),
          nationality: p.nationality,
          team: 'Retired',
          position: p.position,
          overallRating: 85,
          imageUrl: null,
          pack: packId,
        }));
        
        const batchSize = 20;
        for (let i = 0; i < playerData.length; i += batchSize) {
          const batch = playerData.slice(i, i + batchSize);
          await db.insert(players).values(batch);
        }
        
        console.log(`[seed] Successfully seeded ${packId} pack`);
      }
    }
    
    // Check modern pack
    const modernResult = await db.select({ count: count() }).from(players).where(eq(players.pack, 'modern'));
    const modernCount = modernResult[0]?.count || 0;
    
    if (modernCount === 0) {
      console.log("[seed] Seeding modern players...");
      
      const possiblePaths = [
        path.resolve(__dirname, "data/players.csv"),
        path.resolve(process.cwd(), "dist/data/players.csv"),
        path.resolve(process.cwd(), "attached_assets/transfermarkt_players.csv"),
      ];
      
      let csvPath: string | null = null;
      for (const p of possiblePaths) {
        if (existsSync(p)) {
          csvPath = p;
          break;
        }
      }
      
      if (csvPath) {
        console.log(`[seed] Reading from: ${csvPath}`);
        const csvContent = readFileSync(csvPath, "utf-8");
        const records = parse(csvContent, {
          columns: true,
          skip_empty_lines: true,
        });

        const playerData = records.map((record: any) => ({
          name: record.name,
          fullName: record.name,
          birthDate: record.birth_date,
          age: parseInt(record.age),
          nationality: record.nationality,
          team: record.team,
          position: record.position,
          overallRating: 80,
          imageUrl: record.image_url || null,
          pack: 'modern',
        }));

        const batchSize = 50;
        for (let i = 0; i < playerData.length; i += batchSize) {
          const batch = playerData.slice(i, i + batchSize);
          await db.insert(players).values(batch);
        }
        
        console.log(`[seed] Successfully seeded ${playerData.length} modern players`);
      }
    }
    
    const totalResult = await db.select({ count: count() }).from(players);
    console.log(`[seed] Database has ${totalResult[0]?.count || 0} total players`);
  } catch (error) {
    console.error("[seed] Error during auto-seed:", error);
  }
}

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Player methods
  getRandomPlayers(count: number, pack?: string): Promise<Player[]>;
  getPlayerById(id: number): Promise<Player | undefined>;
  searchPlayersByName(query: string, limit?: number): Promise<Player[]>;
  
  // Score methods
  createScore(score: InsertScore): Promise<Score>;
  getTopScores(limit: number): Promise<Score[]>;
  
  // Pack methods
  getPackAgeRange(pack: string): Promise<{ minAge: number; maxAge: number }>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Player methods
  async getRandomPlayers(count: number, pack?: string): Promise<Player[]> {
    if (pack && pack !== 'all') {
      const result = await db
        .select()
        .from(players)
        .where(eq(players.pack, pack))
        .orderBy(sql`RANDOM()`)
        .limit(count);
      return result;
    }
    const result = await db
      .select()
      .from(players)
      .orderBy(sql`RANDOM()`)
      .limit(count);
    return result;
  }

  async getPlayerById(id: number): Promise<Player | undefined> {
    const result = await db.select().from(players).where(eq(players.id, id)).limit(1);
    return result[0];
  }

  async searchPlayersByName(query: string, limit: number = 20): Promise<Player[]> {
    const result = await db
      .select()
      .from(players)
      .where(ilike(players.name, `%${query}%`))
      .orderBy(asc(players.name))
      .limit(limit);
    return result;
  }

  // Score methods
  async createScore(insertScore: InsertScore): Promise<Score> {
    const result = await db.insert(scores).values(insertScore).returning();
    return result[0];
  }

  async getTopScores(limit: number): Promise<Score[]> {
    return await db
      .select()
      .from(scores)
      .orderBy(asc(scores.totalScore))
      .limit(limit);
  }

  async getPackAgeRange(pack: string): Promise<{ minAge: number; maxAge: number }> {
    const query = pack && pack !== 'all' 
      ? db.select({ minAge: min(players.age), maxAge: max(players.age) }).from(players).where(eq(players.pack, pack))
      : db.select({ minAge: min(players.age), maxAge: max(players.age) }).from(players);
    
    const result = await query;
    const minAge = result[0]?.minAge ?? 16;
    const maxAge = result[0]?.maxAge ?? 45;
    
    return {
      minAge: minAge - 1,
      maxAge: maxAge + 5
    };
  }
}

export const storage = new DatabaseStorage();
