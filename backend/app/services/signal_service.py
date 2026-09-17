from app.data.dummy_data import get_latest_signal


def fetch_latest_signal():
    """
    Temporary signal source.

    CURRENT:
        Dummy generated EHG data

    FUTURE:
        Firebase / ESP32 hardware data
    """

    signal = get_latest_signal()

    return signal