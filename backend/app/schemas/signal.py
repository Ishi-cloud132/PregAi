from pydantic import BaseModel
from typing import List


class SignalChannels(BaseModel):
    EHG1: List[float]
    EHG2: List[float]
    EHG3: List[float]
    TOCO: List[float]


class SignalResponse(BaseModel):
    sampling_rate: int
    duration_seconds: int
    timestamp: str
    channels: SignalChannels