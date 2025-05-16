from database import get_db_connection
import sys

def list_subscribers():
    """List all subscribers in the database"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        print("\n=== Subscriber Count ===")
        cur.execute("SELECT COUNT(*) FROM subscribers")
        count = cur.fetchone()[0]
        print(f"Total subscribers: {count}")
        
        print("\n=== All Subscriber Emails ===")
        cur.execute("SELECT id, email FROM subscribers ORDER BY id")
        subscribers = cur.fetchall()
        
        for sub in subscribers:
            print(f"ID: {sub[0]}, Email: {sub[1]}")
        
        cur.close()
        conn.close()
        print("\nDatabase connection closed")
        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    print("Connecting to database to list subscribers...")
    list_subscribers() 