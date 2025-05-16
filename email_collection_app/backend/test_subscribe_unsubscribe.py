import requests
import json
import time
import random
import string

# Configuration
BASE_URL = "http://127.0.0.1:5001"  # Change this to your server URL
SUBSCRIBE_ENDPOINT = f"{BASE_URL}/api/submit"
UNSUBSCRIBE_ENDPOINT = f"{BASE_URL}/api/unsubscribe"
GET_SUBSCRIBERS_ENDPOINT = f"{BASE_URL}/api/subscribers"

# Generate a random test email to avoid conflicts
def generate_test_email():
    random_string = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"test_{random_string}@example.com"

# Test data
test_email = generate_test_email()
test_name = "Test User"
test_feedback = "This is a test subscription"

print(f"\n🔍 Starting subscribe/unsubscribe test with email: {test_email}")

# Step 1: Check current subscribers
print("\n📋 Checking current subscribers...")
try:
    response = requests.get(GET_SUBSCRIBERS_ENDPOINT)
    if response.status_code == 200:
        subscribers = response.json()
        print(f"Found {len(subscribers)} existing subscribers")
    else:
        print(f"Error getting subscribers: {response.status_code} - {response.text}")
except Exception as e:
    print(f"Error connecting to server: {str(e)}")
    exit(1)

# Step 2: Subscribe with test email
print(f"\n➕ Subscribing with test email: {test_email}")
subscribe_data = {
    "name": test_name,
    "email": test_email,
    "feedback": test_feedback
}

try:
    response = requests.post(
        SUBSCRIBE_ENDPOINT,
        headers={"Content-Type": "application/json"},
        data=json.dumps(subscribe_data)
    )
    
    print(f"Status code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code != 200:
        print("❌ Subscribe test failed!")
        exit(1)
    else:
        print("✅ Subscribe test passed!")
except Exception as e:
    print(f"❌ Error during subscribe test: {str(e)}")
    exit(1)

# Step 3: Verify subscription by checking subscribers again
print("\n🔍 Verifying subscription...")
try:
    response = requests.get(GET_SUBSCRIBERS_ENDPOINT)
    if response.status_code == 200:
        subscribers = response.json()
        found = False
        for sub in subscribers:
            if sub["email"] == test_email:
                found = True
                print(f"✅ Found test email in subscribers list: {sub}")
                break
        
        if not found:
            print("❌ Test email not found in subscribers list!")
            exit(1)
    else:
        print(f"Error getting subscribers: {response.status_code} - {response.text}")
except Exception as e:
    print(f"Error connecting to server: {str(e)}")
    exit(1)

# Step 4: Wait a moment before unsubscribing
print("\n⏳ Waiting 2 seconds before unsubscribing...")
time.sleep(2)

# Step 5: Unsubscribe the test email
print(f"\n➖ Unsubscribing test email: {test_email}")
unsubscribe_data = {
    "email": test_email
}

try:
    response = requests.post(
        UNSUBSCRIBE_ENDPOINT,
        headers={"Content-Type": "application/json"},
        data=json.dumps(unsubscribe_data)
    )
    
    print(f"Status code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code != 200:
        print("❌ Unsubscribe test failed!")
        exit(1)
    else:
        print("✅ Unsubscribe test passed!")
except Exception as e:
    print(f"❌ Error during unsubscribe test: {str(e)}")
    exit(1)

# Step 6: Verify unsubscription by checking subscribers again
print("\n🔍 Verifying unsubscription...")
try:
    response = requests.get(GET_SUBSCRIBERS_ENDPOINT)
    if response.status_code == 200:
        subscribers = response.json()
        for sub in subscribers:
            if sub["email"] == test_email:
                print(f"❌ Test email still found in subscribers list!")
                exit(1)
        
        print("✅ Test email successfully removed from subscribers list!")
    else:
        print(f"Error getting subscribers: {response.status_code} - {response.text}")
except Exception as e:
    print(f"Error connecting to server: {str(e)}")
    exit(1)

print("\n🎉 All tests passed! Subscribe and unsubscribe functionality is working correctly.") 