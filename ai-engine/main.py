import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2
import google.generativeai as genai
from dotenv import load_dotenv
import json

load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY", "dummy_key"))

app = FastAPI(
    title="SkillLens AI Engine",
    description="Backend microservice for resume parsing and AI analysis",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "SkillLens AI Engine is running"}

@app.post("/api/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        # Extract text from PDF
        pdf_reader = PyPDF2.PdfReader(file.file)
        text_content = ""
        for page in pdf_reader.pages:
            text_content += page.extract_text() + "\n"
        
        # In a real app, you would save the text to DB and associate with user.
        return {"status": "success", "text_length": len(text_content), "content_preview": text_content[:500]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze-resume")
async def analyze_resume(resume_text: dict):
    text = resume_text.get("text", "")
    if not text:
        raise HTTPException(status_code=400, detail="No resume text provided")
    
    prompt = """
    You are an elite AI-powered Career Intelligence System.
    Analyze the following resume text and extract all technical and soft skills.
    Categorize them into 'Technical' or 'Soft'.
    Output JSON strictly in this format:
    {
      "skills": [
        {"name": "Skill Name", "category": "Technical or Soft"}
      ],
      "ats_score": 85,
      "improvements": ["Suggestion 1", "Suggestion 2"]
    }
    
    Resume Text:
    """ + text

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        
        # Clean up json output
        result_text = response.text.replace("```json", "").replace("```", "").strip()
        result_json = json.loads(result_text)
        
        return result_json
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API Error: {str(e)}")

@app.post("/api/generate-roadmap")
async def generate_roadmap(data: dict):
    skills = data.get("current_skills", [])
    target_role = data.get("target_role", "Software Engineer")
    
    prompt = f"""
    Generate a 4-week learning roadmap to help someone transition to {target_role} 
    given their current skills: {', '.join(skills)}.
    Provide the output as JSON:
    {{
       "weeks": [
          {{"week": 1, "focus": "...", "tasks": ["...", "..."]}},
          {{"week": 2, "focus": "...", "tasks": ["...", "..."]}}
       ]
    }}
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        result_text = response.text.replace("```json", "").replace("```", "").strip()
        result_json = json.loads(result_text)
        return result_json
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API Error: {str(e)}")
