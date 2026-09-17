import random


def predict_risk(features):
    """
    Temporary prediction function.

    This will later be replaced by the trained
    PREG-AI ML model.

    The current output is only for UI/backend development.
    """

    risk_score = random.randint(10, 40)

    if risk_score < 35:
        risk_level = "LOW"

    elif risk_score < 65:
        risk_level = "MODERATE"

    else:
        risk_level = "HIGH"

    confidence = round(
        random.uniform(0.70, 0.95),
        2
    )

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "confidence": confidence
    }