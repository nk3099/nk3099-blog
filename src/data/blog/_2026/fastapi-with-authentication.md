
---
title: FastAPI with Authentication
slug: fastapi-with-authentication
draft: false
pubDatetime: 2026-01-10T15:00:00+05:30
description: This guide walks you through basic concepts like routes, dependencies, authentication, and serialization with a simple demo.
tags:
  - fastapi
---

 ⚡ FastAPI is a modern, high-performance web framework for building APIs with Python.  


### Before You Dive In

Think of this as your quick checklist:

- **Routes**: Use decorators like `@app.get()` or `@app.post()` to define endpoints.
- **Dependencies**: `Depends()` helps inject reusable logic—like DB connections or auth checks.
- **Authentication**: Add a lock 🔐 to your API. Bearer tokens are a simple start.
- **Serialization**: FastAPI automatically converts Python objects to JSON (and back).
- **Validation**: Pydantic models keep your data clean and predictable.

---

## 🧩 What Is `Depends`?

`Depends` is part of FastAPI’s dependency system. It tells FastAPI:

> “Run this function before the endpoint and inject its return value into my parameter.”


---
## 🌐 Networking 
- A **host** = any device (computer, server, IoT device) that has an IP address and can communicate over a network
- In a connection, the host is usually the endpoint you talk to.

---

## 📦 Serialization in FastAPI

- FastAPI automatically serializes return values (dict, Pydantic model) into JSON for HTTP responses.
- **Serialization**: Convert an object (Python dict, class instance) into a format like JSON or XML.
- **Deserialization**: Reverse process—convert JSON back to Python objects.

### Common Use Cases:
- **APIs**: When sending data over HTTP, serialize Python objects to JSON.
- **Databases**: Store structured data as strings/blobs.
- **Caching**: Save objects in Redis or files.

### JSON Serialization :
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


---

## 🛠️ Hands-On Demo: FastAPI Basics

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