import React, { useState, useEffect } from 'react';
import './StreetDetailPage.css';
import { useParams } from 'react-router-dom'; 
import axios from 'axios';

const StreetDetailPage = () => {
  const { streetId } = useParams();

  const [streetData, setStreetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchStreetData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/${streetId}`);
        
        if (response.data.length === 0) {
          setError('No Details Found');
        } else {
          setStreetData(response.data);
          setError(null);
        }
      } catch (error) {
        setError('Error fetching street data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStreetData();
  }, [streetId]);

  const sortData = (criteria) => {
    const sortedData = [...streetData];
    switch (criteria) {
      case 'date':
        sortedData.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'speed':
        sortedData.sort((a, b) => b.speed_kmph - a.speed_kmph);
        break;
      case 'opposite_direction':
        sortedData.sort((a, b) => (b.opposite_direction === true) - (a.opposite_direction === true));
        break;
      case 'time':
        sortedData.sort((a, b) => a.time.localeCompare(b.time));
        break;
      default:
        break;
    }
    setStreetData(sortedData);
    setSortMenuVisible(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = streetData.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (indexOfLastItem < streetData.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Street Details for {streetId}</h1>

      <div className="sort-container">
        <button className="btn-sort" onClick={() => setSortMenuVisible(!sortMenuVisible)}>
          Sort Options
        </button>
        {sortMenuVisible && (
          <div className="sort-options">
            <button onClick={() => sortData('date')}>By Date</button>
            <button onClick={() => sortData('speed')}>By Speed</button>
            <button onClick={() => sortData('time')}>By Time</button>
            <button onClick={() => sortData('opposite_direction')}>By Opposite Direction</button>
          </div>
        )}
      </div>

      <table>
        <thead>
          <tr>
            
            <th>Day</th>
            <th>Time</th>
            <th>Speed (km/h)</th>
            <th>Opposite Direction</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((instance) => (
            <tr
              key={instance._id}
              className={(instance.speed_kmph > 65 || instance.opposite_direction) ? 'red-text' : ''}
            >
             
              <td>{instance.day}</td>
              <td>{instance.time}</td>
              <td>{instance.speed_kmph}</td>
              <td>{instance.opposite_direction ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button onClick={handleNextPage} disabled={indexOfLastItem >= streetData.length}>
          Next
        </button>
      </div>

      <button className="back-button" onClick={() => window.history.back()}>
        Back to Homepage
      </button>
    </div>
  );
};

export default StreetDetailPage;
