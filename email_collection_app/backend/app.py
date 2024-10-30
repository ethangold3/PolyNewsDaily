from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='../frontend/build')
CORS(app)
@app.route('/api/submit', methods=['POST'])
def submit():
    data = request.json
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute(
            """
            INSERT INTO subscribers (name, email, feedback)
            VALUES (%s, %s, %s)
            """,
            (data['name'], data['email'], data['feedback'])
        )
        conn.commit()
        return jsonify({"message": "Thank you for subscribing!"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"message": "An error occurred."}), 500
    finally:
        cur.close()
        conn.close()

@app.route('/api/subscribers', methods=['GET'])
def get_subscribers():
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("SELECT name, email, feedback FROM subscribers")
        subscribers = cur.fetchall()
        return jsonify([
            {
                "name": sub[0],
                "email": sub[1],
                "feedback": sub[2]
            } for sub in subscribers
        ]), 200
    except Exception as e:
        return jsonify({"message": "An error occurred."}), 500
    finally:
        cur.close()
        conn.close()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    setup_database()
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))