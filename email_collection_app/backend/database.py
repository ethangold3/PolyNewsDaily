# database.py
import os
from urllib.parse import urlparse
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def get_db_connection():
    """Get database connection for either local or Heroku environment"""
    DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://localhost/email_subscribers')
    
    # Print the URL (with password hidden) for debugging
    parsed_url = urlparse(DATABASE_URL)
    safe_url = f"{parsed_url.scheme}://{parsed_url.username}@{parsed_url.hostname}:{parsed_url.port}{parsed_url.path}"
    print(f"Connecting to: {safe_url}")
    
    # Heroku specific: Fix connection string if necessary
    if DATABASE_URL.startswith('postgres://'):
        DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)
    
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except psycopg2.Error as e:
        print(f"Unable to connect to the database: {e}")
        raise

def test_connection():
    """Test database connection and print detailed connection info"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Get PostgreSQL version
        cur.execute('SELECT version();')
        version = cur.fetchone()[0]
        
        # Get current database name and connection details
        cur.execute("""
            SELECT 
                current_database(),
                current_user,
                inet_server_addr(),
                inet_server_port();
        """)
        db, user, host, port = cur.fetchone()
        
        print("\nConnection Details:")
        print("------------------")
        print(f"Database Version: {version}")
        print(f"Current Database: {db}")
        print(f"Connected User: {user}")
        print(f"Server Host: {host}")
        print(f"Server Port: {port}")
        
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Connection test failed: {e}")
        return False

def setup_database():
    """Setup database tables"""
    conn = get_db_connection()
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor()
    
    try:
        # Create the subscribers table if it doesn't exist
        cur.execute('''
        CREATE TABLE IF NOT EXISTS subscribers (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(120) UNIQUE NOT NULL,
            feedback TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        print("\nDatabase setup complete - subscribers table created/verified.")
        
        # Check if table exists and show count
        cur.execute('SELECT COUNT(*) FROM subscribers;')
        count = cur.fetchone()[0]
        print(f"Current number of subscribers in database: {count}")
        
    except Exception as e:
        print(f"An error occurred during database setup: {e}")
        raise
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    print("\nTesting database connection...")
    if test_connection():
        print("\nInitializing database setup...")
        setup_database()