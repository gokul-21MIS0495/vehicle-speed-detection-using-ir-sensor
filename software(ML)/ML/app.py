import logging
from flask import Flask, render_template, request
from pymongo import MongoClient
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)

# Connect to MongoDB
client = MongoClient("mongodb+srv://gokul:gokul@cluster0.kbfn1fd.mongodb.net/")
db = client['speed_detection']
notifications_collection = db['notifications']  # Notifications collection

# Function to initialize the collection with a sample document
def initialize_collection():
    if notifications_collection.count_documents({}) == 0:
        sample_data = {
            "day": "Thursday",
            "hour": "00:00 - 00:59",
            "avg_speed": 45.0,
            "result": "street1"
        }
        notifications_collection.insert_one(sample_data)
        logging.info("Sample data inserted into 'notifications' collection.")

# Fetch data for a specified hour
def fetch_hourly_data(day, hour, street):
    start_time = f"{hour:02}:00:00"
    end_time = f"{hour:02}:59:59"
    collection = db[street]
    data = list(collection.find({
        "day": day,
        "time": {"$gte": start_time, "$lte": end_time}
    }))
    if data:
        for entry in data:
            entry['speed_kmph'] = float(entry['speed_kmph'])
    return data

# Function to calculate highest average speed street for the given day and time range
def calculate_highest_avg_speed(day, start_hour, end_hour):
    streets = ["street1", "street2", "street3"]
    average_speeds = {}
    data_found = False

    for hour in range(start_hour, end_hour + 1):
        for street in streets:
            data = fetch_hourly_data(day, hour, street)
            if data:
                data_found = True
                avg_speed = sum(entry['speed_kmph'] for entry in data) / len(data)
                if street not in average_speeds:
                    average_speeds[street] = []
                average_speeds[street].append(avg_speed)
    
    # Define result when no data found
    if not data_found:
        highest_avg_speed_street = "no street"
        highest_avg_speed = 0
        logging.info(f"No data found for {day} between {start_hour}:00 and {end_hour}:59.")
    else:
        # Calculate average speed per street if data was found
        street_avg_speeds = {street: sum(speeds) / len(speeds) for street, speeds in average_speeds.items()}
        highest_avg_speed_street = max(street_avg_speeds, key=street_avg_speeds.get)
        highest_avg_speed = street_avg_speeds[highest_avg_speed_street]

    # Format the hour range string for storage
    hour_range = f"{start_hour:02}:00 - {end_hour:02}:59"

    # Insert the result into the notifications_collection
    try:
        notifications_collection.insert_one({
            "day": day,
            "hour": hour_range,
            "avg_speed": highest_avg_speed,
            "result": highest_avg_speed_street
        })
        logging.info(f"Inserted data for {day} between {hour_range} with highest speed at {highest_avg_speed_street}.")
    except Exception as e:
        logging.error(f"Error inserting into notifications_collection: {e}")

    return highest_avg_speed_street, highest_avg_speed

# Background job to perform hourly analysis
def hourly_analysis():
    now = datetime.now()
    day = now.strftime("%A")  # Use weekday name (e.g., Monday, Tuesday)
    hour = now.hour

    # Perform analysis for the past hour
    calculate_highest_avg_speed(day, hour, hour)

# Route to render the homepage (form page)
@app.route('/')
def home():
    return render_template('index.html', result=None)

# Route to handle form submission (POST request)
@app.route('/run', methods=['POST'])
def run_analysis():
    day = request.form['day']
    start_time = request.form['start_time']
    end_time = request.form['end_time']

    start_hour = int(start_time.split(':')[0])
    end_hour = int(end_time.split(':')[0])

    highest_avg_speed_street, highest_avg_speed = calculate_highest_avg_speed(day, start_hour, end_hour)

    if highest_avg_speed_street is None:
        result = f"No data found for the selected day ({day}) and time range ({start_time} to {end_time})."
    else:
        result = f"The peak time between {start_time} and {end_time} on {day} is {highest_avg_speed_street} ."

    return render_template('index.html', result=result)

if __name__ == '__main__':
    # Initialize the collection with sample data if empty
    initialize_collection()

    # Initialize and start the scheduler
    scheduler = BackgroundScheduler()
    scheduler.add_job(hourly_analysis, 'interval', hours=1)  # Change interval to 1 hour
    scheduler.start()

    try:
        app.run(debug=True)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
