import React, { useState, useCallback, useEffect } from 'react';
import useFullPageLoader from './useFullPageLoader';
import { storage, auth, fs } from './Config';
import imageCompression from 'browser-image-compression';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import noimg from './noimage.png';
import 'react-toastify/dist/ReactToastify.css';

export const ViewPanel = (props) => {
  const notify = (data) => toast(data);
  const navigate = useNavigate();
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [newsData, setNewsData] = useState([]);
  const [category, setCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  function GetUserUid() {

    const [uid, setUid] = useState(null);
    useEffect(() => {
      showLoader();
      auth.onAuthStateChanged(user => {
        if (user) {
          setUid(user.uid);
          const docRef = fs.collection('Admin').doc(user.uid)
          docRef.get().then((doc) => {
            if (doc.exists) {
              console.log('success')
              hideLoader();
            } else {
              console.log('not user')
              navigate('/error');
            }
          })
        } else {
          console.log('not user')
          navigate('/error');
        }
      })
    }, [])
    return uid;
  }
  const uid = GetUserUid();

  function GetCurrentUser() {
    const [user, setUser] = useState(null);
    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                const docRef = fs.collection('users').doc(user.uid)
                docRef.get().then((doc) => {
                    if (doc.exists) {
                        setUser(doc.data().FullName);
                    }
                })
            }
            else {
                setUser(null);

            }
        })
    }, [])
    return user;
}

const user = GetCurrentUser();

  const categoryArray = [];

  // Getting products function
  const getCategory = async () => {
    const category = await fs.collection('news').orderBy('storyid', 'desc').get();

    for (var snap of category.docs) {
      var data = snap.data();
      data.ID = snap.id;
      categoryArray.push({
        ...data
      });
      if (categoryArray.length === category.docs.length) {
        setCategory(categoryArray);
      }
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  // Calculate the index range for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const displayedNews = category.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const deleteNews = async (newsId, imageUri) => {
    try {
      // Delete news data from Firestore
      await fs.collection('news').doc(newsId).delete();

      // Delete image from storage if imageUri exists
      if (imageUri) {
        const imageRef = storage.refFromURL(imageUri);
        await imageRef.delete();
      }

      // Update the category state without the deleted news
      setCategory((prevCategory) => prevCategory.filter((news) => news.ID !== newsId));
      notify('News deleted successfully!');
    } catch (error) {
      console.error('Error deleting news:', error);
      notify('Error deleting news. Please try again.');
    }
  };

  return (
    <div className="container">
      <br></br>
      <div class="alert alert-success d-flex align-items-center" role="alert">
        <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"></svg>
        <div>Welcome back {user}!</div>
      </div>

      <div className="row">
        {displayedNews.map((news) => (
          <div key={news.ID} className="col-md-4">
            <div className="card mb-4">
              <div style={{ position: 'relative', paddingBottom: '100%' }}>

                <img
                  className="card-img-top"
                  src={news.imageUri ? news.imageUri : noimg}
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
                >

                </div>
              </div>
              <div className="card-body">
                <h5 className="card-title">{news.title}</h5>
                <p className="card-text">{news.description}</p>
                <button
                  className="btn btn-danger btn-md float-end"
                  onClick={() => deleteNews(news.ID, news.imageUri)}
                >
                  Delete News
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>



      {/* Next and Previous buttons only */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          &lt; Previous
        </button>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === Math.ceil(category.length / itemsPerPage)}>
          Next &gt;
        </button>
      </div>

      {loader}
      <ToastContainer />
    </div>
  );
};
