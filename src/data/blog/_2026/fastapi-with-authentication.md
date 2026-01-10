---
title: FastAPI with Authentication
slug: fastapi-with-authentication
draft: false
pubDatetime: 2026-01-10T15:00:00+05:30
description: fastapi implementation with api authentication
tags:
  - fastapi 
---

**Decorator line (the route definition)** declares what the endpoint returns (the response) and static metadata like status code. 

**Function signature** declares what the endpoint receives (the request inputs)—body, path/query params, and injected dependencies.

## 🧠 What Is Depends?

Depends is part of FastAPI’s dependency system. It tells FastAPI: “Run this function before the endpoint and inject its return value into my parameter.”

## 📈 In Networking:

A host is any device (computer, server, IoT device) that has an IP address and can communicate over a network. In a connection, the host is typically the endpoint you are connecting to or from.

## Serialization:

* FastAPI automatically serializes your return values (dict, Pydantic model) into JSON for HTTP responses.

* Serialization means converting an object (like a Python dictionary, class instance, or data structure) into a format that can be easily stored or transmitted (e.g., JSON, XML, or binary). The reverse process is called deserialization.

* Common Use Case in Python 
> * APIs: When sending data over HTTP, you serialize Python objects to JSON.
> * Databases: Store structured data as strings or blobs.
> - Caching: Save objects in Redis or files.

## 💻 Example: 
```python

import json

data = {"id": 1, "title": "Hello", "tags": ["python", "fastapi"]}

# Serialize (Python object → JSON string)
json_string = json.dumps(data)
print(json_string)  # {"id": 1, "title": "Hello", "tags": ["python", "fastapi"]}

# Deserialize (JSON string → Python object)
parsed_data = json.loads(json_string)
print(parsed_data["title"])  # Hello

```

**Sample Code:**

```python
import psycopg2
from fastapi import FastAPI, Depends, status
from pydantic import BaseModel

app = FastAPI()

# -------------------------
# Database Dependency
# -------------------------
def get_db():
    """
    Creates a new PostgreSQL connection for each request and closes it after.
    """
    conn = psycopg2.connect(
        host="localhost",
        database="fastapi",
        user="postgres",
        password="Learning@tools1"
    )
    try:
        yield conn  # Provide the connection to the endpoint
    finally:
        conn.close()  # Ensure cleanup after request

# -------------------------
# Pydantic Schemas
# -------------------------
class PostCreate(BaseModel):
    title: str
    body: str

class PostResponse(BaseModel):
    id: int
    title: str
    body: str

# -------------------------
# Create Post Endpoint
# -------------------------
@app.post("/posts", status_code=status.HTTP_201_CREATED, response_model=PostResponse)
def create_post(payload: PostCreate, db = Depends(get_db)):

"""  
     Decorator:
       - response_model=PostResponse tells FastAPI to validate/shape the output.
       - status_code=201 sets the HTTP status.

     Function:
       - Receives the request body (validated as PostCreate) + DB connection via Depends(get_db).
       - FastAPI will AUTOMATICALLY serialize the returned Pydantic model instance
         (PostResponse) to JSON for the HTTP response.
 """
 
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO posts (title, body) VALUES (%s, %s) RETURNING id",
        (payload.title, payload.body)
    )
    post_id = cursor.fetchone()[0]
    db.commit()
    cursor.close()

    # Automatic JSON serialization happens here:
    # Returning a Pydantic model instance. FastAPI converts it to JSON in the response.
    
    return PostResponse(id=post_id, title=payload.title, body=payload.body)

# -------------------------
# Get All Posts Endpoint
# -------------------------
@app.get("/posts", response_model=list[PostResponse])
def get_posts(db = Depends(get_db)):
  
    cursor = db.cursor()
    cursor.execute("SELECT id, title, body FROM posts")
    rows = cursor.fetchall()
    cursor.close()
return [PostResponse(id=row[0], title=row[1], body=row[2]) for row in rows]

```
