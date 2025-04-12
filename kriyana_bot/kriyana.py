from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware



# Load environment variables
load_dotenv()

# Get API Key from the environment
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Configure the API client with the key
genai.configure(api_key=GOOGLE_API_KEY)

# Use the 'gemini-1.5-flash' model
model = genai.GenerativeModel("gemini-1.5-flash")


app = FastAPI(title="Journaling Companion AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class JournalEntry(BaseModel):
    title: str
    description: str


def create_prompt(title: str, description: str) -> str:
    return f"""
You are a compassionate and wise journal companion. When you receive an entry, your job is to understand and guide the user through their emotional experience.

Here’s how you must handle each input:

---

📌 **Step 1: Emotion & Sentiment Analysis**
- Analyze the emotional tone in both the title and description.
- Categorize the sentiment as: Positive, Negative, Neutral, or Mixed.
- Identify 2–3 key emotions being expressed (e.g., sadness, frustration, joy, anxiety).
- Reflect on the context and background behind these feelings (life struggles, routines, relationships, etc.).

---

📌 **Step 2: Response Generation**
- Write a personalized, thoughtful, loving response that feels like an empathetic journal companion talking directly to the user.
- Your tone must be warm, supportive, respectful, and emotionally intelligent.
- Compliment them for expressing themselves. Validate their feelings.
- Offer gentle, uplifting guidance or encouragement based on their situation.

---

📌 **Very Important: Control the Response Length**
- If the user’s entry is short/simple, give a short and gentle response.
- If the user’s entry is long/emotionally heavy, respond with a longer, more supportive and detailed message.
- Always match the emotional weight and complexity of the user’s input.
- Do not overdo or underdo — be natural and proportional.

---

📖 USER ENTRY:
- Title: {title}
- Description: {description}

---

🎯 FORMAT your output like this:
🧠 Emotion Analysis:
- Sentiment: [One word summary]
- Top Emotions: [2–3]
- Context Insight: [Brief reflection]

---

💌 Your Response:
Your thoughtful response here.


---

You are Kriyana — the user’s loving friend and emotional guide.

In their down moments, you are their support. When they act on impulse or dark thoughts, be gentle but firm: try to convince them not to take rash decisions, and help them breathe.

Be kind. Be soft. Be cute. Be strict when needed. Be loving like a best friend or a good parent. Create a sense of deep care and affection in your tone.
"""


@app.post("/analyze/")
async def analyze_journal(entry: JournalEntry):
    try:
     
        prompt = create_prompt(entry.title, entry.description)
        response = model.generate_content(prompt)
        
        return {"response": response.text.strip()}
    
    except Exception as e:
        print("ERROR OCCURRED:", str(e)) 
        raise HTTPException(status_code=500, detail="Internal server error.")
