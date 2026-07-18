import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from app.utils.logger import logger

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Log request incoming
        logger.info(f"Incoming: {request.method} {request.url.path}")
        
        response = await call_next(request)
        
        duration = (time.time() - start_time) * 1000
        # Log response outgoing
        logger.info(f"Outgoing: {request.method} {request.url.path} - Status: {response.status_code} - Duration: {duration:.2f}ms")
        
        return response
