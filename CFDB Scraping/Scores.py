import time
import os
import cfbd
from cfbd.models.betting_game import BettingGame
from cfbd.models.season_type import SeasonType
from cfbd.models.advanced_box_score import AdvancedBoxScore
from cfbd.rest import ApiException
from pprint import pprint
import pandas as pd
from datetime import datetime
import math
from cfbd.models.division_classification import DivisionClassification
from cfbd.models.scoreboard_game import ScoreboardGame

### Get_baselines ####
def get_score():   
    # Defining the host is optional and defaults to https://api.collegefootballdata.com
    # See configuration.py for a list of all supported configuration parameters.
    configuration = cfbd.Configuration(
        host = "https://api.collegefootballdata.com"
    )

    # The client must configure the authentication and authorization parameters
    # in accordance with the API server security policy.
    # Examples for each auth method are provided below, use the example that
    # satisfies your auth use case.

    # Configure Bearer authorization: apiKey
    configuration = cfbd.Configuration(
        access_token = os.environ["BEARER_TOKEN"]
    )

    # Enter a context with an instance of the API client
    with cfbd.ApiClient(configuration) as api_client:
        # Create an instance of the API class
        api_instance = cfbd.GamesApi(api_client)
        classification = "fbs" # DivisionClassification | Optional division classification filter, defaults to fbs (optional)
        try:
            api_response = api_instance.get_scoreboard(classification=classification)
            print("The response of GamesApi->get_scoreboard:\n")
            #pprint(api_response)
        except Exception as e:
            print("Exception when calling GamesApi->get_scoreboard: %s\n" % e)
        return api_response
    
def run_score_for_duration(duration_hours=3.5, sleep_time = 15, big_filename="scores_3:30.csv"):
    start_time = time.time()
    all_dfs = []
    iterations = math.ceil((duration_hours * 60) / sleep_time)
    
    for _ in range(iterations):
        print(f"Iteration #{_}")
        api_response = get_score()
        df = pd.DataFrame([bet.to_dict() for bet in api_response])
        df['time_stamp'] = current_datetime = datetime.now()
        all_dfs.append(df)
        
        
        # Wait for 15 minutes unless time is up
        if (time.time() - start_time) >= duration_hours * 3600: 
            break
        time.sleep(sleep_time * 60)
    
    # Concatenate all DataFrames and save to a big CSV
    big_df = pd.concat(all_dfs, ignore_index=True)
    # big_filename = "betlines_full.csv"
    big_df.to_csv(big_filename, index=False)
    print(f"Saved all data to {big_filename}")

def main():
    run_score_for_duration(duration_hours=4, sleep_time=15, big_filename="scores_4_hours.csv")

if __name__ == "__main__":
    main()