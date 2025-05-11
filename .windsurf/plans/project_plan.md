# Project Plan: Self-Learning AI Agent

**Last Updated:** 2025-05-11

This document outlines the development plan for the Self-Learning AI Agent.

## Phase 1: Core Backend, NLU Integration, and Supabase Setup

**Goal:** Establish the foundational backend services, integrate the NLU model, and set up the database for chat logging.

- **Task 1.1: Setup Supabase Project**
    - Create a new Supabase project.
    - Define initial database schema for chat history (e.g., `conversations` table with fields like `session_id`, `user_query`, `ai_response`, `timestamp`, `user_feedback`, `platform`).
    - Secure API keys and database credentials.
- **Task 1.2: Develop Core API Service**
    - Choose backend framework (Node.js/Express.js or Python/Flask/FastAPI).
    - Set up basic project structure for the chosen backend.
    - Implement an API endpoint to receive user messages (e.g., `/chat`).
- **Task 1.3: Integrate NLU (Gemini-2.5-flash via OpenRouter)**
    - Create a module to interact with the OpenRouter API.
    - Securely manage the OpenRouter API key.
    - Implement basic NLU processing: send user query to Gemini, receive NLU result.
- **Task 1.4: Implement Conversation Logging**
    - Integrate Supabase SDK/client into the backend service.
    - Log user queries and AI responses to the Supabase database from the `/chat` endpoint.
- **Task 1.5: Basic Context Management**
    - Implement initial logic to maintain conversation context for a short history (e.g., last 2-3 turns).
- **Task 1.6: Fallback Mechanism**
    - Implement a basic fallback response if the NLU fails or the agent cannot answer.

## Phase 2: Google Sheets Integration

**Goal:** Enable the AI Agent to retrieve real-time data from Google Sheets.

- **Task 2.1: Google Sheets API Authentication**
    - Set up Google Cloud Project and enable Google Sheets API.
    - Configure OAuth 2.0 credentials for secure server-to-server authentication.
    - Store credentials securely.
- **Task 2.2: Data Retrieval Module**
    - Develop a module to connect to Google Sheets API.
    - Implement functions to fetch data from specified sheets, cells, or ranges.
    - Handle various data types (text, numbers, dates).
- **Task 2.3: Data Mapping/Querying Logic (Initial)**
    - Design a simple mechanism (e.g., configuration file) for administrators to define mappings between query types and Google Sheets data.
    - Example: Map "price of X" query to lookup in a specific sheet/column.
- **Task 2.4: Integrate with Core Q&A**
    - Modify the Q&A logic to query Google Sheets based on recognized intents or keywords.
- **Task 2.5: Caching Strategy (Basic)**
    - Implement basic caching for frequently accessed, non-volatile Google Sheets data to reduce API calls and latency.

## Phase 3: Website Chat Widget (Embeddable)

**Goal:** Provide an embeddable chat widget for website integration.

- **Task 3.1: Widget Frontend Development**
    - Develop HTML, CSS, and JavaScript for the chat interface.
    - Ensure it's lightweight and easy to embed.
- **Task 3.2: Communication with Backend**
    - Implement WebSocket or AJAX communication between the widget and the backend API service (`/chat` endpoint).
- **Task 3.3: Basic Customization**
    - Allow basic UI customization via JavaScript configuration (e.g., color scheme, initial greeting).
- **Task 3.4: Embeddable Snippet Generation**
    - Provide a simple JavaScript snippet for website owners to embed the widget.

## Phase 4: Basic Admin Dashboard

**Goal:** Create a simple web interface for administrators.

- **Task 4.1: Admin Panel Frontend**
    - Choose a frontend framework (React, Vue, or simple HTML/JS) for the admin panel.
    - Design basic UI for configuration and analytics.
- **Task 4.2: API Key Management Interface**
    - Allow admins to securely input and update API keys (OpenRouter, Google, Supabase).
- **Task 4.3: Google Sheets Configuration Interface**
    - Allow admins to authenticate with Google Sheets.
    - Interface to specify sheet IDs, ranges, and basic mapping rules.
- **Task 4.4: Basic Analytics Display**
    - Query Supabase to display simple analytics (e.g., number of interactions, common queries - if logged with sufficient detail).
- **Task 4.5: Secure Admin Access**
    - Implement authentication for the admin dashboard.

## Phase 5: Self-Learning Foundations

**Goal:** Implement initial mechanisms for the AI to learn from interactions.

- **Task 5.1: Feedback Mechanism in Chat Widget**
    - Add a simple user feedback system (e.g., thumbs up/down on responses).
    - Store this feedback in Supabase alongside the conversation log.
- **Task 5.2: Chat History Analysis (Basic)**
    - Develop scripts or backend processes to analyze stored chat history from Supabase.
    - Identify common unanswered questions or low-rated responses.
- **Task 5.3: Manual Response Review/Correction (Admin Feature)**
    - Add a feature in the admin dashboard for admins to review conversations and manually correct or suggest better responses for flagged interactions.
    - Store these corrections/suggestions in a way that can be used for future response improvement (e.g., a separate knowledge base table).
- **Task 5.4: Knowledge Base Management (Initial)**
    - Simple interface in admin panel to add/edit static Q&A pairs or documents the AI can use, supplementing Google Sheets.

## Phase 6: Multi-Platform Adapters (Iterative Development)

**Goal:** Extend the AI Agent's reach to multiple messaging platforms.

- **Task 6.1: Core Engine Abstraction Review**
    - Ensure the core NLU, Q&A, and learning logic is sufficiently abstracted from any single platform.
- **Task 6.2: Develop Platform Adapters (Prioritized List)**
    - For each platform (Discord, Email, Facebook Messenger, Google Assistant, Skype, Telegram, Telephone/IVR, WhatsApp):
        - Research platform-specific APIs/SDKs.
        - Develop an adapter module to handle incoming messages from the platform and send responses from the core engine.
        - Map platform-specific user identifiers and message formats.
        - Test thoroughly on each platform.
    - This will be an iterative process, likely starting with 1-2 key platforms after the website widget.

## Phase 7: Advanced Features, Refinements, and Testing

**Goal:** Enhance functionality, improve performance, and ensure reliability.

- **Task 7.1: Proactive Engagement (Optional Feature)**
    - Design and implement logic for proactive chat initiation on websites based on triggers (time on page, specific page visited).
- **Task 7.2: Enhanced Learning Algorithms**
    - Explore more sophisticated techniques for response improvement based on aggregated data and feedback (e.g., fine-tuning embeddings, simple reinforcement learning signals).
- **Task 7.3: Comprehensive Testing**
    - Unit tests for all modules.
    - Integration tests for service interactions.
    - End-to-end testing for user flows.
    - Performance and load testing.
- **Task 7.4: Scalability and Reliability Enhancements**
    - Review architecture for scalability bottlenecks.
    - Implement robust error handling and fault tolerance (e.g., if Google Sheets is down).
- **Task 7.5: Security Audit & Hardening**
    - Review for security vulnerabilities (OWASP Top 10).
    - Ensure PII handling complies with regulations.

## Phase 8: Deployment & Monitoring

**Goal:** Deploy the application to production and set up monitoring.

- **Task 8.1: Environment Setup**
    - Configure development, staging, and production environments.
- **Task 8.2: CI/CD Pipeline Implementation**
    - Automate build, test, and deployment processes (e.g., using GitHub Actions).
- **Task 8.3: Deployment to Production**
    - Deploy backend services, frontend widget, and admin panel.
- **Task 8.4: Logging & Monitoring Setup**
    - Implement comprehensive application logging.
    - Set up monitoring tools for system health, performance, and API usage (e.g., Prometheus, Grafana, or cloud provider tools).

This plan will be reviewed and updated as the project progresses.
