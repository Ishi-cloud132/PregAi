from fastapi import APIRouter

from app.services.prediction_service import (
    generate_prediction
)


router = APIRouter(
    prefix="/predictions",
    tags=["AI Prediction"]
)


@router.get("/latest")
def latest_prediction():

    result = generate_prediction()

    return {
        "status": "success",

        "prediction": result[
            "prediction"
        ],

        "features": result[
            "features"
        ]
    }