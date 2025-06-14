from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
import shutil
import os
from ultralytics import YOLO
from PIL import Image
import io
import torch.serialization

# Thêm class vào danh sách an toàn
torch.serialization.add_safe_globals(['ultralytics.nn.tasks.DetectionModel'])

app = FastAPI()

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount thư mục static để phục vụ file HTML và các tài nguyên tĩnh
app.mount("/static", StaticFiles(directory="static"), name="static")

# Load model
try:
    model = YOLO('../models/best_ne.pt')  # Đường dẫn tới mô hình đã huấn luyện
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@app.get("/")
async def read_root():
    return FileResponse("static/index.html")

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        if model is None:
            return JSONResponse(content={"error": "Model not loaded"}, status_code=500)
            
        # Đọc và lưu ảnh tạm thời
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Thực hiện dự đoán
        results = model(image)
        
        # Xử lý kết quả
        predictions = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                pred = {
                    "class": result.names[int(box.cls[0])],
                    "confidence": float(box.conf[0]),
                    "bbox": box.xyxy[0].tolist()
                }
                predictions.append(pred)
        
        return JSONResponse(content={"predictions": predictions})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001) 