from pydantic import BaseModel

class POISchema(BaseModel):
    id: int
    name: str
    description: str
    lat: float
    lon: float

    class Config:
        orm_mode = True
