# Use the official Python image
FROM python:latest

# Set the working directory in the container
WORKDIR /app/backend

# Copy the requirements file to install dependencies
COPY ./requirements.txt .

# Install Python dependencies
RUN pip install -r requirements.txt

# Copy the rest of the application code
COPY . .