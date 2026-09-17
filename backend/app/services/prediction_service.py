import numpy as np

from app.services.signal_service import fetch_latest_signal
from app.ml.inference import predict_risk


def calculate_features(signal_data):
    """
    Calculate temporary EHG features.

    These features are for development/testing only.
    """

    ehg1 = np.array(signal_data["channels"]["EHG1"])

    # RMS
    rms = float(np.sqrt(np.mean(ehg1 ** 2)))

    # Peak amplitude
    peak_amplitude = float(np.max(np.abs(ehg1)))

    # Signal power
    signal_mean = np.mean(ehg1)
    signal_power = np.mean((ehg1 - signal_mean) ** 2)

    # Noise power
    noise_power = np.var(ehg1 - signal_mean)

    # SNR
    if noise_power > 0:
        snr = float(
            10 * np.log10(signal_power / noise_power)
        )
    else:
        snr = 0.0

    # Temporary dummy contraction features
    contraction_duration = 12.4
    rise_time = 3.2
    fall_time = 4.1

    return {
        "rms": round(rms, 6),
        "peak_amplitude": round(peak_amplitude, 6),
        "snr": round(snr, 2),
        "contraction_duration": contraction_duration,
        "rise_time": rise_time,
        "fall_time": fall_time
    }


def generate_prediction():
    """
    Generate a temporary PREG-AI prediction.

    CURRENT:
        Dummy EHG → feature extraction → dummy ML prediction

    FUTURE:
        Firebase/hardware → preprocessing → trained ML model
    """

    # 1. Get EHG signal
    signal = fetch_latest_signal()

    # 2. Extract features
    features = calculate_features(signal)

    # 3. Generate dummy ML prediction
    prediction = predict_risk(features)

    return {
        "prediction": prediction,
        "features": features
    }