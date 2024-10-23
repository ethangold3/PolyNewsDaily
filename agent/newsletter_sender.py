# newsletter_sender.py
from typing import List
from datetime import datetime
from pydantic import BaseModel
import json
from pathlib import Path
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from string import Template
import time

class Article(BaseModel):
    headline: str
    subheader: str
    blurb: str

class NewsletterSender:
    def __init__(self, template_path: str = "newsletter_template.html"):
        self.template_path = Path(template_path)
        self.load_template()
    
    def load_template(self):
        """Load the HTML template"""
        if not self.template_path.exists():
            raise FileNotFoundError("Newsletter template not found. Please create newsletter_template.html")
        
        with open(self.template_path, 'r') as f:
            self.template = Template(f.read())

    def format_articles(self, articles: List[Article]) -> str:
        """Format articles into HTML"""
        articles_html = ""
        for article in articles:
            article_html = f"""
                    <tr>
                        <td style="padding: 20px 30px;">
                            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 4px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <h2 style="margin: 0; color: #1a1a1a; font-size: 20px; font-weight: bold;">
                                            {article.headline}
                                        </h2>
                                        <h3 style="margin: 10px 0; color: #666666; font-size: 16px; font-weight: bold;">
                                            {article.subheader}
                                        </h3>
                                        <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.6;">
                                            {article.blurb}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
            """
            articles_html += article_html
        return articles_html

    def send_newsletter(self, smtp_config: dict, emails: List[str], articles: List[Article]):
        """Send newsletter to all recipients"""
        try:
            # Setup SMTP server
            server = smtplib.SMTP(smtp_config['host'], smtp_config['port'])
            server.starttls()
            server.login(smtp_config['auth']['user'], smtp_config['auth']['pass'])

            # Prepare email content
            formatted_date = datetime.now().strftime("%B %d, %Y")
            articles_html = self.format_articles(articles)
            html_content = self.template.substitute(
                date=formatted_date,
                articles=articles_html
            )

            results = {'successful': [], 'failed': []}
            batch_size = 50

            # Send in batches
            for i in range(0, len(emails), batch_size):
                batch = emails[i:i + batch_size]
                print(f"Sending batch {(i//batch_size) + 1}/{(len(emails)-1)//batch_size + 1}")

                for email in batch:
                    try:
                        # Create message
                        msg = MIMEMultipart('alternative')
                        msg['Subject'] = f"PolyNewsDaily Update - {formatted_date}"
                        msg['From'] = smtp_config['from']
                        msg['To'] = email
                        msg.attach(MIMEText(html_content, 'html'))

                        # Send email
                        server.send_message(msg)
                        results['successful'].append(email)
                        print(f"Successfully sent to: {email}")
                        
                    except Exception as e:
                        results['failed'].append({
                            'email': email,
                            'error': str(e)
                        })
                        print(f"Failed to send to {email}: {str(e)}")
                    
                    # Small delay between emails
                    time.sleep(0.2)
                
                # Delay between batches
                time.sleep(1)

            server.quit()
            
            # Print results
            print(f"\nNewsletter Sending Results:")
            print(f"Successfully sent: {len(results['successful'])}")
            print(f"Failed: {len(results['failed'])}")
            
            if results['failed']:
                print("\nFailed emails:")
                for failure in results['failed']:
                    print(f"- {failure['email']}: {failure['error']}")
            
            return results
            
        except Exception as e:
            print(f"Error sending newsletter: {str(e)}")
            return None

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