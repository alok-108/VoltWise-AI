# FastAPI Backend Structure for VoltWise AI

## Directory Structure
```text
backend/
├── app/
│   ├── main.py            # Entry point
│   ├── api/               # API routes
│   │   ├── auth.py
│   │   ├── buildings.py
│   │   ├── forecast.py
│   │   └── subscriptions.py
│   ├── core/              # Config, security
│   │   ├── config.py
│   │   └── security.py
│   ├── models/            # SQLAlchemy models
│   │   ├── user.py
│   │   ├── building.py
│   │   └── meter_data.py
│   ├── schemas/           # Pydantic models
│   └── services/          # AI models, Stripe logic
│       ├── ai_engine.py
│       └── stripe_service.py
├── tests/
├── Dockerfile
├── docker-compose.yml
└── requirements.txt
```

## AI Forecast Implementation (app/services/ai_engine.py)
```python
import torch
import torch.nn as nn
import numpy as np

class EnergyForecastModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.lstm = nn.LSTM(input_size=1, hidden_size=64, num_layers=2, batch_first=True)
        self.fc = nn.Linear(64, 24)

    def forward(self, x):
        _, (hn, _) = self.lstm(x)
        return self.fc(hn[-1])

def get_forecast(building_id: int, historical_data: list):
    # Load model
    model = EnergyForecastModel()
    # model.load_state_dict(torch.load("model.pth"))
    model.eval()
    
    # Preprocess and predict
    input_tensor = torch.FloatTensor(historical_data).view(1, -1, 1)
    with torch.no_grad():
        prediction = model(input_tensor).numpy().flatten()
    
    peak_threshold = 140.0
    peak_detected = any(prediction > peak_threshold)
    
    return {
        "forecast": prediction.tolist(),
        "peak_detected": peak_detected,
        "estimated_cost": float(np.sum(prediction) * 8.5),
        "recommended_load_reduction": 20.0 if peak_detected else 0.0
    }
```

## Docker Configuration (Dockerfile)
```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```
