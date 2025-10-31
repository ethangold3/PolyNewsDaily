from database import get_db_connection

def describe_articles_table():
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'articles';
        """)
        columns = cur.fetchall()
        if not columns:
            print("Table 'articles' does not exist or has no columns.")
        else:
            print("Columns in 'articles' table:")
            for col in columns:
                print(f"- {col[0]} ({col[1]})")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    describe_articles_table()
