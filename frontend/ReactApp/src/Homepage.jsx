import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './Homepage.css';

const Homepage = () => {
  const [street1Data, setStreet1Data] = useState(null);
  const [street2Data, setStreet2Data] = useState(null);
  const [street3Data, setStreet3Data] = useState(null);

  const [street1AvgSpeed, setStreet1AvgSpeed] = useState(0);
  const [street2AvgSpeed, setStreet2AvgSpeed] = useState(0);
  const [street3AvgSpeed, setStreet3AvgSpeed] = useState(0);

  const [street1OppositeDirectionPercentage, setStreet1OppositeDirectionPercentage] = useState(0);
  const [street2OppositeDirectionPercentage, setStreet2OppositeDirectionPercentage] = useState(0);
  const [street3OppositeDirectionPercentage, setStreet3OppositeDirectionPercentage] = useState(0);

  const fetchData = async (streetId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/${streetId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching data for ${streetId}:`, error);
      return [];
    }
  };

  useEffect(() => {
    const fetchStreetData = async () => {
      const street1 = await fetchData('street1');
      const street2 = await fetchData('street2');
      const street3 = await fetchData('street3');

      setStreet1Data(street1);
      setStreet2Data(street2);
      setStreet3Data(street3);

      if (street1.length > 0) {
        setStreet1AvgSpeed(calculateAverageSpeed(street1));
        setStreet1OppositeDirectionPercentage(calculateOppositeDirectionPercentage(street1));
      }
      if (street2.length > 0) {
        setStreet2AvgSpeed(calculateAverageSpeed(street2));
        setStreet2OppositeDirectionPercentage(calculateOppositeDirectionPercentage(street2));
      }
      if (street3.length > 0) {
        setStreet3AvgSpeed(calculateAverageSpeed(street3));
        setStreet3OppositeDirectionPercentage(calculateOppositeDirectionPercentage(street3));
      }
    };

    fetchStreetData();
  }, []);

  const calculateAverageSpeed = (data) => {
    const totalSpeed = data.reduce((sum, entry) => sum + entry.speed_kmph, 0);
    return totalSpeed / data.length;
  };

  const calculateOppositeDirectionPercentage = (data) => {
    const totalEntries = data.length;
    const oppositeDirectionCount = data.filter(entry => entry.opposite_direction).length;
    return (oppositeDirectionCount / totalEntries) * 100;
  };

  const getProgressBarValue = (value) => {
    return Math.min(value, 100); // Assuming 100 is the max value
  };

  return (
    <div className="homepage-container">
      {/* <h1>Vehicle Speed Detection</h1> */}
      <div className="street-cards">
        {/* Street 1 Card */}
        <div className="street-card">
          <h2>Street 1</h2>
          {street1Data ? (
            <>
              <div style={{ width: '150px', height: '150px', marginBottom: '10px' }}>
                <CircularProgressbar
                  value={getProgressBarValue(street1AvgSpeed)}
                  text={`${street1AvgSpeed.toFixed(2)} km/h`}
                  styles={buildStyles({
                    pathColor: '#4caf50',
                    textSize: '0.7em',
                    textColor: '#333',
                  })}
                  strokeWidth={8}
                />
              </div>
              <p>Opposite Direction: {street1OppositeDirectionPercentage.toFixed(2)}%</p>
              <div style={{ width: '150px', height: '150px', marginBottom: '10px' }}>
                <CircularProgressbar
                  value={getProgressBarValue(street1OppositeDirectionPercentage)}
                  text={`${street1OppositeDirectionPercentage.toFixed(2)}%`}
                  styles={buildStyles({
                    pathColor: '#f44336',
                    textSize: '0.7em',
                    textColor: '#333',
                  })}
                  strokeWidth={8}
                />
              </div>
              <Link to="/street/street1">
                <button className="details-button">View Details</button>
              </Link>
            </>
          ) : (
            <p>Loading Street 1 data...</p>
          )}
        </div>

        {/* Street 2 Card */}
        <div className="street-card">
          <h2>Street 2</h2>
          {street2Data ? (
            <>
              <div style={{ width: '150px', height: '150px', marginBottom: '10px' }}>
                <CircularProgressbar
                  value={getProgressBarValue(street2AvgSpeed)}
                  text={`${street2AvgSpeed.toFixed(2)} km/h`}
                  styles={buildStyles({
                    pathColor: '#4caf50',
                    textSize: '0.7em',
                    textColor: '#333',
                  })}
                  strokeWidth={8}
                />
              </div>
              <p>Opposite Direction: {street2OppositeDirectionPercentage.toFixed(2)}%</p>
              <div style={{ width: '150px', height: '150px', marginBottom: '10px' }}>
                <CircularProgressbar
                  value={getProgressBarValue(street2OppositeDirectionPercentage)}
                  text={`${street2OppositeDirectionPercentage.toFixed(2)}%`}
                  styles={buildStyles({
                    pathColor: '#f44336',
                    textSize: '0.7em',
                    textColor: '#333',
                  })}
                  strokeWidth={8}
                />
              </div>
              <Link to="/street/street2">
                <button className="details-button">View Details</button>
              </Link>
            </>
          ) : (
            <p>Loading Street 2 data...</p>
          )}
        </div>

        {/* Street 3 Card */}
        <div className="street-card">
          <h2>Street 3</h2>
          {street3Data ? (
            <>
              <div style={{ width: '150px', height: '150px', marginBottom: '10px' }}>
                <CircularProgressbar
                  value={getProgressBarValue(street3AvgSpeed)}
                  text={`${street3AvgSpeed.toFixed(2)} km/h`}
                  styles={buildStyles({
                    pathColor: '#4caf50',
                    textSize: '0.7em',
                    textColor: '#333',
                  })}
                  strokeWidth={8}
                />
              </div>
              <p>Opposite Direction: {street3OppositeDirectionPercentage.toFixed(2)}%</p>
              <div style={{ width: '150px', height: '150px', marginBottom: '10px' }}>
                <CircularProgressbar
                  value={getProgressBarValue(street3OppositeDirectionPercentage)}
                  text={`${street3OppositeDirectionPercentage.toFixed(2)}%`}
                  styles={buildStyles({
                    pathColor: '#f44336',
                    textSize: '0.7em',
                    textColor: '#333',
                  })}
                  strokeWidth={8}
                />
              </div>
              <Link to="/street/street3">
                <button className="details-button">View Details</button>
              </Link>
            </>
          ) : (
            <p>Loading Street 3 data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
