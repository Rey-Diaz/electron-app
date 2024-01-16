from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dnacentersdk import DNACenterAPI
from pydantic import BaseModel
from typing import List
import datetime

app = FastAPI()

# Middleware to allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class FormattedIssue(BaseModel):
    id: int
    issueId: str
    name: str
    deviceId: str
    lastOccurenceTime: str
    status: str

class FormattedEvent(BaseModel):
    id: int
    eventName: str
    eventType: str
    eventDescription: str
    eventTime: str

# Endpoint to get issues
@app.get("/issues", response_model=List[FormattedIssue])
def get_issues(username: str, password: str, apiUrl: str):
    # Use the username, password, and apiUrl values passed in the request
    dnac_config = {
        "base_url": apiUrl,
        "username": username,
        "password": password,
        "version": "2.3.5.3",
        "verify": False
    }

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

    return formatted_issues

# Endpoint to get events
@app.get("/events", response_model=List[FormattedEvent])
def get_auditlog_parent_records(username: str, password: str, apiUrl: str):
    # Use the username, password, and apiUrl values passed in the request
    dnac_config = {
        "base_url": apiUrl,
        "username": username,
        "password": password,
        "version": "2.3.5.3",
        "verify": False
    }

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

    return formatted_events

# Helper function to format time
def format_time(epoch_time):
    if epoch_time:
        return datetime.datetime.fromtimestamp(epoch_time / 1000).strftime('%Y-%m-%d %H:%M:%S')
    return 'N/A'
