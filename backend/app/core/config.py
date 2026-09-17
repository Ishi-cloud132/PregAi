from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    PROJECT_NAME: str = "PREG-AI"

    API_VERSION: str = "1.0.0"

    ENVIRONMENT: str = "development"

    # Firebase placeholders
    FIREBASE_PROJECT_ID: str = ""

    FIREBASE_CLIENT_EMAIL: str = ""

    FIREBASE_PRIVATE_KEY: str = ""

    class Config:

        env_file = ".env"


settings = Settings()