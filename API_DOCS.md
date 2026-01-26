# AAA Assistant API Documentation (Draft)

This document outlines the reserved backend interfaces for the AAA Assistant application.

## Base URL
`https://api.aaa-assistant.com/v1` (Mock)

## Authentication
All requests must include the `Authorization` header with a Bearer token.
`Authorization: Bearer <token>`

## Endpoints

### 1. Chat

#### Send Message
- **URL**: `/chat/completions`
- **Method**: `POST`
- **Description**: Send a message to the AI and receive a response.
- **Request Body**:
  ```json
  {
    "model": "aaa-v1",
    "messages": [
      { "role": "user", "content": "Hello, how are you?" }
    ],
    "stream": true
  }
  ```
- **Response**:
  ```json
  {
    "id": "chatcmpl-123",
    "object": "chat.completion",
    "created": 1677652288,
    "choices": [{
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! I am AAA, ready to help you."
      },
      "finish_reason": "stop"
    }]
  }
  ```

### 2. History

#### Get Recent Chats
- **URL**: `/chat/history`
- **Method**: `GET`
- **Query Params**:
  - `limit`: (Optional) Number of chats to return (default: 20).
  - `offset`: (Optional) Pagination offset.
- **Response**:
  ```json
  {
    "data": [
      { "id": "1", "title": "Recipe for Tomato Eggs", "timestamp": "2023-10-01T10:00:00Z" },
      { "id": "2", "title": "Vue3 Concepts", "timestamp": "2023-10-02T14:30:00Z" }
    ]
  }
  ```

### 3. User

#### Get User Profile
- **URL**: `/user/profile`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "id": "u123",
    "name": "John Doe",
    "avatar": "https://example.com/avatar.jpg"
  }
  ```

### 4. File Upload (For Camera/Images)

#### Upload File
- **URL**: `/files/upload`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Form Data**:
  - `file`: (Binary) The image file.
- **Response**:
  ```json
  {
    "url": "https://cdn.aaa-assistant.com/uploads/img_123.jpg",
    "file_id": "file_123"
  }
  ```
