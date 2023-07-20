import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth } from './Config'
import {Link} from 'react-router-dom'
import useFullPageLoader from './useFullPageLoader';
// import {
//   Flex,
//   Box,
//   FormControl,
//   FormLabel,
//   Input,
//   Checkbox,
//   Stack,
//   Link,
//   Button,
//   Heading,
//   Text,
//   useColorModeValue,
// } from '@chakra-ui/react';
export const Login = () => {
  
  const navigate = useNavigate();

  // defining state

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loader, showLoader, hideLoader] = useFullPageLoader();

  const handleLogin = (e) => {
    e.preventDefault();
    showLoader();
    auth.signInWithEmailAndPassword(email, password).then(() => {
      setSuccessMsg('Login Successfull. You will now automatically get redirected to Home page');
      setEmail('');
      setPassword('');
      setErrorMsg('');
      setTimeout(() => {
        setSuccessMsg('');
        navigate('/adminpanel');
      }, 1000)
    }).catch(error => setErrorMsg(error.message)).then(() => { hideLoader() });
  }
  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate('/login');
    })
  }


  return (
        <div className='container'>
        <br></br>
        <br></br>
        <h1>Login</h1>
        <hr></hr>
        <br></br>
        {successMsg&&<>
        <div className='success-msg'>{
            successMsg}
            <br></br>
        </div>
        </>}
        <br></br>
        <form  className='form-group' autoComplete="off" onSubmit={handleLogin}>
            <label>Email</label>
            <input type="email" className='form-control' required 
            onChange={(e) => setEmail(e.target.value)} value={email}></input>
            <br></br>
            <label>Password</label>
            <input type="password" className='form-control' required
            onChange={(e) => setPassword(e.target.value)} value={password}></input>
            <br></br>
            <div className='btn-box'>
            <span>Don't have an account? Register
            <Link to="/register"> Here</Link>
            </span>
            <br></br>
            <br></br>
            <button type="submit" className='btn btn-success btn-md'>LOGIN</button>
            </div>
        </form>
        <br></br>
        {errorMsg&&<>
        <div className='error-msg'>{
            errorMsg}
            <br></br>
        </div>
        </>}
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
    //       <Heading fontSize={'4xl'}>Sign in to your account</Heading>
    //       <Text fontSize={'lg'} color={'gray.600'}>
    //         to bid and win amazing <Link color={'blue.400'}>products</Link> ✌️
    //       </Text>
    //     </Stack>
    //     <Box
    //       rounded={'lg'}
    //       bg={useColorModeValue('white', 'gray.700')}
    //       boxShadow={'lg'}
    //       p={8}>
    //       <Stack spacing={4}>
    //         <FormControl id="email">
    //           <FormLabel>Email address</FormLabel>
    //           <Input type="email"
    //             onChange={(e) => setEmail(e.target.value)} value={email}></Input>
    //         </FormControl>
    //         <FormControl id="password">
    //           <FormLabel>Password</FormLabel>
    //           <Input type="password"
    //             onChange={(e) => setPassword(e.target.value)} value={password} />
    //         </FormControl>
    //         <Stack spacing={10}>
    //           <Stack
    //             direction={{ base: 'column', sm: 'row' }}
    //             align={'start'}
    //             justify={'space-between'}>
    //             <Checkbox>Remember me</Checkbox>
    //             {/* <Link color={'blue.400'}>Forgot password?</Link> */}
    //           </Stack>
    //           <Button onClick={handleLogin}
    //             bg={'blue.400'}
    //             color={'white'}
    //             _hover={{
    //               bg: 'blue.500',
    //             }}>
    //             Login
    //           </Button>
    //           <Box>
    //             {successMsg && <>
    //               <div className='success-msg'>{
    //                 successMsg}
    //                 <br></br>
    //               </div>
    //             </>}
    //           </Box>
    //           <Box>
    //             {errorMsg && <>
    //               <div className='error-msg'>{
    //                 errorMsg}
    //                 <br></br>
    //               </div>
    //             </>}
    //           </Box>
    //           <Text align={'center'}>
    //               New user? <Link href='/register' color={'blue.400'}>Register</Link>
    //             </Text>
    //         </Stack>
    //       </Stack>
    //     </Box>
    //   </Stack>
    //   {loader}

    // </Flex>


  )
}
