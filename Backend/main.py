from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from dnacentersdk import DNACenterAPI
from pydantic import BaseModel
from typing import List
import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FormattedIssue(BaseModel):
    id: int
    issueId: str
    name: str
    deviceId: str
    lastOccurrenceTime: str
    status: str

class FormattedEvent(BaseModel):
    id: int
    eventName: str
    eventType: str
    eventDescription: str
    eventTime: str

def format_time(epoch_time):
    if epoch_time:
        return datetime.datetime.fromtimestamp(epoch_time / 1000).strftime('%Y-%m-%d %H:%M:%S')
    return 'N/A'

# Original /issues endpoint
@app.get("/issues", response_model=List[FormattedIssue])
def get_issues(username: str, password: str, base_url: str):
    dnac_config = {
        "base_url": base_url,
        "username": username,
        "password": password,
        "version": "2.3.5.3",
        "verify": False
    }

    try:
        api = DNACenterAPI(**dnac_config)
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
            lastOccurrenceTime=format_time(issue.get('lastOccurrenceTime', 0)),
            status=issue.get('status', '')
        )
        formatted_issues.append(formatted_issue)

    return formatted_issues

# Proxy endpoint for /issues
@app.get("/proxy/issues", response_model=List[FormattedIssue])
def proxy_issues(username: str, password: str, base_url: str):
    return get_issues(username, password, base_url)

# Original /events endpoint
@app.get("/events", response_model=List[FormattedEvent])
def get_events(username: str, password: str, base_url: str):
    dnac_config = {
        "base_url": base_url,
        "username": username,
        "password": password,
        "version": "2.3.5.3",
        "verify": False
    }

    try:
        api = DNACenterAPI(**dnac_config)
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

# Proxy endpoint for /events
@app.get("/proxy/events", response_model=List[FormattedEvent])
def proxy_events(username: str, password: str, base_url: str):
    return get_events(username, password, base_url)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
