const teamToLeague: Record<string, string> = {
  // Premier League
  'Manchester City': 'Premier League',
  'Arsenal FC': 'Premier League',
  'Liverpool FC': 'Premier League',
  'Aston Villa': 'Premier League',
  'Tottenham Hotspur': 'Premier League',
  'Chelsea FC': 'Premier League',
  'Newcastle United': 'Premier League',
  'Manchester United': 'Premier League',
  'West Ham United': 'Premier League',
  'Crystal Palace': 'Premier League',
  'Brighton & Hove Albion': 'Premier League',
  'AFC Bournemouth': 'Premier League',
  'Fulham FC': 'Premier League',
  'Wolverhampton Wanderers': 'Premier League',
  'Everton FC': 'Premier League',
  'Brentford FC': 'Premier League',
  'Nottingham Forest': 'Premier League',
  'Luton Town': 'Premier League',
  'Burnley FC': 'Premier League',
  'Sheffield United': 'Premier League',
  'Ipswich Town': 'Premier League',
  'Leicester City': 'Premier League',
  'Southampton FC': 'Premier League',
  'Leeds United': 'Premier League',

  // La Liga
  'Real Madrid': 'La Liga',
  'FC Barcelona': 'La Liga',
  'Girona FC': 'La Liga',
  'Atlético Madrid': 'La Liga',
  'Athletic Club de Bilbao': 'La Liga',
  'Real Betis Balompié': 'La Liga',
  'Real Sociedad': 'La Liga',
  'Valencia CF': 'La Liga',
  'Villarreal CF': 'La Liga',
  'Getafe CF': 'La Liga',
  'Deportivo Alavés': 'La Liga',
  'CA Osasuna': 'La Liga',
  'Sevilla FC': 'La Liga',
  'RCD Mallorca': 'La Liga',
  'Las Palmas': 'La Liga',
  'Rayo Vallecano': 'La Liga',
  'RC Celta de Vigo': 'La Liga',
  'Cádiz CF': 'La Liga',
  'Granada CF': 'La Liga',
  'UD Almería': 'La Liga',
  'RCD Espanyol': 'La Liga',
  'Real Valladolid': 'La Liga',

  // Bundesliga
  'FC Bayern München': 'Bundesliga',
  'Bayer 04 Leverkusen': 'Bundesliga',
  'VfB Stuttgart': 'Bundesliga',
  'RB Leipzig': 'Bundesliga',
  'Borussia Dortmund': 'Bundesliga',
  'Eintracht Frankfurt': 'Bundesliga',
  'VfL Wolfsburg': 'Bundesliga',
  'SC Freiburg': 'Bundesliga',
  'TSG 1899 Hoffenheim': 'Bundesliga',
  'SV Werder Bremen': 'Bundesliga',
  '1. FC Heidenheim 1846': 'Bundesliga',
  'FC Augsburg': 'Bundesliga',
  'Borussia Mönchengladbach': 'Bundesliga',
  '1. FC Union Berlin': 'Bundesliga',
  'VfL Bochum 1848': 'Bundesliga',
  '1. FSV Mainz 05': 'Bundesliga',
  '1. FC Köln': 'Bundesliga',
  'SV Darmstadt 98': 'Bundesliga',
  'FC Schalke 04': 'Bundesliga',
  'Hertha BSC': 'Bundesliga',

  // Serie A
  'Inter Milano': 'Serie A',
  'AC Milan': 'Serie A',
  'Juventus': 'Serie A',
  'Atalanta BC': 'Serie A',
  'Bologna FC 1909': 'Serie A',
  'AS Roma': 'Serie A',
  'SS Lazio': 'Serie A',
  'ACF Fiorentina': 'Serie A',
  'SSC Napoli': 'Serie A',
  'Torino FC': 'Serie A',
  'AC Monza': 'Serie A',
  'Genoa CFC': 'Serie A',
  'US Lecce': 'Serie A',
  'Udinese Calcio': 'Serie A',
  'Cagliari Calcio': 'Serie A',
  'Empoli FC': 'Serie A',
  'Hellas Verona': 'Serie A',
  'US Sassuolo Calcio': 'Serie A',
  'Frosinone Calcio': 'Serie A',
  'US Salernitana 1919': 'Serie A',
  'Parma Calcio 1913': 'Serie A',
  'Venezia FC': 'Serie A',
  'Como 1907': 'Serie A',

  // Ligue 1
  'Paris Saint-Germain': 'Ligue 1',
  'AS Monaco': 'Ligue 1',
  'Stade Brestois 29': 'Ligue 1',
  'LOSC Lille': 'Ligue 1',
  'OGC Nice': 'Ligue 1',
  'RC Lens': 'Ligue 1',
  'Olympique Lyonnais': 'Ligue 1',
  'Olympique de Marseille': 'Ligue 1',
  'Stade Rennais FC': 'Ligue 1',
  'Toulouse FC': 'Ligue 1',
  'Montpellier HSC': 'Ligue 1',
  'Stade de Reims': 'Ligue 1',
  'FC Nantes': 'Ligue 1',
  'Racing Club de Strasbourg': 'Ligue 1',
  'Le Havre AC': 'Ligue 1',
  'FC Metz': 'Ligue 1',
  'FC Lorient': 'Ligue 1',
  'Clermont Foot 63': 'Ligue 1',
  'AS Saint-Étienne': 'Ligue 1',
  'AJ Auxerre': 'Ligue 1',
  'Angers SCO': 'Ligue 1',

  // Primeira Liga (Portugal)
  'Sporting CP': 'Primeira Liga',
  'SL Benfica': 'Primeira Liga',
  'FC Porto': 'Primeira Liga',
  'SC Braga': 'Primeira Liga',
  'Vitória SC': 'Primeira Liga',

  // Eredivisie (Netherlands)
  'PSV': 'Eredivisie',
  'Feyenoord': 'Eredivisie',
  'AFC Ajax': 'Eredivisie',
  'AZ': 'Eredivisie',
  'FC Twente': 'Eredivisie',

  // Scottish Premiership
  'Celtic FC': 'Scottish Premiership',
  'Rangers FC': 'Scottish Premiership',

  // Turkish Super Lig
  'Galatasaray SK': 'Süper Lig',
  'Fenerbahce': 'Süper Lig',
  'Besiktas JK': 'Süper Lig',
  'Trabzonspor': 'Süper Lig',

  // Belgian Pro League
  'Club Brugge KV': 'Belgian Pro League',
  'RSC Anderlecht': 'Belgian Pro League',
  'KRC Genk': 'Belgian Pro League',
  'Royal Antwerp FC': 'Belgian Pro League',

  // Saudi Pro League
  'Al Nassr': 'Saudi Pro League',
  'Al Hilal': 'Saudi Pro League',
  'Al Ahli': 'Saudi Pro League',
  'Al Ittihad': 'Saudi Pro League',
  'Al Ettifaq': 'Saudi Pro League',

  // MLS
  'Inter Miami CF': 'MLS',
  'LA Galaxy': 'MLS',
  'Los Angeles FC': 'MLS',
  'Atlanta United FC': 'MLS',
  'New York City FC': 'MLS',
  'New York Red Bulls': 'MLS',

  // Brazilian Serie A
  'Sociedade Esportiva Palmeiras': 'Brasileirão',
  'Clube de Regatas do Flamengo': 'Brasileirão',
  'São Paulo FC': 'Brasileirão',
  'SC Corinthians Paulista': 'Brasileirão',
  'Grêmio FBPA': 'Brasileirão',
  'SC Internacional': 'Brasileirão',
  'Clube Atlético Mineiro': 'Brasileirão',
  'CR Fluminense': 'Brasileirão',
  'Santos FC': 'Brasileirão',
  'Botafogo FR': 'Brasileirão',

  // Argentine Primera División
  'River Plate': 'Liga Profesional',
  'CA Boca Juniors': 'Liga Profesional',
  'Racing Club de Avellaneda': 'Liga Profesional',
  'CA Independiente': 'Liga Profesional',

  // Austrian Bundesliga
  'FK Austria Wien': 'Austrian Bundesliga',
  'SK Rapid Wien': 'Austrian Bundesliga',
  'Red Bull Salzburg': 'Austrian Bundesliga',

  // Swiss Super League
  'BSC Young Boys': 'Swiss Super League',
  'FC Basel 1893': 'Swiss Super League',

  // Greek Super League
  'Olympiacos CFP': 'Super League Greece',
  'Panathinaikos FC': 'Super League Greece',
  'AEK Athens FC': 'Super League Greece',
  'PAOK FC': 'Super League Greece',

  // Ukrainian Premier League
  'FC Shakhtar Donetsk': 'Ukrainian Premier League',
  'FC Dynamo Kyiv': 'Ukrainian Premier League',

  // Russian Premier League
  'FC Zenit Saint Petersburg': 'Russian Premier League',
  'FC Spartak Moskva': 'Russian Premier League',
  'PFC CSKA Moskva': 'Russian Premier League',

  // Croatian First Football League
  'GNK Dinamo Zagreb': 'Croatian First League',
  'HNK Hajduk Split': 'Croatian First League',

  // Czech First League
  'AC Sparta Praha': 'Czech First League',
  'SK Slavia Praha': 'Czech First League',

  // Danish Superliga
  'FC København': 'Danish Superliga',

  // Norwegian Eliteserien
  'Rosenborg BK': 'Eliteserien',
  'FK Bodø/Glimt': 'Eliteserien',

  // Swedish Allsvenskan
  'Malmö FF': 'Allsvenskan',
  'AIK': 'Allsvenskan',

  // Japanese J1 League
  'Vissel Kobe': 'J1 League',
  'Yokohama F·Marinos': 'J1 League',

  // Korean K League
  'Jeonbuk Hyundai Motors FC': 'K League 1',
  'Ulsan HD FC': 'K League 1',

  // Chinese Super League
  'Shanghai Port FC': 'Chinese Super League',

  // Mexican Liga MX
  'CF Monterrey': 'Liga MX',
  'Club América': 'Liga MX',
  'Tigres UANL': 'Liga MX',
  'CD Guadalajara': 'Liga MX',
};

export function getLeague(team: string | null | undefined): string | null {
  if (!team || team === 'Unknown') return null;
  return teamToLeague[team] || null;
}
