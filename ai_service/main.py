from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import Optional, List
import asyncio
import os

from models.prediction_model import EnergyPredictionModel
from models.anomaly_detector import AnomalyDetector
from recommendations.engine import RecommendationEngine
from db.influx_client import get_recent_data
from db.supabase_client import get_building_data

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Smart Energy AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models at startup if they exist
prediction_model = EnergyPredictionModel()
if os.path.exists("./models/lstm/lstm_model.h5"):
    prediction_model.load("./models/lstm")

anomaly_detector = AnomalyDetector()
if os.path.exists("./models/anomaly/isolation_forest.pkl"):
    anomaly_detector.load("./models/anomaly")

recommendation_engine = RecommendationEngine()

class PredictionRequest(BaseModel):
    building_id: str
    device_id: Optional[str] = None
    horizon: str = "24h"

@app.post("/predict")
async def predict_consumption(request: PredictionRequest):
    """Predict future energy consumption (next 24h)."""
    try:
        recent_data = await get_recent_data(request.building_id, request.device_id, hours=336)

        # Aggregate across devices: sum power metrics per hour
        if not recent_data.empty and 'timestamp' in recent_data.columns:
            recent_data['timestamp'] = recent_data['timestamp'].dt.floor('h')
            agg = recent_data.groupby('timestamp').agg({
                'power': 'sum',
                'power_kwh': 'sum',
                'current': 'sum',
                'voltage': 'mean',
                'power_factor': 'mean',
                'temperature': 'mean',
                'is_holiday': 'first',
            }).reset_index()
            agg['device_id'] = request.device_id or 'all'
            agg['hour'] = agg['timestamp'].dt.hour
            agg['day_of_week'] = agg['timestamp'].dt.dayofweek
            agg['month'] = agg['timestamp'].dt.month
            agg['is_weekend'] = agg['day_of_week'].isin([5, 6]).astype(int)
            recent_data = agg

        result = prediction_model.predict(recent_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/anomalies/{building_id}")
async def detect_anomalies(building_id: str, hours: int = 24):
    """Detect anomalies in recent sensor data."""
    try:
        recent_data = await get_recent_data(building_id, hours=hours)
        anomalies = anomaly_detector.detect(recent_data)
        return {"building_id": building_id, "anomalies": anomalies, "total": len(anomalies)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/recommendations/{building_id}")
async def get_recommendations(building_id: str):
    """Generate optimization recommendations for a building."""
    try:
        building_data = await get_building_data(building_id)
        historical_data = await get_recent_data(building_id, hours=720)  # 30 days
        recs = recommendation_engine.generate(building_data, historical_data)
        return {"building_id": building_id, "recommendations": recs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/train/{building_id}")
async def trigger_training(building_id: str, background_tasks: BackgroundTasks):
    """Trigger background model retraining for a building."""
    background_tasks.add_task(retrain_models, building_id)
    return {"message": "Training started in background"}

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "models": {
            "prediction": prediction_model.is_trained,
            "anomaly": anomaly_detector.is_trained
        }
    }

async def retrain_models(building_id: str):
    """Background task: retrain all models for a given building."""
    import logging
    logger = logging.getLogger(__name__)
    logger.info(f"Retraining models for building {building_id}...")
    data = await get_recent_data(building_id, hours=2160)  # 90 days
    if len(data) > 1000:
        prediction_model.train(data)
        anomaly_detector.train(data)
        prediction_model.save(f"./models/lstm/{building_id}")
        anomaly_detector.save(f"./models/anomaly/{building_id}")
        logger.info(f"Retraining complete for {building_id}")

@app.get("/dashboard", response_class=HTMLResponse)
async def simple_dashboard():
    """A built-in HTML dashboard to visualize predictions and data on port 8000."""
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>AI Service Data Visualizer</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
            body { font-family: -apple-system, sans-serif; background: #0f172a; color: #e2e8f0; padding: 20px; }
            .container { max-width: 1000px; margin: 0 auto; }
            .card { background: #1e293b; padding: 20px; border-radius: 10px; margin-top: 20px; }
            h1 { color: #38bdf8; }
            button { background: #8b5cf6; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
            button:hover { background: #7c3aed; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>AI Service API Insights</h1>
            <p>This is a quick visualization of the data returning from our LSTM model.</p>
            <button onclick="fetchData()">Fetch 24h Prediction for building_1</button>
            <div class="card">
                <canvas id="predictionChart"></canvas>
            </div>
            <p id="totalOutput" style="font-weight: bold; margin-top: 20px; color: #4ade80;"></p>
        </div>

        <script>
            let chart;
            async function fetchData() {
                try {
                    const response = await fetch('/predict', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ building_id: 'building_1', horizon: '24h' })
                    });
                    const result = await response.json();
                    
                    const labels = result.predictions.map(p => `Hour ${p.hour}`);
                    const data = result.predictions.map(p => p.predicted_kwh);
                    const lower = result.predictions.map(p => p.lower_bound);
                    const upper = result.predictions.map(p => p.upper_bound);

                    if(chart) chart.destroy();
                    const ctx = document.getElementById('predictionChart').getContext('2d');
                    chart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [
                                { label: 'Predicted Power (kW)', data: data, borderColor: '#a855f7', backgroundColor: 'rgba(168, 85, 247, 0.2)', borderWidth: 3, tension: 0.4 },
                                { label: 'Upper Bound', data: upper, borderColor: 'rgba(56, 189, 248, 0.5)', borderDash: [5, 5], fill: false },
                                { label: 'Lower Bound', data: lower, borderColor: 'rgba(239, 68, 68, 0.5)', borderDash: [5, 5], fill: false }
                            ]
                        },
                        options: { responsive: true, scales: { y: { beginAtZero: true } } }
                    });
                    document.getElementById('totalOutput').innerText = `Daily Total Expected: ${result.daily_total} kWh`;
                } catch (e) {
                    alert('Error fetching data. Is data seeded?');
                    console.error(e);
                }
            }
        </script>
    </body>
    </html>
    """
    return html_content
