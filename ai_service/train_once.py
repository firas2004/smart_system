import asyncio
import logging
from db.influx_client import get_recent_data
from models.prediction_model import EnergyPredictionModel
from models.anomaly_detector import AnomalyDetector

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def run_training(building_id="building_1"):
    logger.info("Starting one-time training...")
    
    # Fetch 14 days of data (336 hours) — matches seeded window
    data = await get_recent_data(building_id, hours=336)
    
    if len(data) < 100:
        logger.warning(f"Not enough data to train for {building_id} ({len(data)} rows). Needs at least a few hundred rows.")
        return
        
    logger.info(f"Fetched {len(data)} rows for {building_id}.")
    
    # Train prediction model
    logger.info("Training Energy Prediction Model...")
    pred_model = EnergyPredictionModel()
    pred_metrics = pred_model.train(data, epochs=10) # 10 epochs for quick training setup
    pred_model.save(f"./models/lstm")
    
    # Train anomaly model
    logger.info("Training Anomaly Detector...")
    anomaly_model = AnomalyDetector()
    anomaly_metrics = anomaly_model.train(data)
    anomaly_model.save(f"./models/anomaly")
    
    logger.info("Training Complete!")
    logger.info(f"Prediction Metrics: MAE={pred_metrics['mae']:.3f}, RMSE={pred_metrics['rmse']:.3f}")
    logger.info(f"Anomaly Metrics: anomaly_rate={anomaly_metrics['anomaly_rate']:.2%}")

if __name__ == "__main__":
    asyncio.run(run_training("building_1"))
