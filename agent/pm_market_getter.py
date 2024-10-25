import requests
import json
from urllib.parse import urlencode
import ast
import datetime
from typing import List, Dict, Any

BASE_URL = "https://gamma-api.polymarket.com/events"


def safe_get(data, *keys, default="N/A"):
    """Safely get a value from nested dictionaries."""
    for key in keys:
        if isinstance(data, dict) and key in data:
            try:
                # print('returning int')
                return float(data[key])
            except:
                # If int conversion fails, try float
                try:
                    # print('returning float')
                    return int(data[key])
                except:
                    # If both conversions fail, return the original string
                    # print('returning string')
                    return data[key]

        else:
            return default

def safe_float(value, default=0):
    """Safely convert a value to float."""
    try:
        return float(value)
    except (ValueError, TypeError):
        return default

def get_markets(params=None):
    try:
        market_info = []
        # Method 1: Adding parameters to the URL
        if params:
            query_string = urlencode(params)
            url = f"{BASE_URL}?{query_string}"
        else:
            url = BASE_URL

        # Method 2: Passing parameters to requests.get()
        # Uncomment the next line and comment out the 'response = requests.get(url)'
        # line if you prefer this method
        # response = requests.get(BASE_URL, params=params)
        
        response = requests.get(url)
        
        response.raise_for_status()
        events = response.json()
        for event in events:
            high_level_info = {
            "title": safe_get(event, "title"),
            "ticker": safe_get(event, "ticker"),
            "description": safe_get(event, "description"),
            "end_date": safe_get(event, "endDate"),
            "volume": safe_float(safe_get(event, "volume", default=0)),
            "featured": safe_get(event, "featured"),
            "volume24hr" : safe_float(safe_get(event, "volume24hr", default=0)),
            "commentCount" : safe_float(safe_get(event, "commentCount", 0))
        }
            tags = [{"id": safe_get(tag, "id"), "label": safe_get(tag, "label")} for tag in  safe_get(event, "tags", default=[])]
            markets = safe_get(event, "markets", default=[])
        
            options = []
            for market in markets:
                outcome_prices = ast.literal_eval(safe_get(market, "outcomePrices", default="[0]"))
                outcome_options = ast.literal_eval(safe_get(market, "outcomes", default="[0]"))
                title = safe_get(market, "groupItemTitle", default="")

                if title:
                    name = str(title) + " (" + outcome_options[0] + " is outcome)"
                else:
                    name = outcome_options[0]
                option = {
                    "name": name,
                    "probability": safe_float(outcome_prices[0]) * 100,  # Convert to percentage
                    "last_trade_price": safe_float(safe_get(market, "lastTradePrice", 0)),
                    "oneDayPriceChange": safe_get(market, "oneDayPriceChange", default=0)
                }
                options.append(option)

        
    # Sort options by probability in descending order
            options.sort(key=lambda x: (x["probability"] != "N/A", x["probability"]), reverse=True)
            if options:
                avg_price_change = max(abs(option.get('oneDayPriceChange', 0)) for option in options)/len(options)
            else:
                avg_price_change = 0
            if high_level_info["volume"] >0:
                    
                base_score = (avg_price_change * high_level_info["volume24hr"] +
                            (high_level_info["commentCount"]*100 * (high_level_info["volume24hr"] / high_level_info["volume"])))
            else:
                base_score = 0
            # Apply multiplier if feature
            interest_score = base_score * 2 if high_level_info["featured"] else base_score
            if any(tag["id"] == 198 for tag in tags):
                interest_score*=100
            if options:
                probabilities = [option["probability"] for option in options]
                has_100 = any(abs(p - 100) < 0.001 for p in probabilities)
    
                # Check if all probabilities are 0
                all_zero = all(abs(p) < 0.001 for p in probabilities)
                if  (has_100 or all_zero):
                    interest_score = 0
            output = {
            "interest_score" : interest_score,
            "title": high_level_info["title"],
            "ticker": high_level_info["ticker"],
            "description": high_level_info["description"],
            "end_date": high_level_info["end_date"],
            "volume": high_level_info["volume"],
            "featured": high_level_info["featured"],
            "volume24hr" : high_level_info["volume24hr"],
            "commentCount" : high_level_info["commentCount"],
            "options": options,
             "tags": tags
        }

            market_info.append(output)


        return market_info
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None


def get_markets_for_date_range(days_in_past: int, limit: int = 100, offset: int = 0) -> List[Dict[Any, Any]]:
    """
    Retrieve markets for a specified number of days in the past, making multiple API calls if necessary.

    :param days_in_past: Number of days in the past to retrieve markets for
    :param limit: Number of markets to retrieve per API call
    :param offset: Initial offset for the API call
    :return: List of all markets retrieved
    """
    all_markets = []
    end_date = datetime.datetime.now()
    start_date = end_date - datetime.timedelta(days=days_in_past)

    current_date = end_date
    while current_date > start_date:
        params = {
            'limit': limit,
            'offset': offset,
            'active': 'true',
            'start_date_max': current_date.strftime('%Y-%m-%dT%H:%M:%SZ'),
            'start_date_min': (current_date - datetime.timedelta(days=1)).strftime('%Y-%m-%dT%H:%M:%SZ')
        }

        markets = get_markets(params)
        if markets is not None:
            all_markets.extend(markets)
        current_date -= datetime.timedelta(days=1)

    return all_markets

def main():
    # Example parameters
    # params = {
    #     'limit' : 100,
    #     'offset': 10,
    #     'active': 'true',
    #     'start_date_min' : '2024-08-21T19:00:00Z'
        
    # }

    markets = get_markets_for_date_range(days_in_past=1, limit=1)
    sorted_markets_by_interest = sorted(markets, key=lambda x: x.get('interest_score', 0), reverse=True)
    if sorted_markets_by_interest:
        json_string = json.dumps(sorted_markets_by_interest[:20], indent=2)
        with open("data.json", "w") as file:
            file.write(json_string)
            print("number of markets received: ", len(sorted_markets_by_interest))
        with open("data.json", "r") as file:
            file_contents = file.read()
            print(file_contents)
    else:
        print("Failed to retrieve markets.")

if __name__ == "__main__":
    main()
