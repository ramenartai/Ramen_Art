# 🍜 Ramen Art AI

**Ramen Art AI** is a powerful web application that combines AI-driven storytelling and character generation to help creators bring their narratives to life. Built with modern web technologies, it offers an intuitive interface for generating stories, creating original characters (OCs), and managing creative projects with a full manga creation suite.

---

## ✨ Features

### 📖 Story Generation & Refinement
- **AI-Powered Story Creation**: Generate complete stories with customizable parameters including genre, tone, length, and target audience.
- **AI Story Refinement**: Refine your story prompts into detailed, structured narratives using Gemini AI.
- **Full Context Prompts**: Automatically builds comprehensive prompts including story metadata, world-building, arc info, and scene summaries.

### 🎨 OC Maker (Original Character Creator)
- **AI Image Generation**: Create stunning character artwork using advanced Z-Image groups and Gemini Image models.
- **Flexible Input Methods**:
  - Type custom descriptions directly.
  - Select from dropdown categories (Gender, Style, Age, Body Type, Hair, Eyes, Face, Skin, Clothing, Accessories).
- **AI Prompt Refinement**: Enhance your character descriptions with Gemini-powered prompt optimization.
- **Character Library**: Save characters to specific stories and use them as visual references for manga generation.

### 🖌️ Manga Creator (Interactive Canvas)
- **Interactive Canvas**: Drag-and-drop elements and customizable panel layouts.
- **Automated Panel Generation**: A streamlined 3-step workflow triggered by one click:
  1. **Suggest Action**: AI analyzes story context to suggest the next panel action.
  2. **Optimize Prompt**: Converts the action into a detailed image generation prompt.
  3. **Generate Image**: Uses Gemini 2.5 Flash Image to create the manga panel.
- **Character Consistency**: Automatically uses saved character images as visual references for generation.
- **Page Generation**: Generate full manga pages with consistent style and layout.
- **Real-time Updates**: Generated images are automatically applied to the selected panels on the canvas.

### 🎯 Smart Features
- **Background Removal**: Integrated Cloudinary AI for character background removal.
- **Responsive Design**: Beautiful, modern UI that works on all devices.
- **Toast Notifications**: Clear feedback for all user actions.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Modern CSS** with custom glassmorphism and animations
- **SVG-based Canvas** for precise manga panel layouting

### Backend
- **FastAPI** - Python web framework
- **MongoDB** with Motor for async database management
- **Google Gemini 1.5/2.5/3 Flash** - For text refinement, action suggestion, and image generation
- **Z-Image** - Local/Remote image generation engine
- **Cloudinary** - For image hosting and AI transformation (Background removal)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)
- **MongoDB**
- **Gemini API Key** (Google AI Studio)
- **Cloudinary Account**

### Installation

1. **Clone the Repository**
2. **Backend Setup**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env # Configure your keys
   uvicorn app.main:app --reload
   ```
3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 📝 Environment Variables

### Backend (.env)
```env
# Gemini AI
GEMINI_API_KEY=your-gemini-api-key
GEMINI_IMAGE_API_KEY=your-gemini-image-api-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret

# Z-Image
Z_IMAGE_MODEL=Tongyi-MAI/Z-Image-Turbo
Z_IMAGE_DEFAULT_RESOLUTION=1024x1024
```

---

## 📚 Usage Guide - Manga Creator

1. **Select Theme**: Start by selecting a Story, Arc, and Chapter.
2. **Refine Prompt**: Click "Refine with AI" to turn your chapter purpose into a rich scene description.
3. **Choose Characters**: Toggle characters from your library to include them in the scene.
4. **Generate**:
   - **Panel Mode**: Click a panel on the canvas, then "Generate Panel" to run the automated workflow.
   - **Page Mode**: Click "Generate Page" to generate a full-page illustration based on the refined story.

---

## 🙏 Acknowledgments

- **Google Gemini** for the state-of-the-art Generative AI models.
- **Cloudinary** for seamless image management.
- **Z-Image** for high-speed local character generation.

**Made with ❤️ by the Ramen Art Team**