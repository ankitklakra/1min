import React, { useState, useCallback, useEffect } from 'react'
import useFullPageLoader from './useFullPageLoader'
import { storage, auth, fs } from './Config'
import imageCompression from 'browser-image-compression';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AdminPanel = (props) => {
    const notify = (data) => toast(data);
    const navigate = useNavigate();
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const now = Date.now();
    const end = Date.now() + 86400000;
    var date = new Date();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [imageError, setImageError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [uploadError, setUploadError] = useState('');

    const types = ['image/jpg', 'image/jpeg', 'image/png', 'image/PNG', 'image/webp', 'image/jfif'];

    // getting current user uid
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

    // getting current user function
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

    const handleProductImg = (e) => {
        let selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile && types.includes(selectedFile.type)) {

                setImageError('');
                var options = {
                    maxSizeMB: 1,
                    useWebWorker: true
                }
                imageCompression(selectedFile, options)
                    .then(function (compressedFile) {
                        setImage(compressedFile);
                        console.log('compress done');
                        notify('Image added successfully');
                    })
                    .catch(function (error) {
                        console.log(error.message);
                        notify('Error! Please add image once again');
                    });

            }
            else {
                setImage(null);
                setImageError('please select a valid image file type (png or jpg)')
            }
        }
        else {
            console.log('please select your file');
        }
    }
    const handleAddProducts = (e) => {
        e.preventDefault();
        showLoader();
        // const uploadTask = storage.ref(`product-images/${image.name+now}`).put(image);
        // uploadTask.on('state_changed', snapshot => {
        //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        //     console.log(progress);
        // }, error => setUploadError(error.message), () => {
        //     storage.ref('product-images').child(image.name+now).getDownloadURL().then(url => {
        //         fs.collection(category).add({
        //             title,
        //             description,
        //             price,
        //             url,
        //             Created:date
        //         }).then(() => {
        //             setSuccessMsg('Product added successfully');
        //             setTitle('');
        //             setDescription('');
        //             setPrice('');
        //             setCategory('');
        //             document.getElementById('file').value = '';
        //             setImageError('');
        //             setUploadError('');
        //             setTimeout(() => {
        //                 setSuccessMsg('');
        //             }, 3000)
        //         }).catch(error => setUploadError(error.message)).then(() => {
        //             hideLoader();
        //         });
        //     })
        // })
        const storageRef = storage.ref();
        const timeStamp = String(Date.now());
        const filePathAndName = `News/News_${timeStamp}`;
        const fileRef = storageRef.child(filePathAndName);

        // Upload the image to Firebase Storage
        fileRef.put(image).then((snapshot) => {
            // Get the download URL of the uploaded image
            snapshot.ref.getDownloadURL().then((downloadURL) => {
                const downloadUri = downloadURL;

                // Create a new document in the Firestore collection "stories"
                // const db = firebase.firestore();
                const storyRef = fs.collection('news').doc(timeStamp);
                const storyId = storyRef.id;

                // Create a data object with the fields to be stored in Firestore
                const data = {
                    imageUri: downloadUri,
                    timestart: now,
                    timeend: end,
                    storyid: storyId,
                    userid: uid,
                    title: title,
                    description: description
                };

                // Upload the data to Firestore
                storyRef.set(data)
                    .then(() => {
                        alert('News uploaded');
                        this.props.onBack();
                        hideLoader();
                        setSuccessMsg('News added successfully');
                        setTitle('');
                        setDescription('');
                        document.getElementById('file').value = '';
                        setImageError('');
                        setUploadError('');
                        setTimeout(() => {
                            setSuccessMsg('');
                        }, 3000)
                    })
                    .catch((error) => {
                        console.error('Error uploading news:', error);
                        hideLoader();
                        setTitle('');
                        setDescription('');
                        document.getElementById('file').value = '';
                        setImageError('');
                        setUploadError('');
                        setTimeout(() => {
                            setSuccessMsg('');
                        }, 3000)
                    });
            });
        }).catch((error) => {
            console.error('Error uploading image:', error);
            hideLoader();
            setTitle('');
            setDescription('');
            document.getElementById('file').value = '';
            setImageError('');
            setUploadError('');
            setTimeout(() => {
                setSuccessMsg('');
            }, 3000)
        });

    }
    const handleLogout = () => {
        auth.signOut().then(() => {
            
        }).catch(function (error) {
           
        });
    }

   
    return (
        <div className='container'>
            <br></br>
            <div class="alert alert-success d-flex align-items-center" role="alert">
                <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"></svg>
                <div>
                    Welcome back {user} !
                </div>
            </div>

           <form  className='form-group' onSubmit={handleLogout} > 
            <h1 >
                <span class="badge bg-secondary"> 1 minute Admin</span>
                <button type="submit" className='btn btn-danger btn-md float-end' >
                    LOGOUT
                </button>
            </h1>
            </form>
            <hr></hr>
            {successMsg && <>
                <div className='success-msg'>{successMsg}</div>
                <br></br>
            </>}
            <form autoComplete="off" className='form-group' onSubmit={handleAddProducts}>
                <label>News Title</label>
                <textarea type="text" className='form-control' rows="1" required
                    onChange={(e) => setTitle(e.target.value)} value={title}></textarea>
                <br></br>
                <label>News Description</label>
                <textarea type="text" className='form-control' rows="3" required
                    onChange={(e) => setDescription(e.target.value)} value={description}></textarea>
                <br></br>
                {/* <label>Product Price</label>
        <input type="text" className='form-control' required
            onChange={(e) => setPrice(e.target.value)} value={price}></input>
        <br></br> */}
                {/* <label>Product Category</label>
        <input type="text" className='form-control' required
            onChange={(e) => setCategory(e.target.value)} value={category}></input>
        <br></br> */}
                <label>Upload News Image</label>
                <input type="file" id="file" className='form-control' required
                    onChange={handleProductImg}></input>

                {imageError && <>
                    <br></br>
                    <div className='error-msg'>{imageError}</div>

                </>}
                <br></br>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className='btn btn-success btn-md' >
                        SUBMIT
                    </button>
                </div>
            </form>
            <br></br>
            {uploadError && <>
                <br></br>
                <div className='error-msg'>{uploadError}</div>

            </>}
            {loader}
            <ToastContainer />
        </div>
    );
};

