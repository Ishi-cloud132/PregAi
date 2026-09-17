import numpy as np
from datetime import datetime, timezone


SAMPLING_RATE = 20


def generate_ehg_signal(
    duration_seconds: int = 60,
    sampling_rate: int = SAMPLING_RATE
):
    """
    Generate simulated EHG data for development.

    IMPORTANT:
    This is synthetic data only.
    It is NOT real physiological data and
    must NOT be used for clinical decisions.
    """

    number_of_samples = duration_seconds * sampling_rate

    time = np.arange(number_of_samples) / sampling_rate

    # --------------------------------------------------
    # Base uterine electrical activity simulation
    # --------------------------------------------------

    base_signal = (
        0.018 * np.sin(2 * np.pi * 0.08 * time)
        + 0.010 * np.sin(2 * np.pi * 0.20 * time)
        + 0.005 * np.sin(2 * np.pi * 0.40 * time)
    )

    # --------------------------------------------------
    # Small random noise
    # --------------------------------------------------

    noise = np.random.normal(
        loc=0.0,
        scale=0.0025,
        size=number_of_samples
    )

    ehg1 = base_signal + noise

    # Slightly different simulated channels
    ehg2 = (
        0.90 * base_signal
        + np.random.normal(
            0,
            0.0025,
            number_of_samples
        )
    )

    ehg3 = (
        1.10 * base_signal
        + np.random.normal(
            0,
            0.0025,
            number_of_samples
        )
    )

    # --------------------------------------------------
    # Simulated TOCO signal
    # --------------------------------------------------

    toco = (
        0.30
        + 0.05 * np.sin(
            2 * np.pi * 0.03 * time
        )
        + np.random.normal(
            0,
            0.01,
            number_of_samples
        )
    )

    return {
        "sampling_rate": sampling_rate,
        "duration_seconds": duration_seconds,
        "timestamp": datetime.now(
            timezone.utc
        ).isoformat(),

        "channels": {
            "EHG1": ehg1.tolist(),
            "EHG2": ehg2.tolist(),
            "EHG3": ehg3.tolist(),
            "TOCO": toco.tolist()
        }
    }


def get_latest_signal():
    """
    Return a fresh simulated signal.
    """

    return generate_ehg_signal(
        duration_seconds=30,
        sampling_rate=20
    )


def get_patient_data():
    """
    Temporary patient/session information
    for frontend development.
    """

    return {
        "patient_id": "PT-001",
        "session_id": "SESSION-001",
        "age": 26,
        "gestational_age_weeks": 34,
        "monitoring_status": "ACTIVE"
    }