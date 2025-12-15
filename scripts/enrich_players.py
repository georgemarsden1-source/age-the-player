import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import random
import re

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-GB,en;q=0.5',
}

def search_player(name):
    """Search for a player on Transfermarkt and return their profile URL"""
    search_url = f"https://www.transfermarkt.co.uk/schnellsuche/ergebnis/schnellsuche?query={name.replace(' ', '+')}"
    try:
        response = requests.get(search_url, headers=headers, timeout=30)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find player results table
        player_table = soup.find('table', class_='items')
        if player_table:
            first_row = player_table.find('tr', class_=['odd', 'even'])
            if first_row:
                link = first_row.find('a', class_='spielprofil_tooltip')
                if link:
                    return 'https://www.transfermarkt.co.uk' + link.get('href')
        return None
    except Exception as e:
        print(f"  Search error for {name}: {e}")
        return None

def get_player_details(profile_url):
    """Get player details from their Transfermarkt profile page"""
    try:
        response = requests.get(profile_url, headers=headers, timeout=30)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        details = {}
        
        # Full name from header
        header = soup.find('h1', class_='data-header__headline-wrapper')
        if header:
            details['full_name'] = header.get_text(strip=True)
        
        # Image URL
        img = soup.find('img', class_='data-header__profile-image')
        if img:
            details['image_url'] = img.get('src')
        
        # Info box data
        info_items = soup.find_all('span', class_='info-table__content')
        labels = soup.find_all('span', class_='info-table__content--regular')
        
        for item in soup.find_all('li', class_='data-header__label'):
            label_text = item.get_text(strip=True).lower()
            value_span = item.find('span', class_='data-header__content')
            if value_span:
                value = value_span.get_text(strip=True)
                if 'date of birth' in label_text or 'dob' in label_text:
                    details['birth_date'] = value
                elif 'citizenship' in label_text or 'nationality' in label_text:
                    details['nationality'] = value
        
        # Current club from header
        club_link = soup.find('span', class_='data-header__club')
        if club_link:
            club_a = club_link.find('a')
            if club_a:
                details['team'] = club_a.get_text(strip=True)
        
        # Position
        pos_li = soup.find('li', class_='data-header__label')
        for li in soup.find_all('li', class_='data-header__label'):
            if 'position' in li.get_text(strip=True).lower():
                pos_span = li.find('span', class_='data-header__content')
                if pos_span:
                    details['position'] = pos_span.get_text(strip=True)
                    break
        
        return details
    except Exception as e:
        print(f"  Profile error: {e}")
        return {}

def main():
    # Read current CSV
    df = pd.read_csv('attached_assets/transfermarkt_players.csv')
    print(f"Total players: {len(df)}")
    
    # Find players that need enrichment (team is "Various" or no image)
    needs_update = df[(df['team'] == 'Various') | (df['image_url'].isna())]
    print(f"Players needing update: {len(needs_update)}")
    
    updated_count = 0
    failed_players = []
    
    for idx, row in needs_update.iterrows():
        name = row['name']
        print(f"\nProcessing {updated_count + 1}/{len(needs_update)}: {name}")
        
        # Search for player
        profile_url = search_player(name)
        if not profile_url:
            print(f"  Could not find profile for {name}")
            failed_players.append(name)
            time.sleep(1)
            continue
        
        print(f"  Found: {profile_url}")
        
        # Get details
        details = get_player_details(profile_url)
        
        if details:
            if 'full_name' in details:
                df.at[idx, 'name'] = details['full_name']
            if 'team' in details:
                df.at[idx, 'team'] = details['team']
            if 'image_url' in details:
                df.at[idx, 'image_url'] = details['image_url']
            if 'position' in details:
                df.at[idx, 'position'] = details['position']
            if 'nationality' in details:
                df.at[idx, 'nationality'] = details['nationality']
            
            print(f"  Updated: {details.get('full_name', name)} @ {details.get('team', 'Unknown')}")
            updated_count += 1
        else:
            failed_players.append(name)
        
        # Rate limiting
        time.sleep(1.5 + random.random())
        
        # Save progress every 50 players
        if updated_count % 50 == 0:
            df.to_csv('attached_assets/transfermarkt_players.csv', index=False)
            print(f"\n=== Progress saved: {updated_count} players updated ===\n")
    
    # Final save
    df.to_csv('attached_assets/transfermarkt_players.csv', index=False)
    
    print(f"\n=== Complete ===")
    print(f"Updated: {updated_count} players")
    print(f"Failed: {len(failed_players)} players")
    if failed_players:
        print(f"Failed players: {failed_players[:20]}...")

if __name__ == '__main__':
    main()
