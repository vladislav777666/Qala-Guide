from fastapi import APIRouter, Query
from typing import List
from ..schemas.poi import POISchema
from ..models.poi import POI
from ..database import AsyncSessionLocal
from sqlalchemy.future import select
from math import radians, cos, sin, asin, sqrt

router = APIRouter()

def haversine(lat1, lon1, lat2, lon2):
    # Радиус Земли в километрах
    R = 6371.0
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    c = 2 * asin(sqrt(a))
    return R * c

@router.get("/poi/nearby", response_model=List[POISchema])
async def get_nearby_pois(
    lat: float = Query(...),
    lon: float = Query(...),
    radius: float = Query(1.0)  # Радиус в километрах
):
    # Грубая фильтрация по квадрату (экономит вычисления)
    delta = radius / 111  # ~1 градус = 111 км
    min_lat, max_lat = lat - delta, lat + delta
    min_lon, max_lon = lon - delta, lon + delta

    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(POI).where(
                POI.lat >= min_lat,
                POI.lat <= max_lat,
                POI.lon >= min_lon,
                POI.lon <= max_lon
            )
        )
        pois = result.scalars().all()

        def is_near(p):
            return haversine(lat, lon, p.lat, p.lon) <= radius

        nearby = list(filter(is_near, pois))
        return nearby
