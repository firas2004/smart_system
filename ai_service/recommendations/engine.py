from datetime import datetime
from typing import List
import pandas as pd

class RecommendationEngine:
    """
    Generates optimization recommendations based on business rules
    and detected consumption patterns.
    """

    def __init__(self, electricity_rate: float = 0.30):  # TND/kWh
        self.rate = electricity_rate

    def generate(self, building_data: dict, historical_df: pd.DataFrame) -> List[dict]:
        recommendations = []
        recommendations.extend(self._check_scheduling(historical_df, building_data))
        recommendations.extend(self._check_standby_consumption(historical_df))
        recommendations.extend(self._check_peak_hours(historical_df, building_data))
        recommendations.extend(self._check_inefficient_devices(historical_df))

        recommendations.sort(key=lambda x: (
            {'high': 0, 'medium': 1, 'low': 2}.get(x['priority'], 3),
            -x.get('estimated_saving_tnd', 0)
        ))
        return recommendations[:10]

    def _check_scheduling(self, df: pd.DataFrame, building_data: dict) -> List[dict]:
        recs = []
        peak_start, peak_end = 18, 22

        for device_id in df['device_id'].unique():
            device_df = df[df['device_id'] == device_id]
            device_name = building_data.get('devices', {}).get(device_id, {}).get('name', device_id)
            device_type = building_data.get('devices', {}).get(device_id, {}).get('type', '')

            if device_type not in ['water_heater', 'washing_machine', 'dishwasher']:
                continue

            peak_mask = (
                (pd.to_datetime(device_df['timestamp']).dt.hour >= peak_start) &
                (pd.to_datetime(device_df['timestamp']).dt.hour < peak_end)
            )
            peak_consumption = device_df[peak_mask]['power'].sum() / 1000 / 12  # kWh

            if peak_consumption > 1.0:
                saving = peak_consumption * 0.30 * 0.20
                recs.append({
                    "priority": "high",
                    "category": "scheduling",
                    "title": f"Reschedule {device_name} to off-peak hours",
                    "description": f"Use {device_name} between 22:00 and 06:00 to reduce costs by 20%.",
                    "estimated_saving_kwh": round(peak_consumption * 0.20, 2),
                    "estimated_saving_tnd": round(saving, 2),
                    "action": {
                        "type": "schedule",
                        "device_id": device_id,
                        "schedule": {"start": "22:00", "stop": "06:00"}
                    }
                })
        return recs

    def _check_standby_consumption(self, df: pd.DataFrame) -> List[dict]:
        recs = []
        night_mask = (
            (pd.to_datetime(df['timestamp']).dt.hour >= 0) &
            (pd.to_datetime(df['timestamp']).dt.hour < 6)
        )

        for device_id in df['device_id'].unique():
            device_df = df[(df['device_id'] == device_id) & night_mask]
            if device_df.empty:
                continue

            avg_night_power = device_df['power'].mean()
            if avg_night_power > 50:
                monthly_waste = avg_night_power / 1000 * 6 * 30
                recs.append({
                    "priority": "medium",
                    "category": "behavior",
                    "title": f"High standby consumption ({device_id})",
                    "description": f"Device consumes {avg_night_power:.0f}W at night. Consider turning it off completely.",
                    "estimated_saving_kwh": round(monthly_waste, 1),
                    "estimated_saving_tnd": round(monthly_waste * self.rate, 2),
                    "action": {
                        "type": "schedule",
                        "device_id": device_id,
                        "schedule": {"turn_off_at": "23:30", "turn_on_at": "06:00"}
                    }
                })
        return recs

    def _check_peak_hours(self, df: pd.DataFrame, building_data: dict) -> List[dict]:
        return []  # TODO: implement peak hours global alert

    def _check_inefficient_devices(self, df: pd.DataFrame) -> List[dict]:
        return []  # TODO: implement device efficiency check
