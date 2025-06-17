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
from pymongo import MongoClient
from datetime import datetime
import base64
import cloudinary
import cloudinary.uploader
import cloudinary.api

# Cấu hình logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Kết nối MongoDB
try:
    # Kết nối đến MongoDB Atlas với database rescue_system
    client = MongoClient('mongodb+srv://allecraira:123@dataseadrone.it03l2o.mongodb.net/rescue_system?retryWrites=true&w=majority')
    # Kiểm tra kết nối
    client.admin.command('ping')
    db = client.get_database('rescue_system')
    collection = db['Survey_Drone']
    logger.info("Connected to MongoDB Atlas successfully - Database: rescue_system")
    logger.info(f"Available collections: {db.list_collection_names()}")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {str(e)}")
    raise

# Thêm các global vào danh sách an toàn
torch.serialization.add_safe_globals([
    YOLO, DetectionModel, Sequential, Conv, Conv2d, 
    BatchNorm2d, SiLU, MaxPool2d, Upsample, C2f, ModuleList, Bottleneck, SPPF,
    Concat, Detect, DFL
])

# Khởi tạo Flask app
app = Flask(__name__, static_folder='static')
CORS(app, resources={r"/*": {"origins": "*"}})

# Tạo thư mục uploads và outputs
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'outputs')
OUTPUT_FOLDER = os.path.join(BASE_DIR, 'outputs')

logger.info(f"Base directory: {BASE_DIR}")
logger.info(f"Upload folder: {UPLOAD_FOLDER}")
logger.info(f"Output folder: {OUTPUT_FOLDER}")

# Tạo thư mục nếu chưa tồn tại
try:
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    os.makedirs(OUTPUT_FOLDER, exist_ok=True)
    logger.info("Created output directories successfully")
except Exception as e:
    logger.error(f"Error creating directories: {str(e)}")
    raise

# Tải mô hình YOLOv8
logger.info("Loading YOLOv8 model...")
try:
    model = YOLO('models/best_ne.pt')
    logger.info("Model loaded successfully.")
except Exception as e:
    logger.error(f"Failed to load model: {str(e)}")
    raise

camera = None

# Cấu hình Cloudinary
cloudinary.config(
    cloud_name = "dntu2oyta",
    api_key = "833421878631118",
    api_secret = "tCLFaFJUMxkKslEqxgmkMqKzjd0"
)

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

    # Tạo tên file an toàn
    safe_filename = file.filename.replace(' ', '_')
    input_path = os.path.join(UPLOAD_FOLDER, safe_filename)
    logger.info(f"Saving input file to: {input_path}")
    
    try:
        file.save(input_path)
        logger.info(f"File saved successfully at: {input_path}")
    except Exception as e:
        logger.error(f"Error saving file: {str(e)}")
        return jsonify({"error": f"Error saving file: {str(e)}"}), 500

    output_filename = 'detected_' + safe_filename
    output_path = os.path.join(OUTPUT_FOLDER, output_filename)
    json_filename = 'results_' + safe_filename.rsplit('.', 1)[0] + '.json'
    json_path = os.path.join(OUTPUT_FOLDER, json_filename)
    
    logger.info(f"Output file path: {output_path}")
    logger.info(f"JSON file path: {json_path}")

    try:
        # Kiểm tra file tồn tại
        if not os.path.exists(input_path):
            raise FileNotFoundError(f"Input file not found: {input_path}")
            
        logger.info("Starting model prediction...")
        
        # Kiểm tra định dạng file
        file_ext = os.path.splitext(input_path)[1].lower()
        is_video = file_ext in ['.mp4', '.avi', '.mov', '.mkv']
        
        detection_data = []  # Khởi tạo detection_data ở đây
        
        if is_video:
            logger.info("Processing video file...")
            cap = cv2.VideoCapture(input_path)
            if not cap.isOpened():
                raise Exception(f"Could not open video file: {input_path}")
            
            # Kiểm tra thông tin video
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            fps = int(cap.get(cv2.CAP_PROP_FPS))
            
            logger.info(f"Video properties:")
            logger.info(f"- Total frames: {total_frames}")
            logger.info(f"- Width: {width}")
            logger.info(f"- Height: {height}")
            logger.info(f"- FPS: {fps}")
            
            if total_frames <= 0:
                raise Exception("Invalid video: No frames found")
            
            # Tạo file output với định dạng mp4
            output_filename = f'detected_{safe_filename.rsplit(".", 1)[0]}.mp4'
            output_path = os.path.join(OUTPUT_FOLDER, output_filename)
            logger.info(f"Output video path: {output_path}")
            
            # Kiểm tra thư mục output
            if not os.path.exists(OUTPUT_FOLDER):
                logger.info(f"Creating output directory: {OUTPUT_FOLDER}")
                os.makedirs(OUTPUT_FOLDER, exist_ok=True)
            
            # Tạo VideoWriter với H264 codec
            fourcc = cv2.VideoWriter_fourcc(*'avc1')  # H264 codec
            out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
            
            if not out.isOpened():
                raise Exception(f"Failed to create output video file at {output_path}")
            
            logger.info("Starting video processing...")
            frame_count = 0
            processed_frames = 0
            
            try:
                while cap.isOpened():
                    ret, frame = cap.read()
                    if not ret:
                        logger.info("End of video reached")
                        break
                        
                    frame_count += 1
                    if frame_count % 30 == 0:
                        logger.info(f"Processing frame {frame_count}/{total_frames}")
                    
                    # Kiểm tra frame
                    if frame is None or frame.size == 0:
                        logger.warning(f"Invalid frame at position {frame_count}")
                        continue
                    
                    # Xử lý frame
                    try:
                        frame_results = model(frame)
                        annotated_frame = frame_results[0].plot()
                        
                        # Lưu kết quả detection của frame đầu tiên
                        if frame_count == 1:
                            for box in frame_results[0].boxes:
                                detection_data.append({
                                    "class": frame_results[0].names[int(box.cls)],
                                    "confidence": float(box.conf),
                                    "bbox": [float(x) for x in box.xyxy[0].tolist()]
                                })
                        
                        # Kiểm tra frame đã xử lý
                        if annotated_frame is None or annotated_frame.size == 0:
                            logger.warning(f"Invalid annotated frame at position {frame_count}")
                            continue
                            
                        out.write(annotated_frame)
                        processed_frames += 1
                        
                    except Exception as e:
                        logger.error(f"Error processing frame {frame_count}: {str(e)}")
                        continue
                
                logger.info(f"Video processing completed:")
                logger.info(f"- Total frames read: {frame_count}")
                logger.info(f"- Frames processed: {processed_frames}")
                
            finally:
                # Đảm bảo giải phóng tài nguyên
                out.release()
                cap.release()
                logger.info("Released video resources")
            
            # Kiểm tra file output
            if not os.path.exists(output_path):
                raise Exception(f"Output file was not created at {output_path}")
                
            file_size = os.path.getsize(output_path)
            logger.info(f"Output file size: {file_size} bytes")
            
            if file_size == 0:
                raise Exception("Output file is empty")
                
            logger.info(f"Video processing completed successfully. Output saved to: {output_path}")
            
        else:
            logger.info("Processing image file...")
            results = model(input_path)
            annotated_img = results[0].plot()
            cv2.imwrite(output_path, annotated_img)
            logger.info(f"Image saved to: {output_path}")
            
            # Lưu kết quả detection cho ảnh
            for box in results[0].boxes:
                detection_data.append({
                    "class": results[0].names[int(box.cls)],
                    "confidence": float(box.conf),
                    "bbox": [float(x) for x in box.xyxy[0].tolist()]
                })

        # Lưu kết quả vào file JSON
        with open(json_path, 'w') as f:
            json.dump(detection_data, f, indent=4)
        logger.info(f"JSON results saved to: {json_path}")
        
        logger.info("Starting Cloudinary upload...")
        cloudinary_response = cloudinary.uploader.upload(
            output_path,
            folder="beach_detection",
            resource_type="auto"
        )
        logger.info("Cloudinary upload completed")
        
        # Lưu vào MongoDB
        detection_record = {
            'survey_id': f"S{datetime.now().strftime('%Y%m%d%H%M')}",
            'drone_id': 'DRN001',
            'image_swimmer_url': cloudinary_response['secure_url'],
            'full_video_url': None,
            'detection_results': detection_data,
            'timestamp': datetime.now(),
            'cloudinary_public_id': cloudinary_response['public_id']
        }
        
        try:
            result = collection.insert_one(detection_record)
            logger.info(f"Data saved to MongoDB successfully - ID: {result.inserted_id}")
            
            # Xóa file local sau khi đã upload
            os.remove(output_path)
            os.remove(input_path)
            logger.info("Local files cleaned up")
            
            return jsonify({
                "video": cloudinary_response['secure_url'],
                "results": f"/download/{json_filename}"
            }), 200
            
        except Exception as e:
            logger.error(f"Error saving to MongoDB: {str(e)}")
            raise
            
    except Exception as e:
        logger.error(f"Error processing file: {str(e)}")
        # Cleanup nếu có lỗi
        for path in [input_path, output_path]:
            if os.path.exists(path):
                try:
                    os.remove(path)
                    logger.info(f"Cleaned up file: {path}")
                except:
                    pass
        return jsonify({"error": f"Error processing file: {str(e)}"}), 500

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

# Thêm API endpoint để lấy lịch sử phát hiện
@app.route('/history', methods=['GET'])
def get_history():
    try:
        # Lấy 10 bản ghi gần nhất từ collection Survey_Drone
        history = list(db['Survey_Drone'].find(
            {},  # Không cần filter type nữa vì đã có collection riêng
            {'_id': 0, 'image_base64': 0}  # Loại bỏ _id và image_base64 để giảm kích thước response
        ).sort('timestamp', -1).limit(10))
        return jsonify(history), 200
    except Exception as e:
        logger.error(f"Error getting history: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Thêm API endpoint để kiểm tra database
@app.route('/check_database', methods=['GET'])
def check_database():
    try:
        # Lấy danh sách tất cả collections
        collections = db.list_collection_names()
        
        # Lấy thông tin về database
        db_info = {
            'database_name': db.name,
            'collections': collections,
            'sample_data': {}
        }
        
        # Lấy mẫu dữ liệu từ mỗi collection
        for collection_name in collections:
            sample = list(db[collection_name].find().limit(1))
            if sample:
                # Chuyển đổi ObjectId thành string để có thể serialize JSON
                sample[0]['_id'] = str(sample[0]['_id'])
                db_info['sample_data'][collection_name] = sample[0]
        
        return jsonify(db_info), 200
    except Exception as e:
        logger.error(f"Error checking database: {str(e)}")
        return jsonify({"error": str(e)}), 500


# Thêm API endpoint để test kết nối MongoDB
@app.route('/test_mongo', methods=['GET'])
def test_mongo():
    try:
        # Test kết nối
        client.admin.command('ping')
        
        # Tạo dữ liệu test
        test_data = {
            'test_id': 'TEST001',
            'timestamp': datetime.now(),
            'message': 'Test connection'
        }
        
        # Thử lưu vào collection test
        test_collection = db['test_collection']
        result = test_collection.insert_one(test_data)
        
        # Kiểm tra dữ liệu đã lưu
        saved_data = test_collection.find_one({'_id': result.inserted_id})
        
        return jsonify({
            'status': 'success',
            'message': 'MongoDB connection and write test successful',
            'connection_info': {
                'database': db.name,
                'collections': db.list_collection_names(),
                'test_data_id': str(result.inserted_id)
            },
            'saved_data': {
                'test_id': saved_data['test_id'],
                'timestamp': saved_data['timestamp'].isoformat(),
                'message': saved_data['message']
            }
        }), 200
    except Exception as e:
        logger.error(f"MongoDB test failed: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e),
            'error_details': {
                'type': type(e).__name__,
                'args': e.args
            }
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5008))
    app.run(debug=False, host='0.0.0.0', port=port)