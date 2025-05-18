from pydantic import BaseModel, Field
from typing import List, Optional

class date(BaseModel):
    """Date"""
    day: Optional[int] = Field(default=1, description="Day of month, a integer from 1 and 31, if unkown the default is 1")
    month: Optional[int] = Field(description="Month of year, an integer from 1 to 12")
    year: Optional[int] = Field(description="Year in yyyy format")
    

class job(BaseModel):
    """Job details"""
    job_title: Optional[str] = Field(description="Job titile")
    job_description: Optional[str] = Field(description="Information about the job and what did the candidate do in it if available.")
    started_at: Optional[date] = Field(description="When did the candidate start this job? Retrun None if not available")
    ended_at: Optional[date] = Field(description="When did the candidate end this job? Retrun None if not available")
    current_job: Optional[bool] = Field(description="True if this the candidates current job, False if it's not the candidate's current job")


class degree(BaseModel):
    """degree details, which only includes Bachelor's, Master's or Phd degrees"""
    degree_type: Optional[str] = Field(description="Degree type, which is Bachelor's, Master's or Phd")
    major: Optional[str] = Field(description="Degree major")
    university: Optional[str] = Field(description="Degree university")
    graduation_date: Optional[date] = Field(description="When did the candidate graduate? Retrun None if not available")


class project(BaseModel):
    """project details"""
    project_title: Optional[str] = Field(description="Project title")
    project_description: Optional[str] = Field(description="Information about the project and what did the candidate do in it if available.")


class candidate(BaseModel):
    """personal information about the candidate"""
    first_name: Optional[str] = Field(description="First name")
    last_name: Optional[str] = Field(description="Last name")
    country__phone_code: Optional[str] = Field(description="Country phone code, examples: +1 or +39")
    phone_number: Optional[int] = Field(description="Phone number, without country phone code")
    email: Optional[str] = Field(description="Email address")
    country: Optional[str] = Field(description="country")
    degrees: Optional[List[degree]] = Field(description="list of all candidate's degrees")
    jobs: Optional[List[job]] = Field(description="Only include jobs the candidate listed in a work experience section. Return None if he hasn't listed any.")
    skills: Optional[list[str]] = Field(description="list of candidate's skills that are relevant to the job")
    projects: Optional[list[project]] = Field(description="list of projects and publications the candidate has worked on")

class  JobDesctripion(BaseModel):

    """Information about the job"""
    job_title: Optional[str] = Field(description="Only the job title")
    job_description: Optional[str] = Field(description="Job description")
    skills: Optional[list[str]] = Field(description="Skills required for the job")
    experience: Optional[str] = Field(description="Experience required for the job")
    education: Optional[str] = Field(description="Education required for the job")
    N_YEARS_MIN: Optional[int] = Field(description="Minimum number of years of experience required for the job, if not given estimate based on education")


class FUllSimlarity (BaseModel):
    """Full Similarity between job and candidate"""
    similarity: Optional[float] = Field(description="Similarity between job and candidate, a float between 0 and 1")
    reason: Optional[str] = Field(description="Reason for the similarity score")
    projects: Optional[str] = Field(description="Relevant skills user has used in projects and work experience")

class ResumeReviewResponse(BaseModel):
    """Response model for resume review and optimization"""
    review: Optional[str] = Field(description="Constructive review of the resume.")
    optimization: Optional[str] = Field(description="Suggestions for optimizing the resume.")

import PyPDF2
# import docx
import io
import datetime
import re

def read_pdf_text(resume_file):
    pdf_reader = PyPDF2.PdfReader(resume_file)
    text = ""
    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        text += page.extract_text().strip()
    return text


# def read_docx_text(word_file):
#     doc = docx.Document(word_file)
#     text = ""
#     for paragraph in doc.paragraphs:
#         text += paragraph.text.strip() + "\n"
#     return text


def extract_resume_text(resume_file):
    file_type = resume_file.split(".")[-1]
    if file_type == "pdf":
        return read_pdf_text(resume_file)
    # elif file_type == "docx":
    #     return read_docx_text(resume_file)


def date_to_datetime(input):
    for _, value in input.items():
        if value is None:
            return None
        
    return datetime.date(**input)


def convert_dates_to_datetime(candidate_data: candidate):
    candidate_dict = candidate_data.model_dump()
    
    if "degrees" in candidate_dict.keys():
        for degree in candidate_dict["degrees"]:
            if degree["graduation_date"]:
                degree["graduation_date"] = date_to_datetime(degree["graduation_date"])
    
    if "jobs" in candidate_dict.keys():
        for job in candidate_dict["jobs"]:
            if job["started_at"]:
                job["started_at"] = date_to_datetime(job["started_at"])
            if job["ended_at"]:
                job["ended_at"] = date_to_datetime(job["ended_at"])

    return candidate_dict


def is_valid_email(email):
    
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None


from langchain_groq import ChatGroq
import os

os.environ["GROQ_API_KEY"] = ""


llm = ChatGroq(temperature=0, model_name="llama3-8b-8192", model_kwargs={"response_format": {"type": "json_object"}})


from langchain.output_parsers import PydanticOutputParser
from langchain_core.prompts import PromptTemplate

parser = PydanticOutputParser(pydantic_object=candidate)

prompt_template = """\
You are tasked with extracting data from resume for a {job_title} job and retruning a JSON structre.\n
{format_instructions}\n
Resume text: {resume_text}
"""

prompt = PromptTemplate(
    template=prompt_template,
    input_variables=["job_title", "resume_text"],
    partial_variables={"format_instructions": parser.get_format_instructions()},
)

llm_resume_parser = prompt | llm | parser



parser_job = PydanticOutputParser(pydantic_object=JobDesctripion)

prompt_template_job = """\
You are tasked with extracting data from job description for a {job_title} job and retruning a JSON structre.\n
{format_instructions}\n Make sure N_YEARS_MIN is extracted, if not given estimate based on education\n
Job description: {job_description}
"""

prompt_job = PromptTemplate(
    template=prompt_template_job,
    input_variables=["job_title", "job_description"],
    partial_variables={"format_instructions": parser_job.get_format_instructions()},
)

llm_job_parser = prompt_job | llm | parser_job


parser_sim = PydanticOutputParser(pydantic_object= FUllSimlarity)
prompt_template_sim = """\
You are tasked with finding the similarity between a job description and a resume and a very very detailed reasoning along with a analaysis of the user's projetcs and experience.\n
{format_instructions}\n
Resume text: {resume_text}\n 
Job description: {job_description}
"""

sim_template= PromptTemplate(
    template=prompt_template_sim,
    input_variables=["job_description", "resume_text"],
    partial_variables={"format_instructions": parser_sim.get_format_instructions()},
)

llm_sim = ChatGroq(temperature=0, model_name="gemma2-9b-it", model_kwargs={"response_format": {"type": "json_object"}})

llm_similarity = sim_template | llm_sim | parser_sim

# Resume Review and Optimization Chain
parser_review = PydanticOutputParser(pydantic_object=ResumeReviewResponse)

prompt_template_review = """\
You are an expert resume reviewer and career coach.
Please provide a constructive review of the following resume.
Then, suggest specific, actionable optimizations tailored to the content and structure of THIS resume to improve its effectiveness. Avoid generic advice.
Focus on clarity, impact, and alignment with best practices, directly referencing sections or points from the resume provided.
{format_instructions}

Resume text:
{resume_text}
"""

prompt_review = PromptTemplate(
    template=prompt_template_review,
    input_variables=["resume_text"],
    partial_variables={"format_instructions": parser_review.get_format_instructions()},
)

# Using the same llm instance as for resume parsing, as it's suitable for generation tasks
llm_resume_reviewer = prompt_review | llm | parser_review


from transformers import AutoTokenizer, AutoModelForMaskedLM , BertTokenizer, BertModel
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased')


import torch
from transformers import AutoTokenizer, AutoModel


def compute_similarity(resume_pdf_path , job_title , JOB_DESCRIPTION , model, tokenizer , llm_resume_parser , llm_job_parser , llm_similarity , n_years = None):
    
    resume_text = extract_resume_text(resume_pdf_path)
    llm_score = llm_similarity.invoke({"job_description": JOB_DESCRIPTION, "resume_text": resume_text})

    resume_data = llm_resume_parser.invoke({"job_title": job_title, "resume_text":resume_text})
    job_data = llm_job_parser.invoke({"job_title": job_title, "job_description": JOB_DESCRIPTION})

    print(resume_data)
    print(job_data)
    print(llm_score)

    candidate_data = resume_data
    candidate_data = convert_dates_to_datetime(candidate_data)
    job_data = convert_dates_to_datetime(job_data)
    



    cand_jobs = candidate_data["jobs"]
    cand_degrees_dict = candidate_data["degrees"]
    cand_degrees = ""
    for degree in cand_degrees_dict:
        cand_degrees += degree["degree_type"] + " in " + degree["major"] + " from " + degree["university"] + " in " + str(degree["graduation_date"]) + " , "

    cand_skills = " , ".join(candidate_data["skills"])
    cand_projects = candidate_data["projects"]
    
    exper = ""
    for job in cand_jobs:
        print(job)
        if job["job_description"] is None:
            job["job_description"] = ""
        if job["job_title"] is None:
            job["job_title"] = ""
        exper += job["job_title"] + " " + job["job_description"] + " , "
    for project in cand_projects:
        if project["project_description"] is None:
            project["project_description"] = ""
        if project["project_title"] is None:
            project["project_title"]
        exper += project["project_title"] + " " + project["project_description"] + " , "

    if job_data["skills"] is None:
        job_skills = ""
    elif len(job_data["skills"]) > 1:
        job_skills = " , ".join(job_data["skills"])  
    job_exp = JOB_DESCRIPTION  

    # Tokenizing with padding to ensure uniform length
    def tokenize_and_embed(text):
        tokens = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
        with torch.no_grad():
            return model(**tokens).last_hidden_state.mean(dim=1)
    skills_use = True
    try:
        cand_embeds = tokenize_and_embed(cand_skills)
        job_embeds = tokenize_and_embed(job_skills)
        sim_skills = torch.cosine_similarity(cand_embeds, job_embeds)
    except:
        sim_skills = 0.5
        skills_use = False
    
    exp_Use = True
    try:
        cand_embeds = tokenize_and_embed(exper)
        job_embeds = tokenize_and_embed(job_exp)
        sim_exp = torch.cosine_similarity(cand_embeds, job_embeds)
    except:
        sim_exp = 0.5
        exp_Use = False


    if job_data["experience"] is None:
        job_data["experience"] = ""
    if job_data["education"] is None:
        job_data["education"] = ""
    job_edu_text = job_data["education"] + " in " + job_data["experience"]
    ed_use = True
    try:
        cand_embeds = tokenize_and_embed(cand_degrees)
        job_embeds = tokenize_and_embed(job_edu_text)
        sim_edu = torch.cosine_similarity(cand_embeds, job_embeds)
    except:
        sim_edu = 0.5
        ed_use = False
        

    n_years = n_years
    cand_work_exp = sum(
        ((datetime.datetime.now().date() - job["started_at"]).days if job["ended_at"] is None else (job["ended_at"] - job["started_at"]).days)
        for job in cand_jobs
    ) // 365

    wts_no_work_exp_in_job = {"skills": 0.1, "experience": 0.6, "education": 0.3}
    wts_work_exp_in_job = {"skills": 0.1, "experience": 0.5, "education": 0.2, "work_exp": 0.2}

    wts = wts_no_work_exp_in_job if n_years is None else wts_work_exp_in_job

        
    if skills_use and exp_Use and ed_use:
        
        if n_years is not None and n_years != 0:
            sim_work_exp =   1 - abs(n_years - cand_work_exp) / n_years
            sim = sim_skills * wts["skills"] + sim_exp * wts["experience"] + sim_edu * wts["education"] + sim_work_exp * wts["work_exp"]
        else:
            sim = sim_skills * wts["skills"] + sim_exp * wts["experience"] + sim_edu * wts["education"]
        simlarity = ( sim + llm_score.similarity ) / 2
        simlarity = simlarity.item()
        simlarity = float(simlarity)
        if cand_work_exp  is None:
            cand_work_exp = 0
        return {"similarity": simlarity, "reason": llm_score.reason , "n_years" : cand_work_exp , "skills" :cand_skills , "projects":llm_score.projects}
    else:
        if n_years is not None and n_years != 0:
            sim_work_exp =   1 - abs(n_years - cand_work_exp) / n_years
            sim = sim_work_exp * wts["work_exp"]
        simlarity = float(llm_score.similarity)
        return {"similarity": simlarity, "reason": llm_score.reason , "n_years" : cand_work_exp , "skills" :cand_skills , "projects":llm_score.projects}



# print(compute_similarity("ARNESH_CV.pdf" , "Data Scientist" , "We are looking for a data scientist with a strong background in statistics and machine learning. The candidate should have a Master's degree in computer science or a related field. The candidate should have at least 3 years of experience in data science." , model, tokenizer , llm_resume_parser , llm_job_parser , llm_similarity))


from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware # Added import
import shutil

# FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.post("/submit_application/")
async def submit_application(
    resume_file: UploadFile = File(...),
    job_title: str = Form(...),
    job_description: str = Form(...),
    application_id: Optional[str] = Form(None),
    job_id: Optional[str] = Form(None),
    n_years: Optional[int] = Form(None),
    N : Optional[int] = Form(None)
    ):

    #Save in resume folder
    folder = "resume"
    os.makedirs(folder, exist_ok=True)
    resume_pdf_path = os.path.join(folder, resume_file.filename)
    with open(resume_pdf_path, "wb") as buffer:
        shutil.copyfileobj(resume_file.file, buffer)

    # print(resume_pdf_path)
    # print(job_title)
    # print(job_description)
    # print(application_id)
    # print(job_id)
    # print(n_years)




    output = compute_similarity( resume_pdf_path , job_title , job_description , model, tokenizer , llm_resume_parser , llm_job_parser , llm_similarity , n_years)
    print(output)
    
    return output

# New endpoint for resume review
@app.post("/review_resume/")
async def review_resume_endpoint(
    resume_file: UploadFile = File(...)
):
    folder = "resume_reviews" # Storing in a different folder or handle as temp
    os.makedirs(folder, exist_ok=True)
    resume_pdf_path = os.path.join(folder, resume_file.filename)
    with open(resume_pdf_path, "wb") as buffer:
        shutil.copyfileobj(resume_file.file, buffer)

    resume_text = extract_resume_text(resume_pdf_path)
    
    review_output = llm_resume_reviewer.invoke({"resume_text": resume_text})
    
    # Clean up the saved file after processing if it's temporary
    # os.remove(resume_pdf_path) 
    
    return review_output

#rUNNING THE API

import uvicorn

if __name__ == "__main__":
    uvicorn.run(app,  host="localhost", port=8000)



