#!/usr/bin/env python3
"""
Extract scoring plays from college football game data.

This script processes a JSON file containing game data and extracts the last play
from each drive that had a scoring opportunity. For each scoring play, it returns
a tuple of (playType, playText, clock).
"""

import json
import sys
from typing import List, Tuple, Any, Dict


def extract_scoring_plays(json_file_path: str) -> List[Dict[str, Any]]:
    """
    Extract scoring plays from each game in the JSON file.
    
    Args:
        json_file_path: Path to the JSON file containing game data
        
    Returns:
        List where each element represents a game dictionary containing:
        - home_team: name of home team
        - away_team: name of away team  
        - scoring_plays: list of tuples with (playType, playText, clock, homeScore, awayScore)
    """
    try:
        with open(json_file_path, 'r', encoding='utf-8') as file:
            games_data = json.load(file)
    except FileNotFoundError:
        print(f"Error: File '{json_file_path}' not found.")
        return []
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in file '{json_file_path}': {e}")
        return []
    
    all_games_scoring_plays = []
    
    # Process each game
    for game_index, game in enumerate(games_data):
        if not isinstance(game, dict):
            print(f"Warning: Game {game_index + 1} is not a dictionary, skipping...")
            continue
            
        game_scoring_plays = []
        
        # Extract team information
        teams = game.get('teams', [])
        if not isinstance(teams, list) or len(teams) != 2:
            print(f"Warning: Game {game_index + 1} teams is not a valid list, skipping...")
            continue
            
        home_team = None
        away_team = None
        
        for team in teams:
            if not isinstance(team, dict):
                continue
            home_away = team.get('homeAway', '')
            team_name = team.get('team', 'Unknown')
            
            if home_away == 'home':
                home_team = team_name
            elif home_away == 'away':
                away_team = team_name
        
        if home_team is None or away_team is None:
            print(f"Warning: Game {game_index + 1} could not determine home/away teams, skipping...")
            continue
        
        # Get drives from the game
        drives = game.get('drives', [])
        if not isinstance(drives, list):
            print(f"Warning: Game {game_index + 1} drives is not a list, skipping...")
            continue
        
        # Process each drive
        for drive_index, drive in enumerate(drives):
            if not isinstance(drive, dict):
                print(f"Warning: Game {game_index + 1}, Drive {drive_index + 1} is not a dictionary, skipping...")
                continue
            
            # Check if this drive resulted in a scoring play based on result field
            result = drive.get('result', '')
            
            # Check if result contains any scoring keywords
            scoring_keywords = ["Touchdown", "Field Goal", "Safety"]
            is_scoring_play = any(keyword in result for keyword in scoring_keywords)
            
            if is_scoring_play:
                # Get the plays list
                plays = drive.get('plays', [])
                
                if not isinstance(plays, list):
                    print(f"Warning: Game {game_index + 1}, Drive {drive_index + 1} plays is not a list, skipping...")
                    continue
                
                if len(plays) == 0:
                    print(f"Warning: Game {game_index + 1}, Drive {drive_index + 1} has scoring result but no plays, skipping...")
                    continue
                
                # Find the actual scoring play (may not be the last play)
                scoring_play = None
                
                # Administrative play types that are not actual scoring plays
                administrative_plays = ["End of Game", "End of Half", "End of Quarter", "Timeout", "Kickoff", "Penalty"]
                
                # Work backwards through plays to find the actual scoring play
                for play in reversed(plays):
                    if not isinstance(play, dict):
                        continue
                    
                    play_type = play.get('playType', '')
                    play_text = play.get('playText', '')
                    
                    # Skip administrative plays
                    is_administrative = any(admin_type in play_type for admin_type in administrative_plays)
                    is_administrative = is_administrative or any(admin_type in play_text for admin_type in administrative_plays)
                    
                    if not is_administrative:
                        # Check if this play is actually a scoring play
                        scoring_play_types = ["Touchdown", "Field Goal", "Safety", "FG"]
                        is_actual_scoring_play = any(scoring_type in play_type for scoring_type in scoring_play_types)
                        is_actual_scoring_play = is_actual_scoring_play or any(scoring_type in play_text for scoring_type in scoring_play_types)
                        
                        if is_actual_scoring_play:
                            scoring_play = play
                            break
                        # If it's not administrative and not clearly a scoring play, 
                        # but the drive result indicates scoring, use this play
                        elif scoring_play is None:
                            scoring_play = play
                
                # If we couldn't find a better play, use the last play
                if scoring_play is None:
                    scoring_play = plays[-1]
                
                if not isinstance(scoring_play, dict):
                    print(f"Warning: Game {game_index + 1}, Drive {drive_index + 1} scoring play is not a dictionary, skipping...")
                    continue
                
                # Extract the required fields
                play_type = scoring_play.get('playType', 'Unknown')
                play_text = scoring_play.get('playText', 'Unknown')
                clock = scoring_play.get('clock', 'Unknown')
                period = scoring_play.get('period', 1)
                home_score = scoring_play.get('homeScore', 0)
                away_score = scoring_play.get('awayScore', 0)
                
                # Format time with period
                period_names = {1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "OT"}
                period_str = period_names.get(period, f"{period}OT" if period > 4 else "1st")
                formatted_time = f"{clock} {period_str}"
                
                # Create tuple and add to game's scoring plays
                scoring_play_tuple = (play_type, play_text, formatted_time, home_score, away_score)
                game_scoring_plays.append(scoring_play_tuple)
        
        # Create game data with team information
        game_data = {
            'game_number': game_index + 1,
            'home_team': home_team,
            'away_team': away_team,
            'scoring_plays': game_scoring_plays
        }
        
        # Add this game's data to the overall list
        all_games_scoring_plays.append(game_data)
        print(f"Game {game_index + 1} ({away_team} @ {home_team}): Found {len(game_scoring_plays)} scoring plays")
    
    return all_games_scoring_plays


def print_scoring_plays(all_games_scoring_plays: List[Dict[str, Any]]):
    """
    Print the scoring plays in a readable format.
    
    Args:
        all_games_scoring_plays: List of game dictionaries with team info and scoring plays
    """
    for game_data in all_games_scoring_plays:
        game_number = game_data['game_number']
        home_team = game_data['home_team']
        away_team = game_data['away_team']
        game_scoring_plays = game_data['scoring_plays']
        
        print(f"\n=== GAME {game_number}: {away_team} @ {home_team} ===")
        
        if not game_scoring_plays:
            print("No scoring plays found.")
            continue
        
        for play_index, (play_type, play_text, clock, home_score, away_score) in enumerate(game_scoring_plays):
            print(f"  Scoring Play {play_index + 1}:")
            print(f"    Type: {play_type}")
            print(f"    Clock: {clock}")
            print(f"    Score: {home_team} {home_score} - {away_team} {away_score}")
            print(f"    Description: {play_text}")
            print()


def save_to_json(all_games_scoring_plays: List[Dict[str, Any]], output_file: str):
    """
    Save the scoring plays to a JSON file.
    
    Args:
        all_games_scoring_plays: List of game dictionaries with team info and scoring plays
        output_file: Path to save the output JSON file
    """
    # Convert tuples to dictionaries for better JSON representation
    json_output = []
    
    for game_data in all_games_scoring_plays:
        formatted_game_data = {
            'game_number': game_data['game_number'],
            'home_team': game_data['home_team'],
            'away_team': game_data['away_team'],
            'scoring_plays': [
                {
                    'play_type': play_type,
                    'play_text': play_text,
                    'clock': clock,
                    'home_score': home_score,
                    'away_score': away_score
                }
                for play_type, play_text, clock, home_score, away_score in game_data['scoring_plays']
            ]
        }
        json_output.append(formatted_game_data)
    
    try:
        with open(output_file, 'w', encoding='utf-8') as file:
            json.dump(json_output, file, indent=2, ensure_ascii=False)
        print(f"\nScoring plays saved to '{output_file}'")
    except IOError as e:
        print(f"Error: Could not write to file '{output_file}': {e}")


def main():
    """Main function to run the scoring play extraction."""
    # Default input file
    input_file = 'live_scores.json'
    output_file = 'scoring_plays.json'
    
    # Allow command line arguments
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
    if len(sys.argv) > 2:
        output_file = sys.argv[2]
    
    print(f"Extracting scoring plays from: {input_file}")
    
    # Extract scoring plays
    all_games_scoring_plays = extract_scoring_plays(input_file)
    
    if not all_games_scoring_plays:
        print("No games found or error occurred.")
        return
    
    # Print summary
    total_games = len(all_games_scoring_plays)
    total_scoring_plays = sum(len(game_data['scoring_plays']) for game_data in all_games_scoring_plays)
    
    print(f"\n=== SUMMARY ===")
    print(f"Total games processed: {total_games}")
    print(f"Total scoring plays found: {total_scoring_plays}")
    
    # Print detailed results
    print_scoring_plays(all_games_scoring_plays)
    
    # Save to JSON file
    save_to_json(all_games_scoring_plays, output_file)
    
    # Return the data (useful if importing as module)
    return all_games_scoring_plays


if __name__ == "__main__":
    main()