from app.core.config import settings

Z_IMAGE_MODEL = settings.Z_IMAGE_MODEL
# 720x1680 ( 9:21 )
# Updated constants for new API
DEFAULT_HEIGHT = 720
DEFAULT_WIDTH = 1680
DEFAULT_NUM_INFERENCE_STEPS = 9
DEFAULT_SEED = 42

# Keep old constants for backward compatibility (will be parsed)
DEFAULT_RESOLUTION = settings.Z_IMAGE_DEFAULT_RESOLUTION
DEFAULT_STEPS = settings.Z_IMAGE_DEFAULT_STEPS
DEFAULT_SHIFT = settings.Z_IMAGE_DEFAULT_SHIFT