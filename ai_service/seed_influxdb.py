"""
seed_influxdb.py — Seeds InfluxDB with realistic, multi-tenant energy telemetry.

Creates data for:
  • 3 clients, each owning 1-2 buildings
  • Each building has 2-4 devices of different types
  • 10+ days of hourly readings (enough for LSTM's 168-hour window)

Run once:
    python seed_influxdb.py
"""

import os, sys, math, random
from datetime import datetime, timedelta, timezone

# Ensure imports work when running from the ai_service directory
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from influxdb_client import InfluxDBClient, Point
from influxdb_client.client.write_api import SYNCHRONOUS
from influx_config import INFLUX_URL, INFLUX_TOKEN, INFLUX_ORG, INFLUX_BUCKET

# ──────────────────────────────────────────────────────────────────────────────
# Tenant / device topology
# ──────────────────────────────────────────────────────────────────────────────
TOPOLOGY = {
    "client_alpha": {
        "building_1": [
            {"device_id": "water_heater_01",    "type": "water_heater",    "base_w": 2500, "standby_w": 40},
            {"device_id": "washing_machine_01", "type": "washing_machine", "base_w": 1800, "standby_w": 5},
            {"device_id": "hvac_01",            "type": "hvac",            "base_w": 3500, "standby_w": 60},
            {"device_id": "lighting_01",        "type": "lighting",        "base_w": 400,  "standby_w": 10},
        ],
        "building_2": [
            {"device_id": "water_heater_02",    "type": "water_heater",    "base_w": 3000, "standby_w": 50},
            {"device_id": "hvac_02",            "type": "hvac",            "base_w": 5000, "standby_w": 80},
        ],
    },
    "client_beta": {
        "building_3": [
            {"device_id": "dishwasher_01",      "type": "dishwasher",      "base_w": 1600, "standby_w": 3},
            {"device_id": "oven_01",            "type": "oven",            "base_w": 2200, "standby_w": 5},
            {"device_id": "hvac_03",            "type": "hvac",            "base_w": 4000, "standby_w": 70},
        ],
    },
    "client_gamma": {
        "building_4": [
            {"device_id": "water_heater_03",    "type": "water_heater",    "base_w": 2000, "standby_w": 35},
            {"device_id": "washing_machine_02", "type": "washing_machine", "base_w": 2000, "standby_w": 8},
            {"device_id": "lighting_02",        "type": "lighting",        "base_w": 600,  "standby_w": 15},
            {"device_id": "fridge_01",          "type": "fridge",          "base_w": 150,  "standby_w": 120},
        ],
    },
}

DAYS_OF_DATA = 14  # 14 days → 336 hours (> 168 required by LSTM)


# ──────────────────────────────────────────────────────────────────────────────
# Power-profile helpers
# ──────────────────────────────────────────────────────────────────────────────
def _daily_activity_factor(hour: int) -> float:
    """Returns 0-1 factor mimicking human activity throughout the day."""
    # Low 00-05, ramp 06-08, moderate 09-11, peak 12-14, moderate 15-17,
    # second peak 18-21, ramp down 22-23
    profile = [
        0.10, 0.08, 0.07, 0.07, 0.08, 0.12,   # 00–05
        0.30, 0.55, 0.70, 0.65, 0.60, 0.70,   # 06–11
        0.85, 0.90, 0.80, 0.65, 0.60, 0.70,   # 12–17
        0.90, 0.95, 0.85, 0.70, 0.45, 0.25,   # 18–23
    ]
    return profile[hour]


def _device_power(dev: dict, hour: int, is_weekend: bool) -> float:
    """Simulate realistic instantaneous power draw (watts)."""
    dtype = dev["type"]
    base = dev["base_w"]
    standby = dev["standby_w"]
    activity = _daily_activity_factor(hour)

    if dtype == "fridge":
        # Runs 24/7 with compressor cycles
        return standby + random.uniform(-20, 40)

    if dtype == "lighting":
        # Only active in the evening / early morning
        if 6 <= hour <= 8 or 17 <= hour <= 23:
            return base * activity * random.uniform(0.8, 1.1)
        return standby

    if dtype == "hvac":
        # Higher on hot afternoons
        temp_factor = 1.0 + 0.3 * math.sin((hour - 6) * math.pi / 12)
        temp_factor = max(0, temp_factor)
        weekend_boost = 1.15 if is_weekend else 1.0
        return base * activity * temp_factor * weekend_boost * random.uniform(0.85, 1.1)

    if dtype in ("water_heater",):
        # Morning (06-09) and evening (18-21) peaks
        if 6 <= hour <= 9 or 18 <= hour <= 21:
            return base * random.uniform(0.7, 1.0)
        return standby

    if dtype in ("washing_machine", "dishwasher"):
        # Sporadic usage — roughly 30 % chance of running in daytime hours
        if 8 <= hour <= 20 and random.random() < 0.30:
            return base * random.uniform(0.6, 1.0)
        return standby

    if dtype == "oven":
        # Lunch (11-13) and dinner (18-20)
        if 11 <= hour <= 13 or 18 <= hour <= 20:
            if random.random() < 0.50:
                return base * random.uniform(0.5, 1.0)
        return standby

    # Fallback
    return base * activity * random.uniform(0.5, 1.0)


# ──────────────────────────────────────────────────────────────────────────────
# Point generator
# ──────────────────────────────────────────────────────────────────────────────
def generate_points() -> list:
    """Generate all InfluxDB Point objects."""
    points = []
    end_time = datetime.now(timezone.utc)
    start_time = end_time - timedelta(days=DAYS_OF_DATA)

    for _client_name, buildings in TOPOLOGY.items():
        for building_id, devices in buildings.items():
            current = start_time
            while current <= end_time:
                hour = current.hour
                dow = current.weekday()
                is_weekend = dow >= 5

                for dev in devices:
                    power_w = _device_power(dev, hour, is_weekend)

                    # Inject anomalies (≈1.5 % of readings)
                    anomaly = random.random()
                    power_factor = round(random.uniform(0.85, 0.98), 3)
                    if anomaly < 0.005:
                        power_w *= random.uniform(3.0, 5.0)        # sudden spike
                    elif anomaly < 0.010 and hour >= 23:
                        power_w = dev["base_w"] * random.uniform(0.8, 1.2)  # night over-consumption
                    elif anomaly < 0.015:
                        power_factor = round(random.uniform(0.45, 0.60), 3) # poor PF

                    voltage = round(230.0 + random.uniform(-6, 6), 2)
                    current_a = round(power_w / (voltage * power_factor * 1.732), 3)

                    point = (
                        Point("energy_reading")
                        .tag("building_id", building_id)
                        .tag("device_id", dev["device_id"])
                        .field("power_w", int(round(power_w)))
                        .field("voltage_v", int(round(voltage)))
                        .field("current_a", round(current_a, 3))
                        .field("power_factor", round(power_factor, 3))
                        .field("hour_of_day", hour)
                        .time(current)
                    )
                    points.append(point)

                current += timedelta(hours=1)

    return points


# ──────────────────────────────────────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────────────────────────────────────
def seed():
    print(f"Connecting to InfluxDB at {INFLUX_URL}  org={INFLUX_ORG}  bucket={INFLUX_BUCKET}")
    client = InfluxDBClient(url=INFLUX_URL, token=INFLUX_TOKEN, org=INFLUX_ORG)

    # Delete old energy_reading data to avoid type conflicts
    try:
        delete_api = client.delete_api()
        delete_api.delete(
            start=datetime(2020, 1, 1, tzinfo=timezone.utc),
            stop=datetime.now(timezone.utc),
            predicate='_measurement="energy_reading"',
            bucket=INFLUX_BUCKET,
            org=INFLUX_ORG,
        )
        print("Cleared old energy_reading data.")
    except Exception as e:
        print(f"Warning: could not clear old data ({e}). Continuing anyway...")

    write_api = client.write_api(write_options=SYNCHRONOUS)

    points = generate_points()
    total = len(points)
    print(f"Generated {total} data points across {DAYS_OF_DATA} days.")

    batch_size = 500
    for i in range(0, total, batch_size):
        batch = points[i:i + batch_size]
        write_api.write(bucket=INFLUX_BUCKET, org=INFLUX_ORG, record=batch)
        done = min(i + batch_size, total)
        print(f"  [OK] wrote {done}/{total}  ({done * 100 // total}%)")

    client.close()
    print(f"\n[DONE] {total} readings seeded into '{INFLUX_BUCKET}' bucket.")
    print("Buildings seeded:", list(
        bid for buildings in TOPOLOGY.values() for bid in buildings
    ))


if __name__ == "__main__":
    seed()
