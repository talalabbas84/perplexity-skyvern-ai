# Perplexity Integration App

This application integrates **Perplexity's UI** into a custom interface using **Skyvern**, a tool for automating browser-based workflows with LLMs (Large Language Models) and computer vision. Instead of directly using Perplexity's API, this app leverages Skyvern's automation capabilities to interact with Perplexity's UI, simulating user inputs and extracting responses.

## Features

- **Browser-Based Automation**: Automates Perplexity’s UI using Skyvern, eliminating the need for direct API access.
- **Real-Time Queries**: Users can input queries, which the app sends to Perplexity's search interface via automation.
- **Customizable LLM Provider Configuration**: Easily set up and manage API keys for different LLM providers, including OpenAI, Anthropic, and Azure.
- **Modular Architecture**: Follows SOLID principles, making the codebase extensible and maintainable.
- **Dockerized Setup**: Runs seamlessly in a Dockerized environment, ensuring consistent deployment and configuration.

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Python 3.11
- Node.js (for frontend)
- **Skyvern**: Skyvern is the core library used for browser automation, allowing this app to interact with Perplexity’s UI in real-time.

### Setup Instructions

1. **Clone the Repository**:
    ```bash
    git clone <repository_url>
    cd <repository_name>
    ```

2. **Set Up Environment Variables**:
    - Copy the example `.env` files and configure them as needed:
      ```bash
      cp .env.example .env
      cp skyvern-frontend/.env.example skyvern-frontend/.env
      ```
    - Fill in the `.env` file with API keys for the LLM providers (e.g., OpenAI, Anthropic) if applicable.

3. **Docker Setup**:
    - The application is configured to run in Docker. Use Docker Compose to build and run the services.

    ```bash
    docker-compose up --build
    ```

### Application Structure

- **`backend/skyvern`**: Contains the Skyvern backend, which performs the main automation tasks. It includes custom scripts to manage queries and organization creation.
- **`skyvern-frontend`**: A React-based frontend application that provides a simple UI for users to input queries and view responses from Perplexity via Skyvern.

### Key Files and Scripts

- **SkyvernService.py**: A service class that handles the interaction with Perplexity by sending automated actions via Skyvern.
- **Dockerfile** and **docker-compose.yml**: Configurations to run the entire application stack in containers.

### Usage

1. **Access the Frontend**:
   After starting the Docker containers, you can access the frontend UI at [http://localhost:3000](http://localhost:3000).

2. **Sending a Query**:
   - Input your query into the search field.
   - The app will send this query to Perplexity’s UI by automating browser actions with Skyvern, capturing the response, and displaying it in the frontend.

3. **Monitoring Automation**:
   - If you have Streamlit set up, you can monitor Skyvern’s interactions with Perplexity’s UI in real-time at [http://localhost:8501](http://localhost:8501).

### Configuration Options


#### Environment Variables
- `DATABASE_STRING`: Connection string for PostgreSQL.
- `BROWSER_TYPE`: Configures the browser for automation (default: `chromium-headful`).
- `VITE_WSS_BASE_URL`: WebSocket URL for Skyvern UI.
- `VITE_API_BASE_URL`: API base URL for interacting with Skyvern services.

### Development and Debugging

1. **Dynamic Queries in Frontend**:
   - The frontend uses a custom hook (`useChat`) to dynamically update the conversation and manage interactions.
   - The hook sends user input to Skyvern’s automated workflows, capturing and displaying the response from Perplexity.

2. **SOLID Principles**:
   - This app follows SOLID principles:
     - **Single Responsibility**: Services are modular, with each class or function handling a single task.
     - **Dependency Injection**: API keys and other dependencies are injected through environment variables for flexibility.

### Troubleshooting

- **Port Conflicts**: Ensure ports `5432`, `8000`, `8080`, `3000`, and `8501` are not in use by other applications.
- **Docker Errors**: If Docker fails to start, ensure Docker Desktop is running and restart the services:
  ```bash
  docker-compose down
  docker-compose up --build
