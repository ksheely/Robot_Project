import {useEffect} from 'react'
import CreateAuth from '../../pages/Auth/CreateAuth'
import {useCustomFetch} from '../../hooks/useCustomFetch'
import { useSetAtom } from 'jotai'
import { currentUserAtom } from '../../data/atoms/currentUserAtom'
import { isUserLoggedInAtom } from '../../data/atoms/isUserLoggedIn' 
import { useLocation } from "wouter"   


// TODO: steps for frontend user session: 
// √1. return created user from backend 
// 2. either save user in local storage or in a global state (like Jotai) (npm install jotai)
// 3. redirect user to home page or dashboard
// 4. disable button when fetching create user and when fields are enpty or invalid



// TODO: best practices for user session management:
// 1. use JWT(JSON Web Tokens) tokens for authentication and authorization
// 2. store JWT tokens in httpOnly cookies to prevent XSS attacks
// 3. use refresh tokens to renew access tokens when they expire
// 4. implement logout functionality to clear tokens and user data
const url = `http://localhost:8000/users`;
const CreateUserContainer = () => {
    const {request, response, error} = useCustomFetch(url);
    const setCurrentUser = useSetAtom(currentUserAtom)
    const setIsUserLoggedIn = useSetAtom(isUserLoggedInAtom)
    const [location, navigate] = useLocation();

    useEffect(() => {
        if (response) {
            setCurrentUser({
                id: response.id,
                name: response.name,
                email: response.email,
            })
            console.log("CreateUserContainer response: ", response);

            setIsUserLoggedIn(true)
            navigate('/')
        }
        if (error) {
            console.error("CreateUserContainer error: ", error);
        }
    }, [response, error]);
    
    const CreateUserCallback = async (formData: any) => {
        request.post({data: formData})
    }

    return (
        
         <CreateAuth callback={CreateUserCallback} />
        
    )
}

export default CreateUserContainer