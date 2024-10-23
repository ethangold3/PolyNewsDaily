import os
import requests
from dotenv import load_dotenv
from agent.pm_market_getter import get_markets_for_date_range
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

load_dotenv()

NEWS_API_KEY = os.getenv("NEWS_API_KEY")
NEWS_API_URL = "https://newsapi.org/v2/top-headlines"

def get_news_articles(pages=1):  # Changed to default to 1 page
    all_articles = []
    for page in range(1, pages + 1):
        params = {
            "country": "us",
            "apiKey": NEWS_API_KEY,
            "pageSize": 100,
            "page": page
        }
        try:
            response = requests.get(NEWS_API_URL, params=params)
            response.raise_for_status()
            data = response.json()
            articles = data.get("articles", [])
            all_articles.extend(articles)
            print(f"Successfully fetched {len(articles)} articles from page {page}")
        except requests.exceptions.RequestException as e:
            print(f"Error fetching news for page {page}: {e}")
            break  # Stop trying to fetch more pages if we hit an error
    
    print(f"Total articles fetched: {len(all_articles)}")
    return all_articles

def create_embeddings(texts, model):
    return model.encode(texts)

def map_markets_to_articles(markets, articles):
    if not markets or not articles:
        print("Error: No markets or articles to process")
        return {}

    try:
        model = SentenceTransformer('all-MiniLM-L6-v2')
    except Exception as e:
        print(f"Error loading SentenceTransformer model: {e}")
        return {}

    market_texts = [f"{m['title']} {m['description']}" for m in markets]
    article_texts = [f"{a['title']} {a['description']}" for a in articles]
    
    market_embeddings = create_embeddings(market_texts, model)
    article_embeddings = create_embeddings(article_texts, model)
    
    similarities = cosine_similarity(market_embeddings, article_embeddings)
    
    market_article_map = {}
    for i, market in enumerate(markets):
        related_articles_indices = np.argsort(similarities[i])[::-1][:5]  # Top 5 related articles
        related_articles = [articles[idx] for idx in related_articles_indices]
        market_article_map[market['title']] = related_articles
    
    return market_article_map

def main():
    if not NEWS_API_KEY:
        print("Error: NEWS_API_KEY not found in .env file")
        return

    markets = get_markets_for_date_range(days_in_past=100, limit=20)
    print(f"Number of markets retrieved: {len(markets)}")
    sorted_markets_by_interest = sorted(markets, key=lambda x: x.get('interest_score', 0), reverse=True)
    top_markets = sorted_markets_by_interest[:30]
    
    articles = get_news_articles()  # Now only fetches 1 page by default
    
    if not articles:
        print("Error: No articles retrieved. Exiting.")
        return

    market_article_map = map_markets_to_articles(top_markets, articles)
    
    
    for market_title, related_articles in market_article_map.items():
        print(f"Market: {market_title}")
        for article in related_articles:
            print(f"  - {article['title']}")
        print()

if __name__ == "__main__":
    main()