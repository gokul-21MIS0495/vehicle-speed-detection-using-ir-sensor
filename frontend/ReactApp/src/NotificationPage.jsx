// src/NotificationPage.jsx
import React, { useEffect, useState } from 'react';
import './NotificationPage.css';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications from the backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/notifications');
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setNotifications(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Show loading, error, or notifications
  if (loading) {
    return <p>Loading notifications...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="notification-page">
      <h1>Notifications</h1>

      {/* Display notifications dynamically */}
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div key={notification._id} className="notification-item">
            <h3>Time: {notification.hour}</h3>
            <p>Day: {notification.day}</p>
            <p>Average Speed: {notification.avg_speed} km/h</p>
            <p>Result: {notification.result}</p>
            <small>
              Posted on:{' '}
              {new Date(parseInt(notification._id.substring(0, 8), 16) * 1000).toLocaleDateString()}
            </small>
          </div>
        ))
      ) : (
        <p>No notifications available</p>
      )}

      {/* Back Button */}
      <button className="back-btn">Back to Homepage</button>
    </div>
  );
};

export default NotificationPage;