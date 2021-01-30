import React, {useState} from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container, TextField } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import  { GoogleLogin} from "react-google-login";
import usestyle from './style';
import Input from './Input';
import Icon from './icon';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import {signin, signup} from '../../actions/auth';

const initialState = { firstName:'', lastName: '', email:'', password:'', confirmPassword: '' }

function Auth() {
    

    const classes = usestyle();
    const [showPassword, setShowPassword] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const history = useHistory();
    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

    const handleSubmit = (e) => {
        e.preventDefault();
        

        if(isSignup){
            dispatch(signup(formData, history))
        } else{
            dispatch(signin(formData, history))
        }
    }; 

    const handleChange = (e) => {

        setFormData({ ...formData, [e.target.name]: e.target.value});
    }

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
    }

    const googleSuccess = async (res) => {
        const result = res?.profileObj; //cannot get property
        const token  = res?.tokenId;

        try{
            dispatch({type: 'AUTH', data: { result, token}});
            history.push('/');
        }
        catch(error){
            console.log(error);
        }
    }

    const googleFailure = () => {
        console.log("google signin was unsuccessful try again later")
    }
    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                
                <Typography component="h1" variant="h5">{ isSignup ? 'Sign up' : 'Sign in' }</Typography>
                
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        { isSignup && (
                            <> 
                                    <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                                    <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                            </>
                        )}
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email"/>
                        <Input name="password" 
                                        label="Password"
                                         handleChange={handleChange} 
                                        type={showPassword ? 'text' : 'password'} 
                                        handleShowPassword={handleShowPassword}
                         />
                         { isSignup && 
                                <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" /> 
                         }
                         <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                                { isSignup ? 'Sign Up' : 'Sign In' }
                         </Button>

                         <GoogleLogin
                            clientId="1017046956116-fpp29a8v4vn7up671elu0m3hn89pno4p.apps.googleusercontent.com"
                            render={(renderProps)  => (
                                    <Button className={classes.googleButton} color='primary' fullWidth 
                                    onClick={renderProps.onClick} disabled={renderProps.disabled} 
                                    startIcon={<Icon/>}
                                    variant="contained">
                                        Google Signin
                                    </Button>
                            )}
                            onSuccess={googleSuccess}
                            onFailure={googleFailure}
                            cookiePolicy="single_host_origin"
                         
                         />

                         <Grid container justify="flex-end">
                            <Button onClick={switchMode}>
                                { isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign Up" }
                            </Button>
                         </Grid>
                         
                    </Grid>

                </form>
            </Paper>
        </Container>
    )
}

export default Auth
