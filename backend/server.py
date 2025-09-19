from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage
import asyncio

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class UserPreferences(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    identity: str  # Student, Creative, Professional, Other
    current_mood: str  # Anxious, Unfocused, Sad, Stressed, Calm
    mood_frequency: str  # Just today, This week, For a while
    theme_colors: Dict[str, str] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserPreferencesCreate(BaseModel):
    identity: str
    current_mood: str
    mood_frequency: str

class CBTSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str = Field(default="anonymous")
    negative_thought: str
    questions_and_answers: List[Dict[str, str]]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CBTSessionCreate(BaseModel):
    negative_thought: str
    questions_and_answers: List[Dict[str, str]]

class ZenSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str = Field(default="anonymous")
    session_type: str  # breathing, meditation
    duration: int  # in minutes
    completed: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ZenSessionCreate(BaseModel):
    session_type: str
    duration: int
    completed: bool = True

class Article(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    category: str
    author: str = "Serenity Team"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class FavoriteArticle(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str = Field(default="anonymous")
    article_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class DynamicQuestionRequest(BaseModel):
    negative_thought: str
    user_context: Optional[str] = None

class UsageAnalytics(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str = Field(default="anonymous")
    feature: str  # 'zen', 'music', 'cbt', 'visual', 'articles'
    action: str  # 'view', 'complete', 'interact'
    duration: Optional[int] = None  # in seconds
    metadata: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UsageAnalyticsCreate(BaseModel):
    feature: str
    action: str
    duration: Optional[int] = None
    metadata: Optional[Dict[str, Any]] = None

# Basic endpoints
@api_router.get("/")
async def root():
    return {"message": "Serenity Space API", "status": "running"}

# User Preferences
@api_router.post("/preferences", response_model=UserPreferences)
async def create_user_preferences(input: UserPreferencesCreate):
    # Generate theme colors based on mood
    theme_colors = generate_theme_colors(input.current_mood, input.identity)
    
    prefs_dict = input.dict()
    prefs_dict['theme_colors'] = theme_colors
    prefs_obj = UserPreferences(**prefs_dict)
    
    await db.user_preferences.insert_one(prefs_obj.dict())
    return prefs_obj

@api_router.get("/preferences", response_model=List[UserPreferences])
async def get_user_preferences():
    preferences = await db.user_preferences.find().to_list(1000)
    return [UserPreferences(**pref) for pref in preferences]

# CBT Sessions
@api_router.post("/cbt-sessions", response_model=CBTSession)
async def create_cbt_session(input: CBTSessionCreate):
    session_dict = input.dict()
    session_obj = CBTSession(**session_dict)
    await db.cbt_sessions.insert_one(session_obj.dict())
    return session_obj

@api_router.get("/cbt-sessions", response_model=List[CBTSession])
async def get_cbt_sessions(user_id: str = "anonymous"):
    sessions = await db.cbt_sessions.find({"user_id": user_id}).to_list(1000)
    return [CBTSession(**session) for session in sessions]

# CBT Questions endpoint
@api_router.get("/cbt-questions")
async def get_cbt_questions():
    return {
        "questions": [
            {
                "id": 1,
                "question": "Is this thought based on facts or feelings?",
                "type": "choice",
                "options": ["Facts", "Feelings", "Both", "Not sure"]
            },
            {
                "id": 2,
                "question": "What evidence do I have that supports this thought?",
                "type": "text"
            },
            {
                "id": 3,
                "question": "What evidence do I have against this thought?",
                "type": "text"
            },
            {
                "id": 4,
                "question": "What would I tell a friend who had this thought?",
                "type": "text"
            },
            {
                "id": 5,
                "question": "How likely is it that this worst-case scenario will actually happen? (0-100%)",
                "type": "number",
                "min": 0,
                "max": 100
            },
            {
                "id": 6,
                "question": "What's a more balanced way to think about this situation?",
                "type": "text"
            }
        ]
    }

# AI-Powered Dynamic CBT Questions
@api_router.post("/cbt-questions/dynamic")
async def generate_dynamic_cbt_questions(request: DynamicQuestionRequest):
    """Generate personalized CBT questions using AI based on the user's negative thought"""
    try:
        # Initialize LLM chat with Gemini
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not api_key:
            raise HTTPException(status_code=500, detail="AI service not configured")
        
        chat = LlmChat(
            api_key=api_key,
            session_id=f"cbt-{uuid.uuid4()}",
            system_message="""You are a cognitive behavioral therapy (CBT) expert. Generate 6 personalized, therapeutic questions to help the user reframe their negative thought. 

The questions should:
1. Follow CBT principles and techniques
2. Be specific to the user's negative thought
3. Help identify cognitive distortions
4. Guide toward balanced thinking
5. Be compassionate and non-judgmental
6. Include a mix of question types (text, choice, number scale)

Return ONLY a JSON object with this exact structure:
{
  "questions": [
    {
      "id": 1,
      "question": "Question text here",
      "type": "text|choice|number",
      "options": ["option1", "option2"] (only for choice type),
      "min": 0, "max": 100 (only for number type)
    }
  ]
}"""
        ).with_model("gemini", "gemini-2.0-flash")
        
        # Create user message
        context_info = f" (Context: {request.user_context})" if request.user_context else ""
        user_message = UserMessage(
            text=f"Generate 6 personalized CBT questions for this negative thought: '{request.negative_thought}'{context_info}"
        )
        
        # Get AI response
        response = await chat.send_message(user_message)
        
        # Parse the response - assume it's JSON
        import json
        try:
            questions_data = json.loads(response)
            return questions_data
        except json.JSONDecodeError:
            # Fallback to default questions if parsing fails
            logger.warning(f"Failed to parse AI response, using fallback questions")
            return await get_cbt_questions()
            
    except Exception as e:
        logger.error(f"Error generating dynamic questions: {str(e)}")
        # Fallback to static questions
        return await get_cbt_questions()

# Zen Sessions
@api_router.post("/zen-sessions", response_model=ZenSession)
async def create_zen_session(input: ZenSessionCreate):
    session_dict = input.dict()
    session_obj = ZenSession(**session_dict)
    await db.zen_sessions.insert_one(session_obj.dict())
    return session_obj

@api_router.get("/zen-sessions", response_model=List[ZenSession])
async def get_zen_sessions(user_id: str = "anonymous"):
    sessions = await db.zen_sessions.find({"user_id": user_id}).to_list(1000)
    return [ZenSession(**session) for session in sessions]

# Articles
@api_router.get("/articles", response_model=List[Article])
async def get_articles():
    articles = await db.articles.find().to_list(1000)
    if not articles:
        # Seed some default articles
        await seed_articles()
        articles = await db.articles.find().to_list(1000)
    return [Article(**article) for article in articles]

@api_router.get("/articles/{article_id}", response_model=Article)
async def get_article(article_id: str):
    article = await db.articles.find_one({"id": article_id})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return Article(**article)

# Favorite Articles
@api_router.post("/favorites", response_model=FavoriteArticle)
async def add_favorite_article(article_id: str, user_id: str = "anonymous"):
    # Check if already favorited
    existing = await db.favorite_articles.find_one({"user_id": user_id, "article_id": article_id})
    if existing:
        return FavoriteArticle(**existing)
    
    favorite = FavoriteArticle(user_id=user_id, article_id=article_id)
    await db.favorite_articles.insert_one(favorite.dict())
    return favorite

@api_router.get("/favorites", response_model=List[str])
async def get_favorite_articles(user_id: str = "anonymous"):
    favorites = await db.favorite_articles.find({"user_id": user_id}).to_list(1000)
    return [fav["article_id"] for fav in favorites]

# Helper functions
def generate_theme_colors(mood: str, identity: str) -> Dict[str, str]:
    """Generate theme colors based on user's mood and identity"""
    base_themes = {
        "Anxious": {
            "primary": "#6B73FF",
            "secondary": "#9BB5FF", 
            "accent": "#C1D3FE",
            "background": "#1A1B23",
            "surface": "#2A2D37",
            "text": "#E2E8F0"
        },
        "Unfocused": {
            "primary": "#10B981",
            "secondary": "#34D399",
            "accent": "#6EE7B7",
            "background": "#1A1E1A",
            "surface": "#273229",
            "text": "#E2E8F0"
        },
        "Sad": {
            "primary": "#F59E0B",
            "secondary": "#FBBF24",
            "accent": "#FCD34D",
            "background": "#1E1B17",
            "surface": "#322A20",
            "text": "#E2E8F0"
        },
        "Stressed": {
            "primary": "#EF4444",
            "secondary": "#F87171",
            "accent": "#FCA5A5",
            "background": "#1E1A1A",
            "surface": "#332727",
            "text": "#E2E8F0"
        },
        "Calm": {
            "primary": "#06B6D4",
            "secondary": "#22D3EE",
            "accent": "#67E8F9",
            "background": "#1A1E1E",
            "surface": "#273333",
            "text": "#E2E8F0"
        }
    }
    
    return base_themes.get(mood, base_themes["Calm"])

async def seed_articles():
    """Seed the database with sample wellness articles"""
    sample_articles = [
        {
            "title": "Understanding Anxiety: A Gentle Guide",
            "content": "Anxiety is a natural response to stress, but when it becomes overwhelming, it can impact our daily lives. Learning to recognize the signs and developing healthy coping strategies can make a significant difference. Remember, seeking help is a sign of strength, not weakness.",
            "category": "Mental Health",
            "author": "Dr. Sarah Chen"
        },
        {
            "title": "The Power of Mindful Breathing", 
            "content": "Breathing is something we do automatically, but when we bring conscious attention to our breath, it becomes a powerful tool for relaxation and stress relief. Try the 4-7-8 technique: inhale for 4 counts, hold for 7, exhale for 8. This simple practice can help calm your nervous system.",
            "category": "Mindfulness",
            "author": "Marcus Thompson"
        },
        {
            "title": "Building Emotional Resilience",
            "content": "Emotional resilience is our ability to bounce back from difficult experiences. It's not about avoiding challenges, but developing the skills to navigate them with grace. Key practices include self-compassion, maintaining perspective, and building strong support networks.",
            "category": "Personal Growth",
            "author": "Dr. Maya Patel"
        },
        {
            "title": "The Science of Sleep and Mental Health",
            "content": "Quality sleep is fundamental to mental well-being. During sleep, our brains process emotions and consolidate memories. Creating a consistent sleep routine, limiting screen time before bed, and creating a calm environment can significantly improve both sleep quality and mental health.",
            "category": "Wellness",
            "author": "Dr. James Wilson"
        },
        {
            "title": "Cognitive Behavioral Techniques for Daily Life",
            "content": "CBT teaches us that our thoughts, feelings, and behaviors are interconnected. By identifying negative thought patterns and challenging them with evidence, we can change how we feel and respond to situations. This process takes practice but can lead to lasting positive changes.",
            "category": "Therapy",
            "author": "Dr. Lisa Rodriguez"
        }
    ]
    
    articles_to_insert = []
    for article_data in sample_articles:
        article = Article(**article_data)
        articles_to_insert.append(article.dict())
    
    await db.articles.insert_many(articles_to_insert)

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()