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


def save_data_points_json(score_times: List[float], total_scores: List[int], 
                         prediction_times: List[float], predicted_scores: List[float],
                         sentiment_prediction_times: List[float], sentiment_predicted_scores: List[float],
                         final_score: int, away_team: str, home_team: str, output_dir: str = "outputGraphs"):
    """
    Save data points from the game analysis as JSON file.
    
    Args:
        score_times: List of game times for scoring plays
        total_scores: List of total scores at each time point
        prediction_times: List of times for pace-based predictions
        predicted_scores: List of pace-based predicted scores
        sentiment_prediction_times: List of times for sentiment-based predictions
        sentiment_predicted_scores: List of sentiment-based predicted scores
        final_score: Final actual score of the game
        away_team: Away team name
        home_team: Home team name
        output_dir: Directory to save JSON files
    """
    # Create aligned data arrays - use scoring times as the base timeline
    data_points = {
        "time": [],
        "total_score": [],
        "raw_prediction": [],
        "sentiment_prediction": [],
        "raw_error": [],
        "sentiment_error": []
    }
    
    # For each scoring time point, find corresponding prediction values
    for i, time_point in enumerate(score_times):
        data_points["time"].append(time_point)
        data_points["total_score"].append(total_scores[i])
        
        # Find closest prediction values for this time point
        raw_pred = None
        sentiment_pred = None
        
        # Find raw prediction at this time (or closest available)
        if prediction_times:
            # Find the prediction value at or before this time
            available_preds = [(t, p) for t, p in zip(prediction_times, predicted_scores) if t <= time_point]
            if available_preds:
                raw_pred = available_preds[-1][1]  # Get the most recent prediction
            elif time_point == 0:
                raw_pred = None  # No prediction at game start
        
        # Find sentiment prediction at this time (or closest available)
        if sentiment_prediction_times:
            # Find the sentiment prediction value at or before this time
            available_sentiment = [(t, p) for t, p in zip(sentiment_prediction_times, sentiment_predicted_scores) if t <= time_point]
            if available_sentiment:
                sentiment_pred = available_sentiment[-1][1]  # Get the most recent prediction
            elif time_point == 0:
                sentiment_pred = None  # No prediction at game start
        
        # Append predictions (None for time 0)
        data_points["raw_prediction"].append(raw_pred)
        data_points["sentiment_prediction"].append(sentiment_pred)
        
        # Calculate errors (prediction - actual final score)
        raw_error = None if raw_pred is None else raw_pred - final_score
        sentiment_error = None if sentiment_pred is None else sentiment_pred - final_score
        
        data_points["raw_error"].append(raw_error)
        data_points["sentiment_error"].append(sentiment_error)
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Save JSON file
    output_filename = f"data_points_{away_team.lower().replace(' ', '_')}_{home_team.lower().replace(' ', '_')}.json"
    output_path = os.path.join(output_dir, output_filename)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data_points, f, indent=2)
    
    print(f"Data points saved as '{output_path}'")


def apply_plot_styling(fig, axes, is_dark_mode=False):
    """
    Apply consistent styling to plots for light or dark mode.
    
    Args:
        fig: matplotlib figure object
        axes: matplotlib axes object or list of axes
        is_dark_mode: boolean indicating whether to apply dark mode styling
    """
    if not isinstance(axes, (list, tuple)):
        axes = [axes]
    
    if is_dark_mode:
        # Dark mode styling
        bg_color = '#232d3f'
        text_color = '#ffffff'
        grid_color = '#404040'
        grid_alpha = 0.3
    else:
        # Light mode styling (default)
        bg_color = '#ffffff'
        text_color = '#000000'
        grid_color = 'gray'
        grid_alpha = 0.3
    
    # Apply background color to figure and axes
    fig.patch.set_facecolor(bg_color)
    
    for ax in axes:
        ax.set_facecolor(bg_color)
        
        # Set text colors
        ax.xaxis.label.set_color(text_color)
        ax.yaxis.label.set_color(text_color)
        ax.title.set_color(text_color)
        
        # Set tick colors
        ax.tick_params(axis='x', colors=text_color)
        ax.tick_params(axis='y', colors=text_color)
        
        # Set spine colors
        for spine in ax.spines.values():
            spine.set_color(text_color)
        
        # Update grid
        ax.grid(True, color=grid_color, alpha=grid_alpha)
        
        # Update legend if it exists
        legend = ax.get_legend()
        if legend:
            legend.get_frame().set_facecolor(bg_color)
            legend.get_frame().set_edgecolor(text_color)
            for text in legend.get_texts():
                text.set_color(text_color)
        
        # Update all text objects in the axes (like annotations, quarter markers, etc.)
        for text in ax.texts:
            text.set_color(text_color)


def get_line_widths(is_dark_mode=False):
    """Get appropriate line widths for light or dark mode."""
    if is_dark_mode:
        return {
            'main_line': 3.0,      # Thicker for visibility
            'secondary_line': 2.5,  # Thicker for visibility
            'thin_line': 2.0       # Thicker for visibility
        }
    else:
        return {
            'main_line': 2.5,      # Standard thickness
            'secondary_line': 2.0,  # Standard thickness
            'thin_line': 1.5       # Standard thickness
        }


def create_sentiment_plot_data(times: List[float], avgs: List[float]):
    """
    Prepare sentiment data for plotting.
    
    Args:
        times: List of time points for sentiment data
        avgs: List of sentiment averages
        
    Returns:
        Tuple of (filtered_times, filtered_sentiment, smooth_times, smooth_sentiment)
    """
    if not times or not avgs:
        return None, None, None, None
    
    # Convert to numpy arrays for processing
    sentiment_times_np = np.array(times)
    sentiment_values_np = np.array(avgs)
    
    # Filter sentiment data to game time range (0-60 minutes)
    mask = (sentiment_times_np >= 0) & (sentiment_times_np <= 60)
    filtered_times = sentiment_times_np[mask]
    filtered_sentiment = sentiment_values_np[mask]
    
    if len(filtered_times) == 0:
        return None, None, None, None
    
    # Create and plot smoothed sentiment if we have enough points
    if len(filtered_times) > 3:
        # Work with original discrete time points to find exact maxima
        def create_exact_envelope(times_orig, sentiment_orig, time_window=0.5):
            """Create envelope using exact maximum sentiment at each discrete time point."""
            # Round times to create discrete bins
            time_resolution = 0.1  # 0.1 minute (6 second) resolution
            rounded_times = np.round(times_orig / time_resolution) * time_resolution
            
            # Find unique time points
            unique_times = np.unique(rounded_times)
            envelope_times = []
            envelope_values = []
            
            for target_time in unique_times:
                # Find all sentiment values within this time bin
                time_mask = np.abs(rounded_times - target_time) < time_resolution/2
                if np.any(time_mask):
                    # Get maximum sentiment at this time point
                    max_sentiment = np.max(sentiment_orig[time_mask])
                    envelope_times.append(target_time)
                    envelope_values.append(max_sentiment)
            
            return np.array(envelope_times), np.array(envelope_values)
        
        # Get exact envelope points
        envelope_times, envelope_values = create_exact_envelope(filtered_times, filtered_sentiment)
        
        if len(envelope_times) > 1:
            # Create piecewise interpolation between successive time indices
            def create_piecewise_envelope(env_times, env_values, points_per_segment=20):
                """Create piecewise smooth curves between consecutive time points."""
                all_times = []
                all_values = []
                
                # For each pair of consecutive envelope points, create smooth interpolation
                for i in range(len(env_times) - 1):
                    start_time = env_times[i]
                    end_time = env_times[i + 1]
                    start_value = env_values[i] 
                    end_value = env_values[i + 1]
                    
                    # Create time points for this segment (excluding the end point to avoid duplication)
                    segment_times = np.linspace(start_time, end_time, points_per_segment, endpoint=False)
                    
                    # Simple smooth interpolation between the two points
                    # Use cosine interpolation for smoothness
                    t_normalized = (segment_times - start_time) / (end_time - start_time)
                    # Cosine interpolation creates smooth S-curve
                    smooth_t = 0.5 * (1 - np.cos(np.pi * t_normalized))
                    segment_values = start_value + (end_value - start_value) * smooth_t
                    
                    all_times.extend(segment_times)
                    all_values.extend(segment_values)
                
                # Add the final point
                all_times.append(env_times[-1])
                all_values.append(env_values[-1])
                
                return np.array(all_times), np.array(all_values)
            
            # Create piecewise smooth envelope
            smooth_times, smooth_sentiment = create_piecewise_envelope(envelope_times, envelope_values)
            
            # Ensure the interpolated curve never goes below any original data point
            # by checking against the original data at each interpolated time
            for i, t in enumerate(smooth_times):
                # Find original sentiment values near this time
                nearby_mask = np.abs(filtered_times - t) <= 0.15  # Within 9 seconds
                if np.any(nearby_mask):
                    max_nearby = np.max(filtered_sentiment[nearby_mask])
                    smooth_sentiment[i] = max(smooth_sentiment[i], max_nearby)
                    
        else:
            # Not enough envelope points, use original data
            smooth_times = filtered_times
            smooth_sentiment = filtered_sentiment
        
    return filtered_times, filtered_sentiment, smooth_times, smooth_sentiment


def plot_sentiment_analysis(times: List[float], avgs: List[float], away_team: str, home_team: str, output_dir: str = "outputGraphs"):
    """
    Create sentiment analysis plots in both light and dark modes.
    
    Args:
        times: List of time points for sentiment data
        avgs: List of sentiment averages
        away_team: Away team name
        home_team: Home team name
        output_dir: Directory to save output plots
    """
    if not times or not avgs:
        print("No sentiment data available for sentiment plot")
        return
    
    # Get processed sentiment data
    filtered_times, filtered_sentiment, smooth_times, smooth_sentiment = create_sentiment_plot_data(times, avgs)
    
    if filtered_times is None:
        print("No sentiment data in game time range (0-60 minutes)")
        return
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate both light and dark mode plots
    for is_dark_mode in [False, True]:
        mode_prefix = "DARK_" if is_dark_mode else "LIGHT_"
        
        # Create the sentiment plot
        fig, ax = plt.subplots(1, 1, figsize=(12, 6))
        
        # Get appropriate line widths
        line_widths = get_line_widths(is_dark_mode)
        
        # Fill area under the smoothed sentiment curve
        color_fill = '#4a9eff' if is_dark_mode else 'tab:blue'
        fill_alpha = 0.5 if is_dark_mode else 0.4
        edge_width = line_widths['secondary_line']
        
        ax.fill_between(smooth_times, 0, smooth_sentiment, color=color_fill, alpha=fill_alpha, 
                       label='Sentiment', edgecolor=color_fill, linewidth=edge_width)
        
        # Set labels and formatting
        ax.set_xlabel('Game Time (minutes)', fontsize=12)
        ax.set_ylabel('Sentiment (0 = Negative, 1 = Positive)', fontsize=12)
        ax.set_ylim(0, 1)
        ax.set_xlim(0, 65)
        
        # Add quarter markers
        quarter_times = [0, 15, 30, 45, 60]
        quarter_labels = ['Start', 'Q2', 'Q3', 'Q4', 'End']
        marker_color = '#cccccc' if is_dark_mode else 'gray'
        marker_alpha = 0.6 if is_dark_mode else 0.5
        text_color = '#ffffff' if is_dark_mode else '#000000'
        
        for qt, ql in zip(quarter_times, quarter_labels):
            ax.axvline(x=qt, color=marker_color, linestyle='--', alpha=marker_alpha)
            ax.text(qt, 0.95, ql, rotation=90, 
                    verticalalignment='top', fontsize=10, alpha=0.9, color=text_color)
        
        # Add horizontal reference lines
        ax.axhline(y=0.5, color=marker_color, linestyle='-', alpha=0.4, linewidth=1)
        ax.text(2, 0.52, 'Neutral', fontsize=10, alpha=0.9, color=text_color)
        
        # Add title and legend
        ax.set_title(f'{away_team} @ {home_team}\nSentiment Over Game Time', 
                    fontsize=14, fontweight='bold', pad=20)
        ax.legend(loc='upper right')
        
        # Apply styling
        apply_plot_styling(fig, ax, is_dark_mode)
        
        # Save the sentiment plot
        sentiment_filename = f"{mode_prefix}sentiment_analysis_{away_team.lower().replace(' ', '_')}_{home_team.lower().replace(' ', '_')}.png"
        sentiment_path = os.path.join(output_dir, sentiment_filename)
        plt.savefig(sentiment_path, dpi=300, bbox_inches='tight', facecolor=fig.get_facecolor())
        print(f"Sentiment plot saved as '{sentiment_path}'")
        
        # Close the plot to free memory
        plt.close()


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
    
    # Add quarter markers (will be styled later)
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
    
    # Add quarter markers to second plot (will be styled later)
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
    
    # Save data points as JSON (only once)
    save_data_points_json(score_times, total_scores, prediction_times, predicted_scores,
                         sentiment_prediction_times, sentiment_predicted_scores,
                         final_score, away_team, home_team, output_dir)
    
    # Generate both light and dark mode plots
    for is_dark_mode in [False, True]:
        mode_prefix = "DARK_" if is_dark_mode else "LIGHT_"
        
        # Get appropriate line widths
        line_widths = get_line_widths(is_dark_mode)
        
        # Update line widths for dark mode
        if is_dark_mode:
            # Make lines thicker and more visible for dark mode
            for line in ax1.get_lines():
                current_width = line.get_linewidth()
                line.set_linewidth(current_width * 1.2)  # 20% thicker
                
            for line in ax2.get_lines():
                current_width = line.get_linewidth()
                line.set_linewidth(current_width * 1.2)  # 20% thicker
        
        # Apply styling
        apply_plot_styling(fig, [ax1, ax2], is_dark_mode)
        
        # Save the plot
        output_filename = f"{mode_prefix}game_analysis_{away_team.lower().replace(' ', '_')}_{home_team.lower().replace(' ', '_')}.png"
        output_path = os.path.join(output_dir, output_filename)
        plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor=fig.get_facecolor())
        print(f"Plot saved as '{output_path}'")
        
        # Reset line widths for next iteration
        if is_dark_mode:
            for line in ax1.get_lines():
                current_width = line.get_linewidth()
                line.set_linewidth(current_width / 1.2)  # Reset to original
                
            for line in ax2.get_lines():
                current_width = line.get_linewidth()
                line.set_linewidth(current_width / 1.2)  # Reset to original
    
    # Generate separate sentiment analysis plot (both modes)
    plot_sentiment_analysis(times, avgs, away_team, home_team, output_dir)
    
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