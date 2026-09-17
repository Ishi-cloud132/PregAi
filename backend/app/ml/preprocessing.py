import numpy as np


def prepare_features(features: dict):
    """
    Convert extracted features into a numerical
    vector that can later be passed to the ML model.
    """

    feature_vector = np.array([
        features["rms"],
        features["peak_amplitude"],
        features["snr"],
        features["contraction_duration"],
        features["rise_time"],
        features["fall_time"]
    ])

    return feature_vector.reshape(1, -1)