import React, { useState } from 'react'
import { auth, fs, storage } from './Config'
import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import useFullPageLoader from './useFullPageLoader'
import imageCompression from 'browser-image-compression';
// import {
//   Flex,
//   Box,
//   FormControl,
//   FormLabel,
//   Input,
//   InputGroup,
//   HStack,
//   InputRightElement,
//   Stack,
//   Button,
//   Heading,
//   Text,
//   useColorModeValue,
//   Link,
//   VStack,
//   Progress,
// } from '@chakra-ui/react';

// import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const now = Date.now();
  var date = new Date();
  var selectedFile;
  // defining state
  const [fullname, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  // const [refcode, setRefCode] = useState('');
  const [image, setImage] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [imageError, setImageError] = useState('');
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [uploadError, setUploadError] = useState('');
  const types = ['image/jpg', 'image/jpeg', 'image/png', 'image/PNG', 'image/webp','image/jfif'];
  const handleProfileImg = (e) => {
    selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && types.includes(selectedFile.type)) {
        setImageError('');
        var options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 512,
          useWebWorker: true
        }
        imageCompression(selectedFile, options)
          .then(function (compressedFile) {
            setImage(compressedFile);
            setSuccessMsg('Image set successful');

          })
          .catch(function (error) {
            console.log(error.message);
          });
      }
      else {
        setImage(null);
        setImageError('Please select a valid image file type (png or jpg)')
      }
    }
    else {
      console.log('Please select your file');
    }
  }

  // Register
  const handelRegister = (e) => {
    e.preventDefault();
    showLoader();
    if (image != null) {
      showLoader();
      const uref = auth.createUserWithEmailAndPassword(email, password)
      uref.then((credentials) => {
        fs.collection('users').doc(credentials.user.uid).set({
          FullName: fullname,
          Email: email,
          Phone: Number(phone),
          Password: password,
          Created: date
        }).then(() => {
          const uploadTask = storage.ref(`profile-images/${image.name + now}`).put(image);
          uploadTask.on('state_changed', snapshot => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log(progress);
          }, error => setErrorMsg(error.message), () => {
            storage.ref('profile-images').child(image.name + now).getDownloadURL().then(url => {
              fs.collection('users').doc(credentials.user.uid).update({
                ProfileImage: url
               
              }).then(() => {
                    showLoader();
                    setSuccessMsg('Register Successfull. You will now automatically get redirected to Admin');
                    setFullName('');
                    setErrorMsg('');
                    setEmail('');
                    setPhone('');
                    setImage(null);
                    setPassword('');
                   
                    setImageError('');
                    setTimeout(() => {
                      setSuccessMsg('');
                      navigate('/');
                    }, 1000)
              })
            }).catch(err => setErrorMsg(err.message)).then(() => hideLoader());
          })
        }).catch(err => setErrorMsg(err.message)).then(() => hideLoader());
      }).catch(err => setErrorMsg(err.message)).then(() => hideLoader());
    } else {
      setImageError('please select a valid image file type (png or jpg)');
      hideLoader();
    }

  }

  return (
    <div className='container'>
    <br></br>
    <br></br>
    <h1>Register</h1>
    <hr></hr>
    <br></br>
    {successMsg&&<><div className='success-msg'>{successMsg}<br></br></div></>}
    <br></br>
    <form  className='form-group' autoComplete="off" onSubmit={handelRegister}>
        <label>Full Name</label>
        <input type="text" className='form-control' required
        onChange={(e) => setFullName(e.target.value)} value={fullname}></input>
        <br></br>
        <label>Phone</label>
        <input type="phone" className='form-control' required
        onChange={(e) => setPhone(e.target.value)} value={phone}></input>
        <br></br>
        <label>Email</label>
        <input type="email" className='form-control' required
        onChange={(e) => setEmail(e.target.value)} value={email}></input>
        <br></br>
        <label>Password</label>
        <input type="password" className='form-control' required
        onChange={(e) => setPassword(e.target.value)} value={password}></input>
        <br></br>
        {/* <label>Referral code</label>
        <input type="refcode" className='form-control' 
        onChange={(e) => setRefCode(e.target.value)} value={refcode}>
        </input> */}
        <br></br>
        <label>Upload Profile Image</label>
            <input type="file" id="file" className='form-control' required
            onChange={handleProfileImg}></input>
            {imageError&&<>
                <br></br>
                <div className='error-msg'>{imageError}</div>
            </>}
            <br></br> 
            
        <div className='btn-box'>
        <span>Already have an account? Login
        <Link to="/login"> Here</Link>
        </span>
  
        <br></br>
        <br></br>
        <button type="submit" className='btn btn-success btn-md'>SUBMIT</button>
        <br></br>
     
        </div>
    </form>
    <br></br>
    {errorMsg&&<><div className='error-msg'>{errorMsg}
    <br></br></div></>}
    <br></br>
    {loader}
    </div>
    // <Flex
    //   minH={'100vh'}
    //   align={'center'}
    //   justify={'center'}
    //   bg={useColorModeValue('gray.50', 'gray.800')}>
    //   <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
    //     <Stack align={'center'}>
    //       <Heading fontSize={'4xl'} textAlign={'center'}>
    //         Create a new account
    //       </Heading>
    //       <Text fontSize={'lg'} color={'gray.600'}>
    //         change your life for good
    //       </Text>
    //     </Stack>
    //     <Box
    //       rounded={'lg'}
    //       bg={useColorModeValue('white', 'gray.700')}
    //       boxShadow={'lg'}
    //       p={8}>
    //       <Stack spacing={4}>
    //         <FormControl id="firstName" isRequired>
    //           <FormLabel>Full Name</FormLabel>
    //           <Input type="text"
    //             onChange={(e) => setFullName(e.target.value)} value={fullname} />
    //         </FormControl>
    //         <FormControl id="email" isRequired>
    //           <FormLabel>Email address</FormLabel>
    //           <Input type="email"
    //             onChange={(e) => setEmail(e.target.value)} value={email} />
    //         </FormControl>
    //         <FormControl id="phone" isRequired>
    //           <FormLabel>Phone number</FormLabel>
    //           <Input type="phone"
    //             onChange={(e) => setPhone(e.target.value)} value={phone} />
    //         </FormControl>
    //         <FormControl id="password" isRequired>
    //           <FormLabel>Password</FormLabel>
    //           <InputGroup>
    //             <Input type={showPassword ? 'text' : 'password'}
    //               onChange={(e) => setPassword(e.target.value)} value={password} />
    //             <InputRightElement h={'full'}>
    //               <Button
    //                 variant={'ghost'}
    //                 onClick={() =>
    //                   setShowPassword((showPassword) => !showPassword)
    //                 }>
    //                 {showPassword ? <ViewIcon /> : <ViewOffIcon />}
    //               </Button>
    //             </InputRightElement>
    //           </InputGroup>
    //         </FormControl>
    //         <FormControl id="refcode" >
    //           <FormLabel>Referal code (Optional)</FormLabel>
    //           <Input
    //             onChange={(e) => setRefCode(e.target.value)} value={refcode} />
    //         </FormControl>
    //         <VStack>
    //         </VStack>
    //         <Stack spacing={10} pt={2}>
    //           <FormControl>
    //             <input type="file" id="file" required className='form-control'
    //               onChange={handleProfileImg}></input>
    //           </FormControl >
    //         </Stack>
    //         <Stack spacing={10} pt={2}>
    //           <Button
    //             onClick={handelRegister}
    //             loadingText="Submitting"
    //             size="lg"
    //             bg={'blue.400'}
    //             color={'white'}
    //             _hover={{
    //               bg: 'blue.500',
    //             }}>
    //             Register
    //           </Button>
    //         </Stack>
    //         <Box>
    //           {successMsg && <>
    //             <div className='success-msg'>{
    //               successMsg}
    //               <br></br>
    //             </div>
    //           </>}
    //         </Box>
    //         <Box>
    //           {errorMsg && <>
    //             <div className='error-msg'>{
    //               errorMsg}
    //               <br></br>
    //             </div>
    //           </>}
    //         </Box>
    //         <Box>
    //           {imageError && <>
    //             <br></br>
    //             <div className='error-msg'>{imageError}
    //               <br></br>
    //             </div>
    //           </>}
    //         </Box>
    //         {loader}
    //         <Stack pt={6}>
    //           <Text align={'center'}>
    //             Already a user? <Link href='/login' color={'blue.400'}>Login</Link>
    //           </Text>
    //         </Stack>
    //       </Stack>
    //     </Box>
    //   </Stack>
    // </Flex>
  )
}
