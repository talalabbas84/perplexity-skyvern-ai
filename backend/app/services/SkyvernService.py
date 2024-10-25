import os
import requests
import logging
import json

class SkyvernService:
    def __init__(self):
        self.skyvern_api_base_url = os.getenv('SKYVERN_API_URL', 'http://host.docker.internal:8000/api/v1')
        self.skyvern_api_key = os.getenv('SKYVERN_API_KEY', 'your_skyvern_api_key')
        logging.info(f"Skyvern API base URL set to: {self.skyvern_api_base_url}")

    def query_perplexity(self, query):
        try:
            api_url = f"{self.skyvern_api_base_url}/tasks"
            payload = {
                "url": "https://www.perplexity.ai/",
                "webhook_callback_url": None,
                "navigation_goal": (
                    f"Navigate to the Perplexity AI homepage. Enter the question '{query}' in the search box, and click submit. "
                    "Retrieve only the main answer displayed and explicit sources cited for this answer. "
                    "Exclude related search suggestions or autocomplete options. "
                    "COMPLETE when the answer and its citations are extracted, or TERMINATE if only unrelated suggestions are found."
                ),
                "data_extraction_goal": json.dumps({
                    "sources": {
                        "type": "array",
                        "description": "Extract list of valid URLs only, representing explicit citations for the answer.",
                        "items": {"type": "string"}
                    },
                    "answer": {
                        "type": "string",
                        "description": "Extract only the main answer to the question, excluding extraneous text."
                    }
                }),
                "proxy_location": "RESIDENTIAL",
                "navigation_payload": json.dumps({"query": query}),
                "extracted_information_schema": json.dumps({
                    "sources": {
                        "type": "array",
                        "items": {"type": "string"}
                    },
                    "answer": {"type": "string"}
                })
            }

            headers = {'Content-Type': 'application/json', 'x-api-key': self.skyvern_api_key}
            response = requests.post(api_url, json=payload, headers=headers)

            if response.status_code == 200:
                return response.json()  # Expected to contain 'task_id'
            else:
                logging.error(f'Skyvern API returned an error: {response.status_code}, {response.text}')
                return {}
        except requests.exceptions.RequestException as e:
            logging.error(f'HTTP request to Skyvern API failed: {e}')
            raise Exception('Failed to connect to Skyvern API.')

    def poll_task_status(self, task_id):
        try:
            api_url = f"{self.skyvern_api_base_url}/tasks/{task_id}"
            headers = {'x-api-key': self.skyvern_api_key}
            response = requests.get(api_url, headers=headers)

            if response.status_code == 200:
                return response.json()
            else:
                logging.error(f'Skyvern API returned an error while polling: {response.status_code}, {response.text}')
                return {}
        except requests.exceptions.RequestException as e:
            logging.error(f'HTTP request to poll Skyvern API failed: {e}')
            raise Exception('Failed to connect to Skyvern API.')
