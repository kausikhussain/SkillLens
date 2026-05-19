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
        return {"status": "success", "text_length": len(text_content), "content_preview": text_content[:500], "full_text": text_content}
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
        api_key = os.getenv("GEMINI_API_KEY", "dummy_key")
        if api_key == "dummy_key" or api_key == "":
            # Return realistic mock data if no API key is provided
            return {
                "skills": [
                    {"name": "Python", "category": "Technical"},
                    {"name": "Next.js", "category": "Technical"},
                    {"name": "Communication", "category": "Soft"},
                    {"name": "Project Management", "category": "Soft"}
                ],
                "ats_score": 82,
                "improvements": [
                    "Quantify your achievements (e.g., 'Improved performance by 20%')",
                    "Add more action verbs to the beginning of bullet points",
                    "Include missing keywords from the target job description"
                ]
            }

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
        api_key = os.getenv("GEMINI_API_KEY", "dummy_key")
        if api_key == "dummy_key" or api_key == "":
            return {
               "weeks": [
                  {"week": 1, "focus": "Fundamentals & Core Concepts", "tasks": ["Complete Python crash course", "Build a simple CLI tool"]},
                  {"week": 2, "focus": "Advanced Topics", "tasks": ["Learn about generators and decorators", "Solve 5 LeetCode medium problems"]},
                  {"week": 3, "focus": "Frameworks", "tasks": ["Build a REST API with FastAPI", "Integrate a SQLite database"]},
                  {"week": 4, "focus": "Project & Deployment", "tasks": ["Deploy the API to Render", "Update resume with this project"]}
               ]
            }

        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        result_text = response.text.replace("```json", "").replace("```", "").strip()
        result_json = json.loads(result_text)
        return result_json
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API Error: {str(e)}")

@app.post("/api/match-jd")
async def match_jd(data: dict):
    resume_text = data.get("resume_text", "")
    jd_text = data.get("jd_text", "")
    
    if not resume_text or not jd_text:
        raise HTTPException(status_code=400, detail="Resume text and JD text are required")
        
    prompt = f"""
    You are an expert ATS (Applicant Tracking System).
    Compare the following resume with the job description.
    Calculate a match score out of 100 based on how well the resume aligns with the JD.
    Identify matching skills and missing keywords.
    Provide the output strictly as JSON:
    {{
       "match_score": 85,
       "matching_skills": ["Python", "API Development"],
       "missing_keywords": ["Kubernetes", "AWS", "Docker"]
    }}
    
    Resume Text:
    {resume_text}
    
    Job Description:
    {jd_text}
    """
    
    try:
        api_key = os.getenv("GEMINI_API_KEY", "dummy_key")
        if api_key == "dummy_key" or api_key == "":
            return {
               "match_score": 75,
               "matching_skills": ["Python", "Next.js", "Teamwork"],
               "missing_keywords": ["GraphQL", "CI/CD", "System Design"]
            }

        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        result_text = response.text.replace("```json", "").replace("```", "").strip()
        result_json = json.loads(result_text)
        return result_json
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API Error: {str(e)}")
