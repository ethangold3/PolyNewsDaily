import csv
import os
from database import get_db_connection  # Assuming this is your DB connector

def export_subscribers_to_csv(filename='subscribers_backup.csv'):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT * FROM subscribers")
        rows = cur.fetchall()
        columns = [desc[0] for desc in cur.description]  # Get column names
        
        with open(filename, 'w', newline='') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(columns)  # Write header
            writer.writerows(rows)    # Write data
        print(f"Exported {len(rows)} subscribers to {filename}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    export_subscribers_to_csv()
