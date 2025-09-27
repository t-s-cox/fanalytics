#!/usr/bin/env python3
"""
Display game summaries from scoring plays JSON file.

This script reads the scoring_plays.json file and displays each game
in a clean, readable format with team names, final scores, and a
table of all scoring plays.
"""

import json
import sys
from typing import Dict, List, Any


def load_scoring_plays(json_file_path: str) -> List[Dict[str, Any]]:
    """
    Load scoring plays data from JSON file.
    
    Args:
        json_file_path: Path to the JSON file containing scoring plays data
        
    Returns:
        List of game dictionaries with scoring plays
    """
    try:
        with open(json_file_path, 'r', encoding='utf-8') as file:
            games_data = json.load(file)
        return games_data
    except FileNotFoundError:
        print(f"Error: File '{json_file_path}' not found.")
        return []
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in file '{json_file_path}': {e}")
        return []


def get_final_score(scoring_plays: List[Dict[str, Any]]) -> tuple[int, int]:
    """
    Get the final score from the last scoring play.
    
    Args:
        scoring_plays: List of scoring play dictionaries
        
    Returns:
        Tuple of (final_home_score, final_away_score)
    """
    if not scoring_plays:
        return 0, 0
    
    last_play = scoring_plays[-1]
    return last_play.get('home_score', 0), last_play.get('away_score', 0)


def print_game_summary(game_data: Dict[str, Any]):
    """
    Print a formatted summary for a single game.
    
    Args:
        game_data: Dictionary containing game information and scoring plays
    """
    home_team = game_data.get('home_team', 'Unknown')
    away_team = game_data.get('away_team', 'Unknown')
    scoring_plays = game_data.get('scoring_plays', [])
    
    # Get final score
    final_home_score, final_away_score = get_final_score(scoring_plays)
    
    # Print game header
    print(f"{away_team} at {home_team}")
    print(f"{final_away_score} - {final_home_score}")
    print()
    
    # Print scoring plays
    if scoring_plays:
        for i, play in enumerate(scoring_plays, 1):
            play_text = play.get('play_text', 'Unknown')
            clock = play.get('clock', 'Unknown')
            home_score = play.get('home_score', 0)
            away_score = play.get('away_score', 0)
            
            score_text = f"{away_score}-{home_score}"
            
            # Print play description
            print(f"{i:2d}. {play_text}")
            # Print clock and score on second line with indentation
            print(f"    {clock:<20} {score_text}")
            print()  # Add blank line between plays
    else:
        print("No scoring plays found.")


def print_all_games(games_data: List[Dict[str, Any]]):
    """
    Print summaries for all games.
    
    Args:
        games_data: List of game dictionaries
    """
    if not games_data:
        print("No games found.")
        return
    
    for i, game_data in enumerate(games_data):
        print_game_summary(game_data)
        
        # Add two blank lines between games (except after the last game)
        if i < len(games_data) - 1:
            print("\n")


def main():
    """Main function to run the game summary display."""
    # Default input file
    input_file = 'scoring_plays.json'
    
    # Allow command line argument for different input file
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
    
    print(f"Loading game summaries from: {input_file}")
    print("=" * 95)
    print()
    
    # Load the data
    games_data = load_scoring_plays(input_file)
    
    if not games_data:
        print("No data to display.")
        return
    
    # Print all game summaries
    print_all_games(games_data)
    
    # Print footer
    print()
    print("=" * 95)
    print(f"Total games: {len(games_data)}")


if __name__ == "__main__":
    main()