# Technology Context: Self-Learning AI Agent

**Last Updated:** 2025-05-11

## 1. Core Technologies

- **AI Language Model:** Gemini-2.5-flash (accessed via OpenRouter API).
- **Backend Development:** Node.js (potentially with frameworks like Express.js) and/or Python (potentially with frameworks like Flask or FastAPI). The choice or combination will depend on specific service needs (e.g., Python for ML/NLU processing, Node.js for real-time comms).
- **Database (Chat History & Learning Data):** Supabase (PostgreSQL).
- **Frontend (Chat Widget & Admin Panel):** HTML, CSS, JavaScript. A framework like React, Vue, or Angular might be used for the admin panel for more complex UI requirements.

## 2. Integrations & APIs

- **Google Sheets API:** For real-time data retrieval. Requires OAuth 2.0 for secure authentication.
- **OpenRouter API:** To access the Gemini-2.5-flash model.
- **Supabase API/SDKs:** For database interactions.
- **Messaging Platform APIs/SDKs:** Specific to each platform to be integrated:
    - Discord: Discord.js or similar library.
    - Facebook Messenger: Messenger Platform API.
    - Google Assistant: Actions on Google SDK.
    - Skype: Bot Framework SDK.
    - Telegram: Telegram Bot API.
    - WhatsApp: WhatsApp Business API.
    - Email: SMTP/IMAP libraries.
    - Telephone/IVR: Twilio or similar CPaaS provider APIs for STT/TTS.

## 3. Development Environment & Tooling

- **Version Control:** Git (repository to be hosted on a platform like GitHub, GitLab, or Bitbucket).
- **IDE:** User's preference (e.g., VS Code, PyCharm, WebStorm).
- **Package Managers:** npm/yarn (for Node.js), pip/poetry (for Python).
- **CI/CD:** To be implemented (e.g., GitHub Actions, Jenkins, GitLab CI) for automated testing and deployment.
- **Containerization (Recommended):** Docker, for consistent environments and easier deployment.

## 4. Technical Constraints & Considerations

- **API Rate Limits:** Need to be mindful of rate limits for OpenRouter, Google Sheets, and other external APIs. Implement caching and efficient querying.
- **Security:** Secure handling of API keys, PII anonymization in logs, HTTPS for all communications, input sanitization.
- **Scalability:** Design for horizontal scaling of backend services where possible.
- **Data Privacy:** Adherence to GDPR, CCPA, and other relevant regulations.
