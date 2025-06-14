from flask import Flask, request, send_file, send_from_directory, jsonify, Response
from flask_cors import CORS
from ultralytics import YOLO
from ultralytics.nn.tasks import DetectionModel
from ultralytics.nn.modules.block import C2f, Bottleneck, SPPF, DFL
from ultralytics.nn.modules.conv import Conv, Concat
from ultralytics.nn.modules.head import Detect
from torch.nn.modules.container import Sequential, ModuleList
from torch.nn.modules.activation import SiLU
from torch.nn.modules.conv import Conv2d
from torch.nn.modules.batchnorm import BatchNorm2d
from torch.nn.modules.pooling import MaxPool2d
from torch.nn.modules.upsampling import Upsample
import os
import json
import logging
import cv2
import torch

# Cấu hình logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Thêm các global vào danh sách an toàn
torch.serialization.add_safe_globals([
    YOLO, DetectionModel, Sequential, Conv, Conv2d, 
    BatchNorm2d, SiLU, MaxPool2d, Upsample, C2f, ModuleList, Bottleneck, SPPF,
    Concat, Detect, DFL
])

# Khởi tạo Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Tạo thư mục uploads và outputs
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'outputs'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Tải mô hình YOLOv8
logger.info("Loading YOLOv8 model...")
try:
    model = YOLO('../models/best_ne.pt')
    logger.info("Model loaded successfully.")
except Exception as e:
    logger.error(f"Failed to load model: {str(e)}")
    raise

camera = None

@app.route('/', methods=['GET'])
def home():
    return send_from_directory('static', 'index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    logger.info("Received upload request")
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    logger.info(f"File: {file.filename}")
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    input_path = os.path.join(UPLOAD_FOLDER, file.filename)
    logger.info(f"Saving input file to: {input_path}")
    file.save(input_path)

    output_filename = 'detected_' + file.filename
    output_path = os.path.join(OUTPUT_FOLDER, output_filename)
    json_filename = 'results_' + file.filename.rsplit('.', 1)[0] + '.json'
    json_path = os.path.join(OUTPUT_FOLDER, json_filename)
    logger.info(f"Output file path: {output_path}")
    logger.info(f"JSON file path: {json_path}")

    # Xử lý ảnh
    try:
        results = model(input_path)
        annotated_img = results[0].plot()
        cv2.imwrite(output_path, annotated_img)
        detection_data = []
        for box in results[0].boxes:
            detection_data.append({
                "class": results[0].names[int(box.cls)],
                "confidence": float(box.conf),
                "bbox": [float(x) for x in box.xyxy[0].tolist()]
            })
        with open(json_path, 'w') as f:
            json.dump(detection_data, f, indent=4)
        logger.info("Image processed successfully")
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        return jsonify({"error": f"Error processing image: {str(e)}"}), 500

    return jsonify({
        "video": f"/download/{output_filename}",
        "results": f"/download/{json_filename}"
    }), 200

@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    return send_from_directory(OUTPUT_FOLDER, filename)

@app.route('/view/<filename>', methods=['GET'])
def view_file(filename):
    return send_from_directory(OUTPUT_FOLDER, filename)

import cv2

camera = None

def gen_frames():
    global camera
    # Thử lần lượt các index 0, 1, 2
    for idx in range(3):
        camera = cv2.VideoCapture(idx)
        if camera.isOpened():
            break
        camera.release()
        camera = None
    if camera is None or not camera.isOpened():
        raise RuntimeError("Could not open camera.")
    while True:
        success, frame = camera.read()
        if not success:
            break
        # Detect objects on frame
        results = model(frame)
        annotated_frame = results[0].plot()
        ret, buffer = cv2.imencode('.jpg', annotated_frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/realtime', methods=['GET'])
def realtime():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/stop_realtime', methods=['GET'])
def stop_realtime():
    global camera
    if camera is not None:
        camera.release()
        camera = None
    return jsonify({"status": "stopped"})

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5008))
    app.run(debug=False, host='0.0.0.0', port=port)