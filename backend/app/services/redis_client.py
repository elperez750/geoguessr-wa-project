"""
Redis Client Module

This module initializes and provides the Redis client used for caching
in the GeoGuessr-WA application.

This version is configured to securely connect to cloud providers like Upstash
by enabling SSL/TLS.
"""

import redis
import os

# Get the Redis connection URL from the environment variables.
# This will use the URL you set on Render (from Upstash).
REDIS_URL = os.getenv("REDIS_URL")

redis_client = None

# Only proceed if the REDIS_URL is actually set in the environment.
if REDIS_URL:
    try:
        print(f"Attempting to connect to Redis at: {REDIS_URL}")

        # Initialize the Redis client from the URL.
        # The key addition is `ssl=True` to enable the secure connection required by Upstash.
        # `decode_responses=True` is added for convenience to return strings instead of bytes.
        redis_client = redis.from_url(
            REDIS_URL,
            decode_responses=True,
            ssl=True  # THIS IS THE FIX
        )

        # Ping the server to confirm the connection is live.
        redis_client.ping()
        print("Successfully connected to Redis.")

    except redis.exceptions.ConnectionError as e:
        # This block will run if the connection fails, providing a clear error message.
        print(f"CRITICAL: Could not connect to Redis. Error: {e}")
        redis_client = None
else:
    # This will run if the REDIS_URL is missing in the environment.
    print("CRITICAL: REDIS_URL environment variable not found. Using local fallback.")
    # Fallback to a local connection if running locally without the env var set.
    redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

# Other parts of your application can now import `redis_client`.

