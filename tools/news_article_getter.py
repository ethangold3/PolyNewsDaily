import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get the API key from environment variables
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
print(NEWS_API_KEY)
NEWS_API_URL = "https://newsapi.org/v2/top-headlines"

def test_news_api():
    if not NEWS_API_KEY:
        print("Error: NEWS_API_KEY not found in .env file")
        return

    params = {
        "country": "us",
        "apiKey": NEWS_API_KEY,
        "pageSize": 5  # We'll just request 5 articles for this test
    }

    try:
        response = requests.get(NEWS_API_URL, params=params)
        response.raise_for_status()  # This will raise an exception for HTTP errors
        
        data = response.json()
        articles = data.get("articles", [])
        print(articles)
        
        print(f"API request successful. Status code: {response.status_code}")
        print(f"Number of articles retrieved: {len(articles)}")
        
        # # Print the titles of the retrieved articles
        # for i, article in enumerate(articles, 1):
        #     print(f"{i}. {article['title']}")

    except requests.exceptions.RequestException as e:
        print(f"Error making request to News API: {e}")
    except ValueError as e:
        print(f"Error parsing JSON response: {e}")

if __name__ == "__main__":
    test_news_api()