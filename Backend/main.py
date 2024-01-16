from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dnacentersdk import DNACenterAPI
from dotenv import load_dotenv
import os
from pydantic import BaseModel
from typing import List
import datetime

app = FastAPI()
load_dotenv()  # Load environment variables from .env file

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load sensitive information from environment variables
DNA_CENTER_URL = os.getenv('DNA_CENTER_URL')
DNA_CENTER_USERNAME = os.getenv('DNA_CENTER_USERNAME')
DNA_CENTER_PASSWORD = os.getenv('DNA_CENTER_PASSWORD')

# Define a Pydantic model for the formatted issue
class FormattedIssue(BaseModel):
    id: int
    issueId: str
    name: str
    deviceId: str
    lastOccurenceTime: str
    status: str

# Define a Pydantic model for the formatted event
class FormattedEvent(BaseModel):
    id: int
    eventName: str
    eventType: str
    eventDescription: str
    eventTime: str

dnac_config = {
    "base_url": DNA_CENTER_URL,
    "username": DNA_CENTER_USERNAME,
    "password": DNA_CENTER_PASSWORD,
    "version": "2.3.5.3",
    "verify": False
}

@app.get("/issues", response_model=List[FormattedIssue])
def get_issues():
    print("Issues")
    # Create a DNACenterAPI instance
    api = DNACenterAPI(**dnac_config)

    try:
        raw_issues = api.issues.issues()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    formatted_issues = []
    for index, issue in enumerate(raw_issues['response']):
        formatted_issue = FormattedIssue(
            id=index,
            issueId=issue.get('issueId', ''),
            name=issue.get('name', ''),
            deviceId=issue.get('deviceId', ''),
            lastOccurenceTime=format_time(issue.get('last_occurence_time', 0)),
            status=issue.get('status', '')
        )
        formatted_issues.append(formatted_issue)
    print(formatted_issues)
    return formatted_issues

@app.get("/events", response_model=List[FormattedEvent])
def get_auditlog_parent_records():
    print("Events")
    api = DNACenterAPI(**dnac_config)
    try:
        raw_events = api.event_management.get_auditlog_parent_records()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    formatted_events = []
    for index, event in enumerate(raw_events):
        formatted_event = FormattedEvent(
            id=index,
            eventName=event.get('name', ''),
            eventType=event.get('type', ''),
            eventDescription=event.get('description', ''),
            eventTime=format_time(event.get('timestamp', 0))
        )
        formatted_events.append(formatted_event)
    print(formatted_events)
    return formatted_events

def format_time(epoch_time):
    if epoch_time:
        return datetime.datetime.fromtimestamp(epoch_time / 1000).strftime('%Y-%m-%d %H:%M:%S')
    return 'N/A'


@app.get("/eventartifacts", response_model=List[dict])
def get_event_artifacts(
    event_ids: str = None,
    tags: str = None,
    offset: int = None,
    limit: int = None,
    sort_by: str = None,
    order: str = None,
    search: str = None,
    headers: dict = None,
):
    try:
        # Call the get_eventartifacts function with the provided parameters
        artifacts = get_eventartifacts(
            event_ids=event_ids,
            tags=tags,
            offset=offset,
            limit=limit,
            sort_by=sort_by,
            order=order,
            search=search,
            headers=headers,
        )
        return artifacts  # Return the JSON response as a list of dictionaries
    except Exception as e:
        # Handle any exceptions or errors and return an appropriate response
        return {"error": str(e)}