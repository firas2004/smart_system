"""
InfluxDB connection configuration.
Override any value via environment variables.
"""
import os

INFLUX_URL    = os.getenv("INFLUXDB_URL",    "http://localhost:8086")
INFLUX_TOKEN  = os.getenv("INFLUXDB_TOKEN",  "my-super-secret-token")
INFLUX_ORG    = os.getenv("INFLUXDB_ORG",    "SmartEnergyOrg")
INFLUX_BUCKET = os.getenv("INFLUXDB_BUCKET", "energy_telemetry")
