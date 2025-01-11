import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import json

class DataAnalyzer:
    def __init__(self, data):
        self.data = pd.DataFrame(data)
        
    def generate_summary_statistics(self):
        """Generate basic summary statistics for numerical columns"""
        return self.data.describe().to_dict()
    
    def analyze_time_series(self, date_column, value_column):
        """Analyze time series data"""
        self.data[date_column] = pd.to_datetime(self.data[date_column])
        time_series = self.data.set_index(date_column)[value_column]
        
        # Calculate basic metrics
        metrics = {
            'trend': time_series.diff().mean(),
            'seasonality': time_series.diff(periods=12).mean() if len(time_series) >= 12 else None,
            'min_value': float(time_series.min()),
            'max_value': float(time_series.max()),
            'mean_value': float(time_series.mean())
        }
        
        return metrics
    
    def make_predictions(self, target_column, feature_columns):
        """Make predictions using Random Forest"""
        X = self.data[feature_columns]
        y = self.data[target_column]
        
        # Handle missing values
        X = X.fillna(X.mean())
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
        
        # Scale the features
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        # Train model
        if y.dtype == 'object':
            model = RandomForestClassifier(n_estimators=100)
        else:
            model = RandomForestRegressor(n_estimators=100)
            
        model.fit(X_train_scaled, y_train)
        
        # Make predictions
        predictions = model.predict(X_test_scaled)
        
        return {
            'predictions': predictions.tolist(),
            'feature_importance': dict(zip(feature_columns, model.feature_importances_))
        }
    
    def generate_report(self):
        """Generate a comprehensive report"""
        report = {
            'summary_statistics': self.generate_summary_statistics(),
            'correlation_matrix': self.data.corr().to_dict(),
            'missing_values': self.data.isnull().sum().to_dict(),
            'column_types': self.data.dtypes.astype(str).to_dict(),
            'generated_at': datetime.now().isoformat()
        }
        
        return json.dumps(report)

# Example usage:
# analyzer = DataAnalyzer(your_data)
# summary = analyzer.generate_summary_statistics()
# predictions = analyzer.make_predictions('target_column', ['feature1', 'feature2'])
# report = analyzer.generate_report()