"""
InfluxDB query helper used by the AI service endpoints.
Reads energy telemetry written by seed_influxdb.py / seed.js.
"""
import os
import sys
import pandas as pd
import asyncio

# Support running directly (add project root to path)
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from influxdb_client import InfluxDBClient
from influx_config import INFLUX_URL, INFLUX_TOKEN, INFLUX_ORG, INFLUX_BUCKET


# ── UUID → short-ID translation map ──────────────────────────────────────────
# InfluxDB was seeded with short IDs (bld-001…bld-010).
# The frontend passes long Supabase UUIDs — we translate here so both work.
_UUID_TO_SHORT = {
    "b2d00111-2000-4000-8000-000000000001": "bld-001",
    "b2d00111-2000-4000-8000-000000000002": "bld-002",
    "b2d00111-2000-4000-8000-000000000003": "bld-003",
    "b2d00111-2000-4000-8000-000000000004": "bld-004",
    "b2d00111-2000-4000-8000-000000000005": "bld-005",
    "b2d00111-2000-4000-8000-000000000006": "bld-006",
    "b2d00111-2000-4000-8000-000000000007": "bld-007",
    "b2d00111-2000-4000-8000-000000000008": "bld-008",
    "b2d00111-2000-4000-8000-000000000009": "bld-009",
    "b2d00111-2000-4000-8000-000000000010": "bld-010",
    # ── Real Supabase buildings (manually created before seeding) ─────────
    "fcb9cbfc-861a-4b6f-a108-c670770ef49e": "bld-001",   # essourour
    "2268e3de-540a-4597-9c2d-667f03bb769c": "bld-002",   # FIRAS DEL
    "7ed21b78-a6c1-44d5-aa75-fb20d4923d40": "bld-003",   # Amal
    "51e81860-1748-4430-b17a-69890b199bb6": "bld-004",   # cafe chicha
}
# Allow short IDs and building_X to pass through unchanged
for _s in [f"bld-{i:03d}" for i in range(1, 11)] + [f"building_{i}" for i in range(1, 5)]:
    _UUID_TO_SHORT.setdefault(_s, _s)


def _resolve_id(building_id: str) -> str:
    """Return the InfluxDB short tag value for a given building identifier."""
    return _UUID_TO_SHORT.get(building_id, building_id)


def _get_recent_data_sync(building_id: str, device_id: str = None, hours: int = 24) -> pd.DataFrame:
    """Synchronous helper – runs inside a thread when called from async context."""
    client = InfluxDBClient(url=INFLUX_URL, token=INFLUX_TOKEN, org=INFLUX_ORG)
    query_api = client.query_api()

    start_time = f"-{hours}h"
    influx_building_id = _resolve_id(building_id)
    print(f"[InfluxDB] Querying building_id='{influx_building_id}' for last {hours}h")

    # NOTE: measurement is "energy_readings" (plural) as written by seed.js
    query = f'''
from(bucket: "{INFLUX_BUCKET}")
  |> range(start: {start_time})
  |> filter(fn: (r) => r["_measurement"] == "energy_readings")
  |> filter(fn: (r) => r["building_id"] == "{influx_building_id}")
'''
    if device_id:
        query += f'  |> filter(fn: (r) => r["device_id"] == "{device_id}")\n'

    query += '  |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")'

    _EMPTY_COLS = [
        'timestamp', 'device_id', 'power', 'power_kwh', 'current',
        'voltage', 'power_factor', 'hour', 'day_of_week', 'month',
        'is_weekend', 'is_holiday', 'temperature'
    ]

    try:
        tables = query_api.query_data_frame(query)
    except Exception as e:
        print(f"[InfluxDB] Query error: {e}")
        return pd.DataFrame(columns=_EMPTY_COLS)
    finally:
        client.close()

    # Handle list-of-frames returned when multiple series exist
    if isinstance(tables, list):
        df = pd.concat(tables, ignore_index=True) if tables else pd.DataFrame()
    else:
        df = tables

    if df.empty:
        print(f"[InfluxDB] No data found for building_id='{influx_building_id}'")
        return pd.DataFrame(columns=_EMPTY_COLS)

    print(f"[InfluxDB] Got {len(df)} rows for '{influx_building_id}'")

    # ── Map raw field names → names expected by the ML models ──────────────
    if '_time' in df.columns:
        df['timestamp'] = pd.to_datetime(df['_time'], utc=True)
        df.drop(columns=['_time'], inplace=True, errors='ignore')

    # Normalise W → kW if needed
    if 'power_w' in df.columns and 'power' not in df.columns:
        df['power'] = df['power_w'] / 1000.0
    if 'voltage_v' in df.columns and 'voltage' not in df.columns:
        df['voltage'] = df['voltage_v']
    if 'current_a' in df.columns and 'current' not in df.columns:
        df['current'] = df['current_a']

    # power_kwh: seed.js writes it directly; fallback to power column
    if 'power_kwh' not in df.columns:
        df['power_kwh'] = df.get('power', pd.Series(dtype=float))

    # Temporal features
    df['hour']        = df['timestamp'].dt.hour
    df['day_of_week'] = df['timestamp'].dt.dayofweek
    df['month']       = df['timestamp'].dt.month
    df['is_weekend']  = df['day_of_week'].isin([5, 6]).astype(int)

    if 'power_factor' not in df.columns:
        df['power_factor'] = 0.90
    if 'is_holiday' not in df.columns:
        df['is_holiday'] = 0
    if 'temperature' not in df.columns:
        df['temperature'] = 25.0
    if 'device_id' not in df.columns:
        df['device_id'] = device_id or 'unknown'

    required_cols = [
        'timestamp', 'device_id', 'power', 'power_kwh', 'current',
        'voltage', 'power_factor', 'hour', 'day_of_week', 'month',
        'is_weekend', 'is_holiday', 'temperature'
    ]
    available = [c for c in required_cols if c in df.columns]
    return df[available]


async def get_recent_data(building_id: str, device_id: str = None, hours: int = 24) -> pd.DataFrame:
    """Async wrapper – offloads the blocking InfluxDB call to a thread."""
    return await asyncio.to_thread(_get_recent_data_sync, building_id, device_id, hours)
