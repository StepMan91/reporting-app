import requests
import os
from PIL import Image, ImageDraw

# Configuration
BASE_URL = "http://localhost:8000"
EMAIL = "test_backend@example.com"
PASSWORD = "password123"

def create_dummy_image(filename="test_image.png"):
    img = Image.new('RGB', (500, 500), color = 'red')
    d = ImageDraw.Draw(img)
    d.text((10,10), "Hello World", fill=(255,255,0))
    img.save(filename)
    return filename

def verify_backend():
    session = requests.Session()
    
    print("1. Registering user...")
    try:
        requests.post(f"{BASE_URL}/auth/register", json={"email": EMAIL, "password": PASSWORD})
    except:
        pass # User might already exist

    print("2. Logging in...")
    response = session.post(f"{BASE_URL}/auth/login", data={"username": EMAIL, "password": PASSWORD})
    if response.status_code != 200:
        print(f"Login failed: {response.text}")
        return
    # Token is now in session cookies

    print("3. Creating dummy image...")
    image_path = create_dummy_image()

    print("4. Creating report...")
    with open(image_path, "rb") as f:
        files = {"media": ("test_image.png", f, "image/png")}
        data = {
            "description": "Test report from backend script",
            "behavior_rating": 5,
            "severity_index": 80,
            "latitude": 48.8566,
            "longitude": 2.3522
        }
        response = session.post(f"{BASE_URL}/reports/", files=files, data=data)
    
    if response.status_code != 201:
        print(f"Create report failed: {response.text}")
        return
    
    report = response.json()
    print(f"Report created: ID {report['id']}")
    print(f"Media Path: {report['media_path']}")
    print(f"Thumbnail Path: {report['thumbnail_path']}")

    if "\\" in report['media_path'] or (report['thumbnail_path'] and "\\" in report['thumbnail_path']):
        print("FAIL: Paths contain backslashes!")
    else:
        print("PASS: Paths use forward slashes.")

    if report['thumbnail_path']:
        print("PASS: Thumbnail path is present.")
    else:
        print("FAIL: Thumbnail path is missing.")

    print("5. Listing reports (all)...")
    response = session.get(f"{BASE_URL}/reports/")
    reports = response.json()
    if len(reports) > 0:
        print(f"PASS: Retrieved {len(reports)} reports.")
    else:
        print("FAIL: No reports retrieved.")

    print("6. Testing filters...")
    # Filter by rating min 5 (should find our report)
    response = session.get(f"{BASE_URL}/reports/?rating_min=5")
    reports = response.json()
    if len(reports) > 0:
        print(f"PASS: Filter rating_min=5 returned {len(reports)} reports.")
    else:
        print("FAIL: Filter rating_min=5 returned 0 reports.")

    # Filter by rating max 1 (should find nothing)
    response = session.get(f"{BASE_URL}/reports/?rating_max=1")
    reports = response.json()
    if len(reports) == 0:
        print("PASS: Filter rating_max=1 returned 0 reports.")
    else:
        print(f"FAIL: Filter rating_max=1 returned {len(reports)} reports.")

    # Cleanup
    if os.path.exists(image_path):
        os.remove(image_path)

if __name__ == "__main__":
    verify_backend()
