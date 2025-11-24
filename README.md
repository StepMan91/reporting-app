# Mobile Reporting PWA

A Progressive Web App for mobile incident reporting with photo/video capture, ratings, and severity tracking.

## Features

- 📱 **PWA**: Install on iOS and Android without app stores
- 🔐 **JWT Authentication**: Secure login and registration
- 📸 **Media Capture**: Take photos or record 15-second videos
- ⭐ **Behavior Rating**: 1-5 star rating system
- 📊 **Severity Index**: 0-100 severity slider
- 📍 **Geolocation**: Automatic location tracking
- 📝 **Text Reports**: 150-word descriptions
- 🗄️ **Report History**: View and manage your reports
- 💬 **Contact Admin**: Built-in contact form
- 🌙 **Dark Mode**: Premium dark theme design
- 📴 **Offline Support**: View cached reports offline

## Tech Stack

### Backend
- FastAPI (Python)
- SQLite database
- JWT authentication
- File upload handling

### Frontend
- React 18
- Vite
- React Router
- Axios
- PWA (Service Worker)

### Deployment
- Docker & Docker Compose
- Nginx reverse proxy
- Raspberry Pi compatible

## Local Development

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Run server
uvicorn app.main:app --reload
```

Backend runs on http://localhost:8000

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend runs on http://localhost:5173

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed Raspberry Pi deployment instructions.

Quick start:
```bash
docker-compose up -d
```

## Project Structure

```
fusion-cassini/
├── backend/
│   ├── app/
│   │   ├── routers/       # API endpoints
│   │   ├── models.py      # Database models
│   │   ├── schemas.py     # Pydantic schemas
│   │   ├── auth.py        # JWT authentication
│   │   └── main.py        # FastAPI app
│   ├── uploads/           # Media storage
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── api/           # API client
│   │   └── App.jsx        # Main app
│   ├── public/            # Static assets
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── DEPLOYMENT.md
```

## Key Features Detail

### Report Creation
1. Capture photo or 15s video using device camera
2. Write description (max 150 words)
3. Rate behavior (1-5 stars)
4. Set severity index (0-100)
5. Automatic geolocation and device info capture

### Security
- Bcrypt password hashing
- HTTP-only cookies for JWT tokens
- Protected API routes
- File size validation
- Input sanitization

### Offline Capability
- Service worker caches UI assets
- View previously loaded reports offline
- Automatic sync when reconnected

## Browser Support

- ✅ Chrome/Edge (Android & Desktop)
- ✅ Safari (iOS & macOS)
- ✅ Firefox
- ⚠️ iOS Camera requires HTTPS (except localhost)

## License

MIT

## Support

For issues or questions, contact admin@example.com
