from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import health
from app.api.routes import signals
from app.api.routes import predictions


app = FastAPI(
    title="PREG-AI Backend",
    description="EHG-based pregnancy monitoring and preterm-risk assessment API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    health.router,
    prefix="/api"
)

app.include_router(
    signals.router,
    prefix="/api"
)

app.include_router(
    predictions.router,
    prefix="/api"
)


@app.get("/")
def root():
    return {
        "project": "PREG-AI",
        "status": "running",
        "version": "1.0.0",
        "message": "PREG-AI backend is running successfully"
    }