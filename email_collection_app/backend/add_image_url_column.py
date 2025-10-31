from database import get_db_connection

def add_image_url_column():
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            ALTER TABLE articles 
            ADD COLUMN IF NOT EXISTS image_url TEXT;
        """)
        conn.commit()
        print("Added image_url column successfully!")
    except Exception as e:
        conn.rollback()
        print(f"Error: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    add_image_url_column()
