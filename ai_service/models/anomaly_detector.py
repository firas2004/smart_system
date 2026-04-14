import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import joblib
import logging
import os

logger = logging.getLogger(__name__)

class AnomalyDetector:
    """
    Isolation Forest-based anomaly detector for energy consumption.
    Detects abnormal consumption behaviour per device.
    """

    def __init__(self, contamination: float = 0.05):
        self.model = IsolationForest(
            n_estimators=200,
            contamination=contamination,
            max_features=1.0,
            bootstrap=False,
            random_state=42,
            n_jobs=-1
        )
        self.scaler = StandardScaler()
        self.is_trained = False
        self.feature_stats = {}

    def extract_features(self, df: pd.DataFrame) -> pd.DataFrame:
        features = pd.DataFrame()
        features['power'] = df['power']
        features['current'] = df['current']
        features['voltage'] = df['voltage']
        features['power_factor'] = df['power_factor']
        features['hour'] = pd.to_datetime(df['timestamp']).dt.hour
        features['is_night'] = ((features['hour'] >= 23) | (features['hour'] <= 6)).astype(int)
        features['power_mean_1h'] = df['power'].rolling(12, min_periods=1).mean()
        features['power_std_1h'] = df['power'].rolling(12, min_periods=1).std().fillna(0)
        features['power_max_1h'] = df['power'].rolling(12, min_periods=1).max()
        features['power_ratio'] = features['power'] / (features['power_mean_1h'] + 1e-5)
        features['power_delta'] = df['power'].diff().fillna(0)
        features['power_delta_abs'] = features['power_delta'].abs()
        features = features.fillna(0)
        return features

    def train(self, df: pd.DataFrame):
        logger.info("Extracting features for training...")
        features = self.extract_features(df)

        self.feature_stats = {
            'power_mean': float(df['power'].mean()),
            'power_std': float(df['power'].std()),
            'power_q99': float(df['power'].quantile(0.99))
        }

        X = self.scaler.fit_transform(features.values)
        logger.info(f"Training Isolation Forest on {len(X)} samples...")
        self.model.fit(X)
        self.is_trained = True

        predictions = self.model.predict(X)
        anomaly_rate = (predictions == -1).mean()
        logger.info(f"Detected anomaly rate: {anomaly_rate:.2%}")
        return {"anomaly_rate": float(anomaly_rate), "samples": len(X)}

    def detect(self, df: pd.DataFrame) -> list:
        if not self.is_trained:
            raise ValueError("Model not trained")

        features = self.extract_features(df)
        X = self.scaler.transform(features.values)

        predictions = self.model.predict(X)
        scores = self.model.score_samples(X)

        anomalies = []
        for i, (pred, score) in enumerate(zip(predictions, scores)):
            if pred == -1:
                row = df.iloc[i]
                severity = self._compute_severity(row['power'], score)
                anomaly_type = self._classify_anomaly(row, features.iloc[i])
                anomalies.append({
                    "timestamp": str(row.get('timestamp', '')),
                    "device_id": str(row.get('device_id', '')),
                    "anomaly_score": round(float(-score), 4),
                    "severity": severity,
                    "type": anomaly_type,
                    "actual_power": float(row['power']),
                    "expected_power": float(self.feature_stats['power_mean']),
                    "deviation_percent": round(
                        abs(row['power'] - self.feature_stats['power_mean']) /
                        (self.feature_stats['power_mean'] + 1e-5) * 100, 1
                    )
                })
        return anomalies

    def _compute_severity(self, power: float, score: float) -> str:
        abs_score = abs(score)
        if abs_score > 0.7:
            return "critical"
        elif abs_score > 0.5:
            return "high"
        elif abs_score > 0.3:
            return "medium"
        else:
            return "low"

    def _classify_anomaly(self, row: pd.Series, features: pd.Series) -> str:
        if features['is_night'] and row['power'] > self.feature_stats['power_mean']:
            return "night_overconsumption"
        elif features['power_ratio'] > 3:
            return "sudden_spike"
        elif row['power_factor'] < 0.7:
            return "poor_power_factor"
        else:
            return "overconsumption"

    def save(self, path: str):
        os.makedirs(path, exist_ok=True)
        joblib.dump(self.model, f"{path}/isolation_forest.pkl")
        joblib.dump(self.scaler, f"{path}/anomaly_scaler.pkl")
        joblib.dump(self.feature_stats, f"{path}/feature_stats.pkl")

    def load(self, path: str):
        self.model = joblib.load(f"{path}/isolation_forest.pkl")
        self.scaler = joblib.load(f"{path}/anomaly_scaler.pkl")
        self.feature_stats = joblib.load(f"{path}/feature_stats.pkl")
        self.is_trained = True
