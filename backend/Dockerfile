FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements.txt file into the container
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire Flask application into the container
COPY . .

# Expose the port that Flask will run on
EXPOSE 5000

# Set environment variables for the Skyvern API
ENV SKYVERN_API_BASE_URL=http://localhost:8000/api/v1
ENV SKYVERN_API_KEY=skyvern-api-key

# Enable Flask hot-reloading
ENV FLASK_ENV=development

# Command to run the Flask app with hot-reloading
CMD ["flask", "run", "--host=0.0.0.0", "--reload"]
