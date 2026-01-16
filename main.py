from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import helper

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React (Vite)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TextIn(BaseModel):
    text: str

with open("model.pkl", "rb") as f:
    model = pickle.load(f)

# API Route
@app.post("/api/predict")
def predict(payload: TextIn):
    q = helper.last_preprocess(payload.text)
    result = model.predict(q)

    label = int(result[0]) if hasattr(result, "__getitem__") else int(result)

    probability = None
    if hasattr(model, "predict_proba"):
        try:
            probability = float(model.predict_proba(q)[0].max())
        except Exception:
            probability = None

    return {
        "label": label,
        "prediction": "positive" if label == 1 else "negative",
        "probability": round(probability, 4) if probability is not None else None,
    }
