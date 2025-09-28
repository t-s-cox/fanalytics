#!/usr/bin/env python3
"""
Plot game analysis combining scoring data and sentiment data.

This script takes an export JSON file containing sentiment data and matches it
with scoring plays data to create a visualization showing both total score
and sentiment averages over game time.
"""

import json
import sys
import re
import os
import glob
import matplotlib.pyplot as plt
import numpy as np
from typing import List, Tuple, Dict, Any, Optional


def parse_game_time(game_time_str: str) -> float:
    """
    Convert game time string to continuous game time using gt = 15*q - c formula.
    
    Args:
        game_time_str: String like "11:01 1st", "0:00 4th", "0:00 OT"
        
    Returns:
        Game time as float (0-60 for regulation, 60+ for overtime)
    """
    # Handle overtime
    if "OT" in game_time_str:
        # For overtime, start at 60 minutes
        return 60.0
    
    # Parse regular time
    parts = game_time_str.split()
    if len(parts) != 2:
        return 0.0
    
    time_part = parts[0]  # "11:01"
    quarter_part = parts[1]  # "1st", "2nd", etc.
    
    # Parse quarter
    quarter_map = {"1st": 1, "2nd": 2, "3rd": 3, "4th": 4}
    quarter = quarter_map.get(quarter_part, 1)
    
    # Parse time (minutes:seconds)
    try:
        if ":" in time_part:
            minutes, seconds = time_part.split(":")
            minutes = int(minutes)
            seconds = int(seconds)
            clock_remaining = minutes + seconds / 60.0
        else:
            clock_remaining = float(time_part)
    except (ValueError, IndexError):
        clock_remaining = 0.0
    
    # Apply formula: gt = 15*q - c
    game_time = 15 * quarter - clock_remaining
    
    return game_time


def extract_team_names(filename: str) -> Tuple[str, str]:
    """
    Extract team names from export filename.
    
    Args:
        filename: Name like "cincinativskansas.json"
        
    Returns:
        Tuple of (away_team, home_team) based on the mapping
    """
    # Remove .json extension and convert to lowercase
    base_name = filename.lower().replace('.json', '')
    
    # Team name mappings
    team_mappings = {
        "cincinativskansas": ("Cincinnati", "Kansas"),
        "dukevsyracuse": ("Duke", "Syracuse"), 
        "fsuvsvirginia": ("Florida State", "Virginia"),
        "louisvillevspittsburgh": ("Louisville", "Pittsburgh"),
        "lsuvolemiss": ("LSU", "Ole Miss"),
        "notredamevsarkansas": ("Notre Dame", "Arkansas"),
        "syracusevsclemson": ("Syracuse", "Clemson"),
        "uclavsnorthwestern": ("UCLA", "Northwestern"),
        "uscvillinois": ("USC", "Illinois"),
        "utahvsvandy": ("Utah State", "Vanderbilt")
    }
    
    return team_mappings.get(base_name, ("Unknown", "Unknown"))


def find_matching_game(away_team: str, home_team: str, scoring_data: List[Dict]) -> Optional[Dict]:
    """
    Find the matching game in scoring plays data.
    
    Args:
        away_team: Away team name
        home_team: Home team name  
        scoring_data: List of games from scoring_plays.json
        
    Returns:
        Matching game dictionary or None
    """
    for game in scoring_data:
        if (game.get('away_team') == away_team and game.get('home_team') == home_team):
            return game
    return None


def load_export_data(export_file: str) -> Dict[str, Any]:
    """
    Load sentiment data from export file.
    
    Args:
        export_file: Path to export JSON file
        
    Returns:
        Dictionary containing times, avgs, worst15, best5
    """
    try:
        with open(export_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error loading export file '{export_file}': {e}")
        return {}


def load_scoring_data(scoring_file: str) -> List[Dict[str, Any]]:
    """
    Load scoring plays data.
    
    Args:
        scoring_file: Path to scoring_plays.json
        
    Returns:
        List of game dictionaries
    """
    try:
        with open(scoring_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error loading scoring file '{scoring_file}': {e}")
        return []


def get_sentiment_min_before_scoring(times: List[float], avgs: List[float], scoring_time: float, window_size: float = 0.5) -> float:
    """
    Calculate minimum sentiment in the time window BEFORE a scoring play.
    
    Args:
        times: List of time points for sentiment data
        avgs: List of sentiment averages corresponding to times
        scoring_time: The time when the scoring play occurred (gt_score)
        window_size: Size of the time window to look back (default 0.5 for 30 seconds)
    
    Returns:
        Minimum sentiment in the window before scoring, or 0.5 if no data available
    """
    if not times or not avgs or len(times) != len(avgs):
        return 0.5  # Default neutral sentiment
    
    # Window is from (scoring_time - window_size) to scoring_time (exclusive)
    start_time = max(0, scoring_time - window_size)
    end_time = scoring_time
    
    # Find sentiment values within the time window BEFORE the scoring play
    window_sentiments = []
    for i, t in enumerate(times):
        if start_time <= t < end_time:  # Note: < end_time (before scoring, not including scoring moment)
            window_sentiments.append(avgs[i])
    
    # Return minimum sentiment in window, or 0.5 if no data
    return min(window_sentiments) if window_sentiments else 0.5

def get_sentiment_max_before_scoring(times: List[float], avgs: List[float], scoring_time: float, window_size: float = 0.5) -> float:
    """
    Calculate maximum sentiment in the time window BEFORE a scoring play.
    
    Args:
        times: List of time points for sentiment data
        avgs: List of sentiment averages corresponding to times
        scoring_time: The time when the scoring play occurred (gt_score)
        window_size: Size of the time window to look back (default 0.5 for 30 seconds)
    
    Returns:
        Maximum sentiment in the window before scoring, or 0.5 if no data available
    """
    if not times or not avgs or len(times) != len(avgs):
        return 0.5  # Default neutral sentiment
    
    # Window is from (scoring_time - window_size) to scoring_time (exclusive)
    start_time = max(0, scoring_time - window_size)
    end_time = scoring_time
    
    # Find sentiment values within the time window BEFORE the scoring play
    window_sentiments = []
    for i, t in enumerate(times):
        if start_time <= t < end_time:  # Note: < end_time (before scoring, not including scoring moment)
            window_sentiments.append(avgs[i])
    
    # Return maximum sentiment in window, or 0.5 if no data
    return max(window_sentiments) if window_sentiments else 0.5

def get_sentiment_avg_before_scoring(times: List[float], avgs: List[float], scoring_time: float, window_size: float = 0.5) -> float:
    """
    Calculate average sentiment in the time window BEFORE a scoring play.
    
    Args:
        times: List of time points for sentiment data
        avgs: List of sentiment averages corresponding to times
        scoring_time: The time when the scoring play occurred (gt_score)
        window_size: Size of the time window to look back (default 0.5 for 30 seconds)"""
    if not times or not avgs or len(times) != len(avgs):
        return 0.5  # Default neutral sentiment
    
    # Window is from (scoring_time - window_size) to scoring_time (exclusive)
    start_time = max(0, scoring_time - window_size)
    end_time = scoring_time
    
    # Find sentiment values within the time window BEFORE the scoring play
    window_sentiments = []
    for i, t in enumerate(times):
        if start_time <= t < end_time:  # Note: < end_time (before scoring, not including scoring moment)
            window_sentiments.append(avgs[i])
    
    # Return average sentiment in window, or 0.5 if no data
    return sum(window_sentiments) / len(window_sentiments) if window_sentiments else 0.5


def calculate_total_scores_over_time(scoring_plays: List[Dict], sentiment_times: List[float] = None, sentiment_avgs: List[float] = None) -> Tuple[List[float], List[int], List[float], List[float], List[float], List[float]]:
    """
    Calculate total score, predicted score, and sentiment-based prediction over game time.
    
    Args:
        scoring_plays: List of scoring play dictionaries
        sentiment_times: List of time points for sentiment data
        sentiment_avgs: List of sentiment averages
        
    Returns:
        Tuple of (game_times, total_scores, prediction_times, predicted_scores, sentiment_prediction_times, sentiment_predicted_scores)
    """
    game_times = []
    total_scores = []
    prediction_times = []
    predicted_scores = []
    sentiment_prediction_times = []
    sentiment_predicted_scores = []
    
    # Sort scoring plays by game time
    sorted_plays = sorted(scoring_plays, key=lambda x: parse_game_time(x['game_time']))
    
    # Start with 0-0 at game start
    game_times.append(0.0)
    total_scores.append(0)
    # No prediction at gt=0 (would be division by zero)
    
    for play in sorted_plays:
        gt = parse_game_time(play['game_time'])
        total_score = play['home_score'] + play['away_score']
        
        game_times.append(gt)
        total_scores.append(total_score)
        
        # Calculate predicted score: (current total score) * (60 / gt) when gt > 0
        if gt > 0:
            predicted_score = total_score * (60.0 / gt)
            prediction_times.append(gt)
            predicted_scores.append(predicted_score)
            
            # Calculate sentiment-based prediction if sentiment data is available
            if sentiment_times is not None and sentiment_avgs is not None:
                # Get minimum sentiment in the 0.5 gt window BEFORE this scoring play
                min_sentiment = get_sentiment_min_before_scoring(sentiment_times, sentiment_avgs, gt, 0.5)
                max_sentiment = get_sentiment_max_before_scoring(sentiment_times, sentiment_avgs, gt, 0.5)
                avg_sentiment = get_sentiment_avg_before_scoring(sentiment_times, sentiment_avgs, gt, 0.5)
                # Sentiment prediction: amplify sentiment impact for visibility
                # Use minimum sentiment to capture most pessimistic moments (more conservative prediction)
                # Baseline factor is 1.0 (same as green line), sentiment adjusts from 0.5 to 1.5
                sentiment_factor = 0.8 + (avg_sentiment*0.5)
                remaining_game_factor = (60.0 - gt) / gt
                sentiment_prediction = total_score + (total_score * remaining_game_factor * sentiment_factor)
                
                sentiment_prediction_times.append(gt)
                sentiment_predicted_scores.append(sentiment_prediction)
    
    # Extend the final score to the end of regulation (gt=60)
    # if the last scoring play was before the end of the game
    if game_times and game_times[-1] < 60.0:
        game_times.append(60.0)
        total_scores.append(total_scores[-1])  # Keep the same final score
        
        # Add final prediction point at gt=60 (prediction equals actual score at end)
        if prediction_times and predicted_scores:
            prediction_times.append(60.0)
            predicted_scores.append(total_scores[-1])  # At gt=60, prediction = actual
            
        # Add final sentiment prediction point
        if sentiment_prediction_times and sentiment_predicted_scores:
            sentiment_prediction_times.append(60.0)
            sentiment_predicted_scores.append(total_scores[-1])  # At gt=60, prediction = actual
    
    return game_times, total_scores, prediction_times, predicted_scores, sentiment_prediction_times, sentiment_predicted_scores


def plot_game_analysis(export_file: str, scoring_file: str = "Data/scoring_plays.json", output_dir: str = "outputGraphs"):
    """
    Create a plot combining total score and sentiment data over game time.
    
    Args:
        export_file: Path to export JSON file
        scoring_file: Path to scoring_plays.json
        output_dir: Directory to save output plots
    """
    # Load data
    export_data = load_export_data(export_file)
    scoring_data = load_scoring_data(scoring_file)
    
    if not export_data or not scoring_data:
        print("Error: Could not load required data files")
        return
    
    # Extract team names and find matching game
    filename = export_file.split('/')[-1].split('\\')[-1]  # Handle both / and \ path separators
    away_team, home_team = extract_team_names(filename)
    
    if away_team == "Unknown" or home_team == "Unknown":
        print(f"Error: Could not parse team names from filename '{filename}'")
        return
    
    game = find_matching_game(away_team, home_team, scoring_data)
    if not game:
        print(f"Error: Could not find matching game for {away_team} vs {home_team}")
        return
    
    print(f"Found matching game: {away_team} @ {home_team}")
    
    # Extract sentiment data
    times = export_data.get('times', [])
    avgs = export_data.get('avgs', [])
    
    if len(times) != len(avgs):
        print("Error: Mismatched lengths of times and avgs arrays")
        return
    
    # Calculate total scores and predictions over time
    score_times, total_scores, prediction_times, predicted_scores, sentiment_prediction_times, sentiment_predicted_scores = calculate_total_scores_over_time(game['scoring_plays'], times, avgs)
    
    # Get final score for error calculations
    final_score = total_scores[-1] if total_scores else 0
    
    # Create two subplots: main game analysis and prediction errors
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 10))
    
    # === FIRST PLOT: Main Game Analysis ===
    # Plot total score on primary y-axis as step function
    color1 = 'tab:red'
    ax1.set_xlabel('Game Time (minutes)', fontsize=12)
    ax1.set_ylabel('Total Score', color=color1, fontsize=12)
    line1 = ax1.step(score_times, total_scores, where='post', color=color1, linewidth=2.5, 
                     label='Total Score', marker='o', markersize=4)
    
    # Plot predicted score line (green dotted)
    if prediction_times and predicted_scores:
        color3 = 'tab:green'
        line3 = ax1.plot(prediction_times, predicted_scores, color=color3, linewidth=2.0, 
                         linestyle='--', label='Predicted Final Score', marker='s', markersize=3)
    
    # Plot sentiment-based prediction line (bold purple)
    if sentiment_prediction_times and sentiment_predicted_scores:
        color4 = 'tab:purple'
        line4 = ax1.plot(sentiment_prediction_times, sentiment_predicted_scores, color=color4, 
                         linewidth=3.0, label='Sentiment-Adjusted Prediction', marker='^', markersize=4)
    
    ax1.tick_params(axis='y', labelcolor=color1)
    ax1.grid(True, alpha=0.3)
    
    # Set x-axis limits (0-60 minutes for regulation)
    ax1.set_xlim(0, 65)
    
    # Add quarter markers
    quarter_times = [0, 15, 30, 45, 60]
    quarter_labels = ['Start', 'Q2', 'Q3', 'Q4', 'End']
    for qt, ql in zip(quarter_times, quarter_labels):
        ax1.axvline(x=qt, color='gray', linestyle='--', alpha=0.5)
        ax1.text(qt, ax1.get_ylim()[1] * 0.95, ql, rotation=90, 
                verticalalignment='top', fontsize=10, alpha=0.7)
    
    # Add title and legend for first plot
    ax1.set_title(f'{away_team} @ {home_team}\nTotal Score and Predictions Over Game Time', 
              fontsize=14, fontweight='bold', pad=20)
    
    # Legend for first plot
    ax1.legend(loc='upper left')
    
    # === SECOND PLOT: Prediction Errors ===
    ax2.set_xlabel('Game Time (minutes)', fontsize=12)
    ax2.set_ylabel('Prediction Error (Predicted - Actual Final)', fontsize=12)
    
    # Calculate and plot prediction errors
    if prediction_times and predicted_scores:
        green_errors = [pred - final_score for pred in predicted_scores]
        ax2.plot(prediction_times, green_errors, color='tab:green', linewidth=2.0, 
                linestyle='--', label='Pace-Based Error', marker='s', markersize=3)
    
    if sentiment_prediction_times and sentiment_predicted_scores:
        purple_errors = [pred - final_score for pred in sentiment_predicted_scores]
        ax2.plot(sentiment_prediction_times, purple_errors, color='tab:purple', linewidth=3.0, 
                label='Sentiment-Adjusted Error', marker='^', markersize=4)
    
    # Add horizontal line at y=0 (perfect prediction)
    ax2.axhline(y=0, color='black', linestyle='-', alpha=0.5, linewidth=1)
    
    ax2.grid(True, alpha=0.3)
    ax2.set_xlim(0, 65)
    
    # Add quarter markers to second plot
    for qt, ql in zip(quarter_times, quarter_labels):
        ax2.axvline(x=qt, color='gray', linestyle='--', alpha=0.5)
        ax2.text(qt, ax2.get_ylim()[1] * 0.95, ql, rotation=90, 
                verticalalignment='top', fontsize=10, alpha=0.7)
    
    # Add title and legend for second plot
    ax2.set_title('Prediction Accuracy Over Game Time\n(Positive = Over-prediction, Negative = Under-prediction)', 
                 fontsize=12, pad=10)
    ax2.legend(loc='upper right')
    
    # Tight layout for both plots
    plt.tight_layout()
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Save the plot
    output_filename = f"game_analysis_{away_team.lower().replace(' ', '_')}_{home_team.lower().replace(' ', '_')}.png"
    output_path = os.path.join(output_dir, output_filename)
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    print(f"Plot saved as '{output_path}'")
    
    # Close the plot to free memory
    plt.close()


def main():
    """Main function to run the game analysis plotting."""
    # Check if user provided specific file or wants to process all files
    if len(sys.argv) == 2:
        # Single file mode
        export_file = sys.argv[1]
        print(f"Creating game analysis plot for: {export_file}")
        plot_game_analysis(export_file)
    elif len(sys.argv) == 1:
        # Process all files in exports folder
        exports_pattern = "exports/*.json"
        all_export_files = glob.glob(exports_pattern)
        
        # Skip problematic files
        skip_files = ["exports/fsuvsvirginia.json", "exports\\fsuvsvirginia.json", 
                     "exports/syracusevsclemson.json", "exports\\syracusevsclemson.json"]
        
        export_files = [f for f in all_export_files if f not in skip_files]
        
        if not export_files:
            print(f"No valid JSON files found in exports folder")
            return
        
        skipped_count = len(all_export_files) - len(export_files)
        if skipped_count > 0:
            print(f"Skipping {skipped_count} problematic file(s): fsuvsvirginia.json, syracusevsclemson.json")
        
        print(f"Found {len(export_files)} valid export files to process:")
        for file in export_files:
            print(f"  - {file}")
        
        print("\nProcessing valid export files...")
        
        success_count = 0
        error_count = 0
        
        for export_file in export_files:
            try:
                print(f"\nProcessing: {export_file}")
                plot_game_analysis(export_file)
                success_count += 1
            except Exception as e:
                print(f"Error processing {export_file}: {e}")
                error_count += 1
        
        print(f"\n=== Summary ===")
        print(f"Successfully processed: {success_count} files")
        print(f"Errors: {error_count} files")
        print(f"All plots saved in 'outputGraphs' folder")
    
    else:
        print("Usage: python plot_game_analysis.py [export_json_file]")
        print("\nOptions:")
        print("  No arguments: Process all files in exports/ folder")
        print("  Single file: Process specific export JSON file")
        print("\nExamples:")
        print("  python plot_game_analysis.py                              # Process all files")
        print("  python plot_game_analysis.py exports/cincinativskansas.json  # Single file")
        print("\nAvailable export files:")
        print("  - cincinativskansas.json (Cincinnati @ Kansas)")
        print("  - dukevsyracuse.json (Duke @ Syracuse)")
        print("  - fsuvsvirginia.json (Florida State @ Virginia)")
        print("  - louisvillevspittsburgh.json (Louisville @ Pittsburgh)")
        print("  - lsuvolemiss.json (LSU @ Ole Miss)")
        print("  - notredamevsarkansas.json (Notre Dame @ Arkansas)")
        print("  - syracusevsclemson.json (Syracuse @ Clemson)")
        print("  - uclavsnorthwestern.json (UCLA @ Northwestern)")
        print("  - uscvillinois.json (USC @ Illinois)")
        print("  - utahvsvandy.json (Utah State @ Vanderbilt)")
        return


if __name__ == "__main__":
    main()