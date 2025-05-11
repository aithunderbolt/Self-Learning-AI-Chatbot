# System Patterns: Self-Learning AI Agent

**Last Updated:** 2025-05-11

## 1. High-Level Architecture (Initial)

The system will be designed with a modular, microservices-oriented architecture where feasible to promote scalability, maintainability, and independent development of components.

```mermaid
flowchart TD
    User[User Interface (Website Widget, Messenger, etc.)] --> A[API Gateway / Backend Service]
    
    A --> B[NLU Service (Gemini-2.5-flash via OpenRouter)]
    A --> C[Data Retrieval Service]
    A --> D[Conversation Management Service]
    A --> E[Learning Service]
    
    C --> F[Google Sheets API]
    C --> G[Internal Knowledge Base]
    
    D --> H[Chat History DB (Supabase)]
    E --> H

    I[Admin Dashboard] --> A
    I --> J[Configuration Management]
    J --> F
    J --> H
```

## 2. Key Technical Decisions (To Be Detailed)

- **NLU Provider:** Gemini-2.5-flash via OpenRouter.
- **Primary Data Source (Initial):** Google Sheets.
- **Chat History & Learning Data Storage:** Supabase (PostgreSQL).
- **Backend Orchestration:** Likely Node.js (Express.js or similar) or Python (Flask/FastAPI) for managing API requests, integrating services, and real-time communication.
- **Frontend Widget:** JavaScript-based, embeddable snippet.
- **Admin Panel:** Web-based, potentially using a modern JavaScript framework (React, Vue, Angular).

## 3. Design Patterns (To Be Incorporated)

- **Adapter Pattern:** For integrating with multiple messaging platforms.
- **Repository Pattern:** For data access to Supabase and other data sources.
- **Strategy Pattern:** Potentially for different NLU or response generation strategies.
- **Publish/Subscribe (Pub/Sub):** For asynchronous tasks, such as logging or triggering learning processes.
- **Caching:** For frequently accessed data from Google Sheets or common responses to improve performance and reduce API calls.

## 4. Component Relationships (To Be Detailed)

- **Core Engine:** Will encapsulate NLU, Q&A logic, and context management. Must be abstracted from specific messaging platforms.
- **Platform Adapters:** Will handle communication between the core engine and specific platforms (e.g., Discord bot, Facebook Messenger API client).
- **Learning Module:** Will periodically process chat logs from Supabase to refine responses. This could be a separate service or a set of scheduled tasks.
- **Data Connectors:** Modules responsible for fetching data from Google Sheets and any future data sources.
