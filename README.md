# 🍜 Ramen Art AI

**Ramen Art AI** is a powerful web application that combines AI-driven storytelling and character generation to help creators bring their narratives to life. Built with modern web technologies, it offers an intuitive interface for generating stories, creating original characters (OCs), and managing creative projects.

---

## ✨ Features

### 📖 Story Generation
- **AI-Powered Story Creation**: Generate complete stories with customizable parameters including genre, tone, length, and target audience
- **Story Management**: Save, view, and organize all your generated stories in one place
- **Rich Metadata**: Each story includes title, genre, synopsis, and detailed content
- **User-Specific Stories**: All stories are tied to your account for privacy and organization

### 🎨 OC Maker (Original Character Creator)
- **AI Image Generation**: Create stunning character artwork using advanced Z-Image-Turbo model
- **Flexible Input Methods**:
  - Type custom descriptions directly
  - Select from dropdown categories (Gender, Style, Age, Body Type, Hair, Eyes, Face, Skin, Clothing, Accessories)
  - Combine both methods for precise control
- **AI Prompt Refinement**: Enhance your character descriptions with AI-powered prompt optimization
- **Visual Tag Management**: See selected attributes as removable chips
- **Character Library**: Save characters to specific stories and manage your character collection
- **High-Quality Output**: Generate 1024x1024 images with customizable parameters

### 🔐 Authentication & User Management
- **Multiple Login Options**:
  - Email/Password authentication
  - Google OAuth integration
- **Secure Sessions**: JWT-based authentication with HTTP-only cookies
- **User Profiles**: Personalized dashboard and user data management

### 🎯 Smart Features
- **Inspire Me**: Get random character inspiration with pre-made prompts
- **Real-time Validation**: Instant feedback on form inputs and generation status
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Toast Notifications**: Clear feedback for all user actions

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **React Router** for navigation
- **Axios** for API communication
- **Modern CSS** with custom styling and animations

### Backend
- **FastAPI** - High-performance Python web framework
- **MongoDB** with Motor (async driver) for database
- **Google Gemini AI** for prompt refinement
- **Z-Image-Turbo** (HuggingFace) for image generation
- **JWT** for authentication
- **Google OAuth 2.0** for social login

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (local or Atlas)
- **Google Cloud** account (for OAuth)
- **Gemini API Key** (for AI features)

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd Ramen_Art
```

#### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your credentials

# Run the backend
py -m uvicorn app.main:app --reload
```

The backend will run on `http://localhost:8000`

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
# Create .env file with:
# VITE_BACKEND_URL=http://localhost:8000

# Run the frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## 📝 Environment Variables

### Backend (.env)
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=ramen_art_db

# JWT
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=60

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# Z-Image Configuration
Z_IMAGE_MODEL=Tongyi-MAI/Z-Image-Turbo
Z_IMAGE_DEFAULT_RESOLUTION=1024x1024 ( 1:1 )
Z_IMAGE_DEFAULT_STEPS=8
Z_IMAGE_DEFAULT_SHIFT=3
```

### Frontend (.env)
```env
VITE_BACKEND_URL=http://localhost:8000
```

---

## 📚 Usage Guide

### Creating a Story
1. Navigate to the Story Canvas
2. Fill in story parameters (genre, tone, length, audience)
3. Provide a prompt or use AI refinement
4. Click "Generate Story"
5. Save your story for future reference

### Creating a Character
1. Go to the OC Maker
2. Select a story to associate the character with
3. Enter a character name
4. Describe your character by:
   - Typing a custom description
   - Selecting attributes from dropdown menus
   - Or combining both methods
5. Click the "Refine your prompt" button for AI enhancement (optional)
6. Click "Generate character"
7. Save the character to your library

### Managing Your Content
- View all your stories in the Story List
- Access your character library
- Delete unwanted stories or characters
- Link characters to specific stories

---

## 🎨 Key Features Explained

### Dual Input System (OC Maker)
The character creator accepts input in two ways:
- **Manual Text**: Type your own descriptions freely
- **Dropdown Selection**: Choose from curated options across 12 categories
- **Combined Mode**: Mix both methods - your typed text and selected tags appear together

### AI Prompt Refinement
- Enhances your character/story descriptions using Google Gemini AI
- Adds vivid details and improves generation quality
- Works with both typed text and dropdown selections
- One-click refinement with visual feedback

### Smart UI/UX
- Disabled states prevent accidental actions during generation
- Real-time validation ensures data quality
- Toast notifications provide clear feedback
- Responsive design adapts to all screen sizes

---

## 🔒 Security Features

- JWT-based authentication with HTTP-only cookies
- Secure password hashing
- CORS protection
- User-specific data isolation
- Environment-based configuration

---

## 📖 API Documentation

For detailed API documentation, see [backend/API_DOC.md](backend/API_DOC.md)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Google Gemini** for AI-powered prompt refinement
- **Z-Image-Turbo** for high-quality image generation
- **FastAPI** for the excellent Python web framework
- **React** for the powerful frontend library

---

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Made with ❤️ by the Ramen Art Team**