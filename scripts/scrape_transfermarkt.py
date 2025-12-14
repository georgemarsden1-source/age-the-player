import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
from datetime import datetime, timedelta
import random

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
}

def scrape_page(page_num):
    """Scrape a single page of players"""
    url = f"https://www.transfermarkt.com/spieler-statistik/wertvollstespieler/marktwertetop?page={page_num}"
    
    try:
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        table = soup.find('table', class_='items')
        if not table:
            print(f"No table found on page {page_num}")
            return []
        
        rows = table.find_all('tr', class_=['odd', 'even'])
        players = []
        
        for row in rows:
            try:
                # Player name from hauptlink
                name_cell = row.find('td', class_='hauptlink')
                if not name_cell:
                    continue
                name_link = name_cell.find('a')
                name = name_link.get_text(strip=True) if name_link else None
                
                if not name:
                    continue
                
                # Get all tds
                tds = row.find_all('td', recursive=False)
                
                # Position from inline-table second row
                inline_table = row.find('table', class_='inline-table')
                position = None
                if inline_table:
                    pos_rows = inline_table.find_all('tr')
                    if len(pos_rows) > 1:
                        position = pos_rows[1].get_text(strip=True)
                
                # Age is in td with class 'zentriert' containing just a number
                age = None
                nationality = None
                team = None
                
                for td in tds:
                    # Check if this td has class 'zentriert' and contains just a number (age)
                    text = td.get_text(strip=True)
                    if 'zentriert' in td.get('class', []) and text.isdigit() and 15 < int(text) < 50:
                        age = int(text)
                    
                    # Nationality from flag image
                    flag = td.find('img', class_='flaggenrahmen')
                    if flag and flag.get('title') and not nationality:
                        nationality = flag.get('title')
                    
                    # Team from club link/image
                    club_img = td.find('img', title=True)
                    if club_img and not team:
                        club_title = club_img.get('title', '')
                        if club_title and 'transfermarkt' not in club_title.lower():
                            parent_link = club_img.find_parent('a')
                            if parent_link and '/verein/' in str(parent_link.get('href', '')):
                                team = club_title
                
                if name and age:
                    # Generate approximate birth date from age
                    today = datetime.now()
                    birth_year = today.year - age
                    birth_date = f"{birth_year}-06-15"  # Approximate to mid-year
                    
                    players.append({
                        'name': name,
                        'birth_date': birth_date,
                        'age': age,
                        'nationality': nationality or 'Unknown',
                        'team': team or 'Unknown',
                        'position': position or 'Unknown'
                    })
                    
            except Exception as e:
                print(f"Error parsing row: {e}")
                continue
        
        return players
        
    except Exception as e:
        print(f"Error fetching page {page_num}: {e}")
        return []

def main():
    all_players = []
    pages_to_scrape = 8  # 25 players per page = 200 players
    
    print("Starting Transfermarkt scraper...")
    print(f"Will scrape {pages_to_scrape} pages (~{pages_to_scrape * 25} players)\n")
    
    for page in range(1, pages_to_scrape + 1):
        print(f"Scraping page {page}...")
        players = scrape_page(page)
        all_players.extend(players)
        print(f"  Found {len(players)} players (Total: {len(all_players)})")
        
        # Rate limiting - be respectful
        if page < pages_to_scrape:
            time.sleep(2 + random.random())
    
    # Create DataFrame
    df = pd.DataFrame(all_players)
    
    # Remove duplicates
    df = df.drop_duplicates(subset=['name'])
    
    print(f"\nTotal unique players: {len(df)}")
    print("\nSample data:")
    print(df.head(15).to_string())
    
    # Save to CSV
    output_path = 'attached_assets/transfermarkt_players.csv'
    df.to_csv(output_path, index=False)
    print(f"\nSaved to {output_path}")
    
    return df

if __name__ == '__main__':
    main()
