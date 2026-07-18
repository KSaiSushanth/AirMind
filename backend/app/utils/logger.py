import logging
import sys

def setup_logger():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s - %(filename)s:%(lineno)d - %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    # Reduce noise from third-party libraries
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("motor").setLevel(logging.WARNING)

logger = logging.getLogger("airmind")
