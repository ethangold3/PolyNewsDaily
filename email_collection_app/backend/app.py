from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from email_validator import validate_email, EmailNotValidError
import re
import os

app = Flask(__name__, static_folder='../frontend/build')
CORS(app)


def is_valid_email(email):
    try:
        # Validate email format
        validation = validate_email(email, check_deliverability=False)
        return True
    except EmailNotValidError:
        return False

def sanitize_input(email):
    # Remove any whitespace and convert to lowercase
    email = email.strip().lower()
    
    # Basic pattern matching for email format
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, email):
        return None
        
    return email

@app.route('/')
def index():
    return send_from_directory('../frontend/build', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(os.path.join('../frontend/build', path)):
        return send_from_directory('../frontend/build', path)
    return send_from_directory('../frontend/build', 'index.html')


@app.route('/api/submit', methods=['POST'])
def submit():
    data = request.json
    
    # Input validation
    if not all(key in data for key in ['name', 'email', 'feedback']):
        return jsonify({"message": "Missing required fields"}), 400
    
    # Sanitize and validate email
    sanitized_email = sanitize_input(data['email'])
    if not sanitized_email or not is_valid_email(sanitized_email):
        return jsonify({"message": "Invalid email address"}), 400
    
    # Sanitize other inputs
    name = data['name'].strip()[:100]  # Limit name length
    feedback = data['feedback'].strip()[:500]  # Limit feedback length
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute(
            """
            INSERT INTO subscribers (name, email, feedback)
            VALUES (%s, %s, %s)
            """,
            (name, sanitized_email, feedback)
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

if __name__ == '__main__':
    setup_database()
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))