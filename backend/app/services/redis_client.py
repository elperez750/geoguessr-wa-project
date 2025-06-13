"""
Redis Client Module

This module initializes and provides the Redis client used for caching
in the GeoGuessr-WA application.

Features:
- Centralized Redis connection configuration
- Shared client instance for use across the application

Dependencies:
- redis-py: Python client for Redis

Usage:
- Import redis_client to access the Redis instance
- Used for caching game state, location counts, and other frequently accessed data
"""

import redis
import os

REDIS_URL = os.genenv("REDIS_URL")
# Initialize Redis client with default local connection settings
# The client is used throughout the application for caching
print(f"Attempting to connect to Redis at {REDIS_URL}...")
redis_client = redis.Redis.from_url(REDIS_URL)
