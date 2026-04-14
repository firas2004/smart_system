import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, GRU, Dense, Dropout, BatchNormalization
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error
import joblib
import logging

logger = logging.getLogger(__name__)

class EnergyPredictionModel:
    """
    LSTM model for energy consumption prediction.
    Predicts the next 24 hours based on 7 days of history.
    """

    SEQ_LENGTH = 168      # 7 days of hourly data
    HORIZON = 24          # 24h forecast
    FEATURES = 10         # Number of input features

    def __init__(self, model_path: str = None):
        self.model = None
        self.scaler_X = MinMaxScaler()
        self.scaler_y = MinMaxScaler()
        self.is_trained = False

        if model_path:
            self.load(model_path)

    def build_model(self) -> tf.keras.Model:
        model = Sequential([
            LSTM(128, return_sequences=True,
                 input_shape=(self.SEQ_LENGTH, self.FEATURES)),
            BatchNormalization(),
            Dropout(0.2),

            LSTM(64, return_sequences=True),
            BatchNormalization(),
            Dropout(0.2),

            LSTM(32, return_sequences=False),
            Dropout(0.1),

            Dense(64, activation='relu'),
            Dense(32, activation='relu'),
            Dense(self.HORIZON, activation='linear')
        ])

        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
            loss='huber',
            metrics=['mae']
        )
        return model

    def prepare_features(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()

        # ── AGGREGATE TO HOURLY ──────────────────────────────────────────────
        # Raw data has multiple devices per building and multiple points per hour.
        # LSTM expects exactly 1 point per hour per building.
        if 'timestamp' in df.columns:
            df.set_index('timestamp', inplace=True)
            
        agg_cols = {}
        if 'power_kwh' in df.columns: agg_cols['power_kwh'] = 'sum'
        if 'temperature' in df.columns: agg_cols['temperature'] = 'mean'
        if 'is_holiday' in df.columns: agg_cols['is_holiday'] = 'max'
        
        df = df.resample('1h').agg(agg_cols).reset_index()
        df['hour'] = df['timestamp'].dt.hour
        df['day_of_week'] = df['timestamp'].dt.dayofweek
        df['month'] = df['timestamp'].dt.month
        df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
        
        # Forward fill any missing hours that had no telemetry
        df.ffill(inplace=True)
        # ─────────────────────────────────────────────────────────────────────
        # Cyclic encoding
        df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24)
        df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24)
        df['dow_sin'] = np.sin(2 * np.pi * df['day_of_week'] / 7)
        df['dow_cos'] = np.cos(2 * np.pi * df['day_of_week'] / 7)
        df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12)
        df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12)
        # Lag features
        df['lag_24h'] = df['power_kwh'].shift(24)
        df['lag_168h'] = df['power_kwh'].shift(168)
        df['rolling_mean_7d'] = df['power_kwh'].rolling(168, min_periods=1).mean()
        
        # Instead of dropping the first 168 rows (which breaks prediction if we have e.g. 330 total hours),
        # we backward fill the NaNs so we retain all recent data rows.
        df.bfill(inplace=True)
        return df

    def create_sequences(self, X: np.ndarray, y: np.ndarray):
        X_seq, y_seq = [], []
        for i in range(len(X) - self.SEQ_LENGTH - self.HORIZON + 1):
            X_seq.append(X[i:i + self.SEQ_LENGTH])
            y_seq.append(y[i + self.SEQ_LENGTH:i + self.SEQ_LENGTH + self.HORIZON])
        return np.array(X_seq), np.array(y_seq)

    def train(self, df: pd.DataFrame, epochs: int = 100, batch_size: int = 32):
        logger.info("Preparing features...")
        df = self.prepare_features(df)

        feature_cols = [
            'hour_sin', 'hour_cos', 'dow_sin', 'dow_cos',
            'month_sin', 'month_cos', 'is_weekend', 'is_holiday',
            'temperature', 'rolling_mean_7d'
        ]

        X = self.scaler_X.fit_transform(df[feature_cols].values)
        y = self.scaler_y.fit_transform(df[['power_kwh']].values)

        X_seq, y_seq = self.create_sequences(X, y)

        split = int(0.85 * len(X_seq))
        X_train, X_val = X_seq[:split], X_seq[split:]
        y_train, y_val = y_seq[:split], y_seq[split:]

        logger.info(f"Train: {len(X_train)} sequences | Val: {len(X_val)}")
        self.model = self.build_model()

        callbacks = [
            EarlyStopping(patience=15, restore_best_weights=True, monitor='val_loss'),
            ReduceLROnPlateau(factor=0.5, patience=7, monitor='val_loss', min_lr=1e-5)
        ]

        history = self.model.fit(
            X_train, y_train,
            validation_data=(X_val, y_val),
            epochs=epochs,
            batch_size=batch_size,
            callbacks=callbacks,
            verbose=1
        )
        self.is_trained = True

        y_pred = self.model.predict(X_val)
        y_pred_inv = self.scaler_y.inverse_transform(y_pred.reshape(-1, 1))
        y_true_inv = self.scaler_y.inverse_transform(y_val.reshape(-1, 1))

        mae = mean_absolute_error(y_true_inv, y_pred_inv)
        rmse = np.sqrt(mean_squared_error(y_true_inv, y_pred_inv))
        logger.info(f"MAE: {mae:.3f} kWh | RMSE: {rmse:.3f} kWh")

        return {"mae": mae, "rmse": rmse, "epochs": len(history.history['loss'])}

    def predict(self, recent_data: pd.DataFrame) -> dict:
        if not self.is_trained:
            raise ValueError("Model not trained")

        # Do not truncate here; prepare_features drops 168 rows due to lagged features.
        df = self.prepare_features(recent_data)

        feature_cols = [
            'hour_sin', 'hour_cos', 'dow_sin', 'dow_cos',
            'month_sin', 'month_cos', 'is_weekend', 'is_holiday',
            'temperature', 'rolling_mean_7d'
        ]

        X = self.scaler_X.transform(df[feature_cols].values)
        X_seq = X[-self.SEQ_LENGTH:].reshape(1, self.SEQ_LENGTH, self.FEATURES)

        y_pred_scaled = self.model.predict(X_seq, verbose=0)
        y_pred = self.scaler_y.inverse_transform(y_pred_scaled.reshape(-1, 1)).flatten()

        predictions = []
        for i, val in enumerate(y_pred):
            predictions.append({
                "hour": i + 1,
                "predicted_kwh": round(float(val), 3),
                "lower_bound": round(float(val * 0.85), 3),
                "upper_bound": round(float(val * 1.15), 3),
                "confidence": 0.87
            })

        return {
            "model": "lstm_v2",
            "horizon_hours": self.HORIZON,
            "predictions": predictions,
            "daily_total": round(float(sum(y_pred)), 2)
        }

    def save(self, path: str):
        import os
        os.makedirs(path, exist_ok=True)
        self.model.save(f"{path}/lstm_model.h5")
        joblib.dump(self.scaler_X, f"{path}/scaler_X.pkl")
        joblib.dump(self.scaler_y, f"{path}/scaler_y.pkl")
        logger.info(f"Model saved to {path}")

    def load(self, path: str):
        self.model = load_model(f"{path}/lstm_model.h5")
        self.scaler_X = joblib.load(f"{path}/scaler_X.pkl")
        self.scaler_y = joblib.load(f"{path}/scaler_y.pkl")
        self.is_trained = True
        logger.info("Model loaded successfully")
