import React, { useState, useEffect } from 'react';
import useFullPageLoader from './useFullPageLoader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

export const NewsPanel = (props) => {
  const notify = (data) => toast(data);
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [newsData, setNewsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchNews = async () => {
      showLoader();
      try {
        // Get user's current location
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://newsapi.org/v2/top-headlines?country=${getCountryCode(latitude, longitude)}&apiKey=39ca5290ce4f45bea33dfbec2ae2bc4c`
          );
          if (!response.ok) {
            throw new Error('Failed to fetch news');
          }
          const data = await response.json();
          setNewsData(data.articles);
          hideLoader();
        });
      } catch (error) {
        console.error('Error fetching news:', error);
        notify('Error fetching news. Please try again.');
        hideLoader();
      }
    };

    fetchNews();
  }, []);

  // Function to get country code based on latitude and longitude
  const getCountryCode = (latitude, longitude) => {
    // You may need to use a reverse geocoding API to get the country code based on the coordinates.
    // This is a simplified example.
    return 'in'; // For demonstration, assuming India as the default country
  };

  // Calculate the index range for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const displayedNews = newsData.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container">
      <br />
      <div className="row">
        {displayedNews.map((news, index) => (
          <div key={index} className="col-md-4">
            <Link to={news.url} target="_blank" rel="noopener noreferrer"> {/* Link to the news article */}
              <div className="card mb-4">
                <div style={{ position: 'relative', paddingBottom: '100%' }}>
                  <img
                    className="card-img-top"
                    src={news.urlToImage || 'https://via.placeholder.com/150'}
                    alt="News Image"
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '2px',
                      backgroundColor: 'blue',
                    }}
                  ></div>
                </div>
                <div className="card-body">
                  <h5 className="card-title">{news.title}</h5>
                  <p className="card-text">{news.description}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Next and Previous buttons only */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          &lt; Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(newsData.length / itemsPerPage)}
        >
          Next &gt;
        </button>
      </div>

      {loader}
      <ToastContainer />
    </div>
  );
};
