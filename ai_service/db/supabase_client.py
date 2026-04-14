import os
import asyncio
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY") or os.getenv("VITE_SUPABASE_PUBLISHABLE_KEY")

def _get_building_data_sync(building_id: str) -> dict:
    if not SUPABASE_URL or not SUPABASE_KEY:
        # Fallback missing credentials
        return _mock_building(building_id)
        
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    response = supabase.table('buildings').select('*').eq('building_id', building_id).execute()
    data = response.data
    
    if not data:
        return _mock_building(building_id)
        
    return data[0]

def _get_all_buildings_sync() -> list:
    if not SUPABASE_URL or not SUPABASE_KEY:
        # Fallback missing credentials
        return [_mock_building("bldg_001")]
        
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    response = supabase.table('buildings').select('*').execute()
    data = response.data
    
    if not data:
        return [_mock_building("bldg_001")]
        
    return data

def _mock_building(building_id: str) -> dict:
    return {
        "building_id": building_id,
        "name": f"Building {building_id}",
        "devices": {
            f"{building_id}_dev_001": { "name": "Water Heater", "type": "water_heater" },
            f"{building_id}_dev_002": { "name": "Washing Machine", "type": "washing_machine" }
        }
    }

async def get_building_data(building_id: str) -> dict:
    """Fetch building data from Supabase asynchronously."""
    return await asyncio.to_thread(_get_building_data_sync, building_id)

async def get_all_buildings() -> list:
    """Fetch all buildings from Supabase asynchronously."""
    return await asyncio.to_thread(_get_all_buildings_sync)
