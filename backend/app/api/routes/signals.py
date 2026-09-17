from fastapi import APIRouter
from app.services.signal_service import fetch_latest_signal

router = APIRouter(
    prefix="/signals",
    tags=["EHG Signals"]
)

@router.get("/latest")
def latest_signal():
    signal = fetch_latest_signal()

    return {
        "status": "success",
        "data": signal
    }