from typing import List, Dict
from datetime import datetime
from pydantic import BaseModel
import json
from pathlib import Path
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
from string import Template
import time
import re
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from email_collection_app.backend.database import get_db_connection
class ArticleOutput(BaseModel):
    id: int
    headline: str
    subheader: str
    blurb: str
    score: float
    ticker: str

class NewsletterSender:
    def __init__(self, template_path: str = "newsletter_template.html"):
        # Get the directory where newsletter_sender.py is located
        current_dir = Path(__file__).parent
        self.template_path = current_dir / template_path
        self.logo_path = current_dir / "PNDlogo.jpeg"
        self.load_template()
        self.load_logo()
        self.db_conn = None

    def save_newsletter_to_db(self, articles: List[ArticleOutput], 
                       groups: Dict[str, List[int]] = None):
        """Save the newsletter content to the database"""
        try:

            conn = get_db_connection()
            cur = conn.cursor()
            
            # First, delete any existing newsletters
            cur.execute("DELETE FROM group_articles")
            # cur.execute("DELETE FROM article_links")
            cur.execute("DELETE FROM articles")
            cur.execute("DELETE FROM groups")
            
            for article in articles:
                cur.execute("""
                    INSERT INTO articles (id, headline, subheader, blurb, score, ticker)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (article.id, article.headline, article.subheader, 
                     article.blurb, article.score, article.ticker))
                

            for group_name, article_ids in groups.items():
                cur.execute("INSERT INTO groups (name) VALUES (%s)", (group_name,))
                
                for article_id in article_ids:
                    cur.execute("""
                        INSERT INTO group_articles (group_name, article_id)
                        VALUES (%s, %s)
                    """, (group_name, article_id))

            cur.execute("SELECT COUNT(*) FROM articles")
            final_article_count = cur.fetchone()[0]
            cur.execute("SELECT COUNT(*) FROM groups")
            group_count = cur.fetchone()[0]
            cur.execute("SELECT COUNT(*) FROM group_articles")
            group_articles_count = cur.fetchone()[0]
            
            print(f"""
    Database summary:
    - Articles: {final_article_count}
    - Groups: {group_count}
    - Group-Article associations: {group_articles_count}
            """)
            
            conn.commit()
            
            cur.close()
            conn.close()
            print("Newsletter saved to database successfully")
        except Exception as e:
            print(f"Error saving newsletter to database: {str(e)}")
    def get_subscriber_emails(self) -> List[str]:
        """Get list of all subscriber emails from database"""
        try:
            conn = get_db_connection()
            cur = conn.cursor()
            cur.execute('SELECT email FROM subscribers')
            emails = [row[0] for row in cur.fetchall()]
            print(f"Found {len(emails)} subscribers")
            cur.close()
            conn.close()
            return emails
        except Exception as e:
            print(f"Error getting subscriber emails: {str(e)}")
            return []

    def get_latest_newsletter(self) -> tuple[List[Article], Dict[str, List[int]]]:
        """Retrieve the latest newsletter from the database"""
        try:
            conn = get_db_connection()
            cur = conn.cursor()
            articles = []
            cur.execute("SELECT id, headline, subheader, blurb, score, ticker FROM articles")
            article_rows = cur.fetchall()
            
            for row in article_rows:
                # Get links for this article
                
                article = Article(
                    id=row[0],
                    headline=row[1],
                    subheader=row[2],
                    blurb=row[3],
                    score=row[4],
                    ticker=row[5]
                )
                articles.append(article)
            
            # Retrieve groups and their article IDs
            groups = {}
            cur.execute("SELECT name FROM groups")
            group_rows = cur.fetchall()
            
            for group_row in group_rows:
                group_name = group_row[0]
                cur.execute("""
                    SELECT article_id FROM group_articles 
                    WHERE group_name = ?
                """, (group_name,))
                article_ids = [row[0] for row in cur.fetchall()]
                groups[group_name] = article_ids
            
            return articles, groups

        except Exception as e:
            print(f"Error retrieving newsletter from database: {str(e)}")
            return None

    
    def load_template(self):
        """Load the HTML template"""
        if not self.template_path.exists():
            raise FileNotFoundError("Newsletter template not found. Please create newsletter_template.html")
        
        with open(self.template_path, 'r') as f:
            self.template = Template(f.read())
            
    def load_logo(self):
        """Load the JPEG logo"""
        if not self.logo_path.exists():
            raise FileNotFoundError("Logo file not found at PNDlogo.jpeg")
            
        with open(self.logo_path, 'rb') as f:
            self.logo_data = f.read()

    def _highlight_numbers(self, text: str) -> str:
        """Highlight only numbers that are followed by a percentage sign with a brighter blue"""
        pattern = r'(\d+(?:\.\d+)?\s*%)'
        return re.sub(pattern, r'<span style="color: #60A5FA;">\1</span>', text)

    def format_articles(self, articles: List[Article], groups: Dict[str, List[int]] = None) -> str:
        """Format articles into HTML with optional grouping"""
        # Start with logo section
        articles_html = f"""
        <tr>
            <td style="padding: 30px 30px 20px 30px; background-color: #FFFFFF; text-align: center;">
                <div style="max-width: 600px; margin: 0 auto;">
                    <img src="cid:logo" alt="PND Logo" style="width: 100%; height: auto; display: block; margin: 0 auto;">
                </div>
            </td>
        </tr>
        <tr>
            <td style="padding: 0 30px 30px 30px; background-color: #FFFFFF;">
                <div style="border-top: 1px solid #2E87EC; margin: 0 auto;"></div>
            </td>
        </tr>

        <tr>
            <td style="padding: 20px 30px 10px 30px; background-color: #FFFFFF;">
                <div text-align: left;">
                    <p style="margin: 0; color: #000000; font-size: 12; 
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; 
                            line-height: 1.5;">
                        Let's hear today's breaking news powered by Polymarket. Click any headline to link to the source market. Market odds are accurate as of the morning of {datetime.now().strftime("%B %d, %Y")}.
                    </p>
                </div>
            </td>
        </tr>
    """
        
        # Rest of the format_articles method remains the same
        used_article_ids = set()
        article_lookup = {article.id: article for article in articles}
        
        if groups:
            for group_title, article_ids in groups.items():
                group_articles = [article_lookup[aid] for aid in article_ids 
                                if aid in article_lookup]
                high_scoring_articles = [article for article in group_articles if article.score > 5]

                if high_scoring_articles:
                    articles_html += f"""
                <tr>
                    <td style="padding: 20px 30px 10px 30px; background-color: #FFFFFF;">
                        <div style="padding: 15px; border-radius: 8px; border: 1px solid #2E87EC; background-color: #EEEEEE; text-align: center;">
                            <h2 style="margin: 0; color: #111111; font-size: 24px; 
                                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; 
                                    font-weight: 600; letter-spacing: 0.5px;">
                                {self._highlight_numbers(group_title)}
                            </h2>
                        </div>
                    </td>
                </tr>
            """

                    for article in sorted(high_scoring_articles, key=lambda x: x.score, reverse=True):
                        articles_html += self._format_single_article(article)

                    used_article_ids.update(article.id for article in high_scoring_articles)
        ungrouped_articles = [article for article in articles 
                            if article.id not in used_article_ids]
        
        if ungrouped_articles:
            if groups and groups.keys():
                articles_html += """
                    <tr>
                        <td style="padding: 20px 30px 10px 30px; background-color: #FFFFFF;">
                            <div style="padding: 15px; border-radius: 8px; border: 1px solid #2E87EC; background-color: #EEEEEE; text-align: center;">
                                <h2 style="margin: 0; color: #000000; font-size: 24px; 
                                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; 
                                        font-weight: 600; letter-spacing: 0.5px;">
                                    Other Stories
                                </h2>
                            </div>
                        </td>
                    </tr>
                """
            
            for article in sorted(ungrouped_articles, key=lambda x: x.score, reverse=True):
                articles_html += self._format_single_article(article)

        return articles_html

    def _format_single_article(self, article: Article) -> str:
        """Format a single article into HTML with dark mode styling"""
        polymarket_link = f"https://polymarket.com/event/{article.ticker}"
        
        return f"""
            <tr>
                <td style="padding: 15px 30px; background-color: #FFFFFF;">
                    <div style="background-color: #EEEEEE; border-radius: 8px; overflow: hidden; border: 1px solid #2E87EC;">
                        <div style="padding: 20px;">
                            <a href="{polymarket_link}" style="text-decoration: none;">
                                <h2 style="margin: 0; color: #000000; font-size: 20px; 
                                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; 
                                        font-weight: 500; line-height: 1.4;">
                                    {self._highlight_numbers(article.headline)}
                                </h2>
                            </a>
                            <h3 style="margin: 10px 0; color: #1A1A1A; font-size: 16px; 
                                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; 
                                    font-weight: 400;">
                                {self._highlight_numbers(article.subheader)}
                            </h3>
                            <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.6;
                                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;">
                                {self._highlight_numbers(article.blurb)}
                            </p>
                        </div>
                    </div>
                </td>
            </tr>
        """

    def send_newsletter(self, smtp_config: dict, emails: List[str], articles: List[Article], 
                       groups: Dict[str, List[int]] = None):
        """Send newsletter to all recipients"""
        try:
            server = smtplib.SMTP(smtp_config['host'], smtp_config['port'])
            server.starttls()
            server.login(smtp_config['auth']['user'], smtp_config['auth']['pass'])

            formatted_date = datetime.now().strftime("%B %d, %Y")
            articles_html = self.format_articles(articles, groups)
            html_content = self.template.substitute(
                date=formatted_date,
                articles=articles_html
            )

            subject = "📈 Today's Prediction Market Powered News"

            results = {'successful': [], 'failed': []}
            batch_size = 50

            for i in range(0, len(emails), batch_size):
                batch = emails[i:i + batch_size]
                print(f"Sending batch {(i//batch_size) + 1}/{(len(emails)-1)//batch_size + 1}")

                for email in batch:
                    try:
                        msg = MIMEMultipart('related')
                        msg_alternative = MIMEMultipart('alternative')
                        msg.attach(msg_alternative)
                        
                        msg['Subject'] = "📈 Today's Prediction Market Powered News"
                        msg['From'] = smtp_config['from']
                        msg['To'] = email
                        
                        # Attach HTML content
                        msg_alternative.attach(MIMEText(html_content, 'html'))
                        
                        # Attach logo image
                        img = MIMEImage(self.logo_data)
                        img.add_header('Content-ID', '<logo>')
                        img.add_header('Content-Disposition', 'inline; filename="PNDlogo.jpeg"')  # Add filename
                        img.add_header('Content-Type', 'image/jpeg; name="PNDlogo.jpeg"')  # Add content type w
                        msg.attach(img)
                        server.send_message(msg)
                        results['successful'].append(email)
                        print(f"Successfully sent to: {email}")
                        
                    except Exception as e:
                        results['failed'].append({
                            'email': email,
                            'error': str(e)
                        })
                        print(f"Failed to send to {email}: {str(e)}")
                    
                    time.sleep(0.2)
                
                time.sleep(1)

            server.quit()
            return results
            
        except Exception as e:
            print(f"Error sending newsletter: {str(e)}")
            return None
        

    def send_latest_to_subscriber(self, smtp_config: dict, email: str):
        """Send the most recent newsletter to a new subscriber"""
        latest = self.get_latest_newsletter()
        if not latest:
            print(f"No recent newsletter found to send to {email}")
            return False
            
        try:
            self.send_newsletter(smtp_config, [email], latest[0], latest[1])
            
        except Exception as e:
            print(f"Error sending latest newsletter to {email}: {str(e)}")
            return False

def test_smtp_connection(smtp_config: dict) -> bool:
    """Test SMTP connection with provided configuration"""
    try:
        server = smtplib.SMTP(smtp_config['host'], smtp_config['port'])
        server.starttls()
        server.login(smtp_config['auth']['user'], smtp_config['auth']['pass'])
        server.quit()
        print("✅ SMTP connection successful!")
        return True
    except Exception as e:
        print(f"❌ SMTP connection failed: {str(e)}")
        return False

if __name__ != '__main__':
    NewsletterSender = NewsletterSender
    Article = Article
    test_smtp_connection = test_smtp_connection