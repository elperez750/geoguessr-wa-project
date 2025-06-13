"""
Redis Client Module

This module initializes and provides the Redis client used for caching
in the GeoGuessr-WA application.

This version is configured to securely connect to cloud providers like Upstash
by modifying the URL scheme to 'rediss' for older library compatibility.
"""

import redis
import os

# Get the Redis connection URL from the environment variables.
REDIS_URL = os.getenv("REDIS_URL")

redis_client = None

# Only proceed if the REDIS_URL is actually set in the environment.
if REDIS_URL:
    try:
        # THE FIX IS HERE: Replace 'redis://' with 'rediss://' to force SSL.
        # This is the compatible way to enable SSL on older redis-py versions
        # that don't support the 'ssl=True' keyword argument.
        if REDIS_URL.startswith("redis://"):
            secure_redis_url = REDIS_URL.replace("redis://", "rediss://", 1)
        else:
            secure_redis_url = REDIS_URL

        print(f"Attempting to connect to Redis with secure URL: {secure_redis_url}")

        # Initialize the client from the modified URL.
        redis_client = redis.from_url(
            secure_redis_url,
            decode_responses=True
        )

        # Ping the server to confirm the connection is live.
        redis_client.ping()
        print("Successfully connected to Redis.")

    except redis.exceptions.ConnectionError as e:
        print(f"CRITICAL: Could not connect to Redis. Error: {e}")
        redis_client = None
    except Exception as e:
        # Catch other potential errors during startup
        print(f"An unexpected error occurred during Redis initialization: {e}")
        redis_client = None
else:
    # This will run if the REDIS_URL is missing in the environment.
    print("CRITICAL: REDIS_URL environment variable not found. Using local fallback.")
    redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

