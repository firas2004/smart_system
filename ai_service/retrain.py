import schedule
import time
import logging
import asyncio

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def weekly_retrain():
    """Retrain models with fresh data."""
    print("🔄 Starting weekly retraining...")
    from db.supabase_client import get_all_buildings
    from db.influx_client import get_recent_data
    from models.prediction_model import EnergyPredictionModel
    from models.anomaly_detector import AnomalyDetector

    buildings = asyncio.run(get_all_buildings())
    for building in buildings:
        building_id = building.get('building_id')
        if not building_id:
            continue
            
        data = asyncio.run(get_recent_data(building_id, hours=2160))  # 90 days

        if len(data) > 1000:
            logger.info(f"Retraining models for {building_id}...")
            pred_model = EnergyPredictionModel()
            pred_model.train(data)
            pred_model.save(f"./models/lstm/{building_id}")

            anomaly_model = AnomalyDetector()
            anomaly_model.train(data)
            anomaly_model.save(f"./models/anomaly/{building_id}")

            logger.info(f"✅ Retraining complete for {building_id}")
        else:
            logger.warning(f"⚠️ Not enough data for {building_id} ({len(data)} rows)")

schedule.every().sunday.at("02:00").do(weekly_retrain)

if __name__ == "__main__":
    print("📅 Retraining scheduler started. Waiting for Sunday 02:00...")
    while True:
        schedule.run_pending()
        time.sleep(60)
