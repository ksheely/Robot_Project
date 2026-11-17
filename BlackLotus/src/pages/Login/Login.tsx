import { useCustomFetch } from "../../hooks"
import { useSetAtom } from "jotai"
import { currentUserAtom } from "../../data/atoms/currentUserAtom"
import { isUserLoggedInAtom } from "../../data/atoms/isUserLoggedIn"
import { useLocation } from "wouter"
import { useEffect } from "react"
import LoginUser from "../../components/containers/LoginUser"

const url = `http://localhost:8000/login`;
const Login = () => {
    
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
            console.log("LoginUserContainer response: ", response);

            setIsUserLoggedIn(true)
            navigate('/')
        }
        if (error) {
            console.error("LoginUserContainer error: ", error);
        }
    }, [response, error]);

    const LoginUserCallback = (formData: any) => {
        request.post({data: formData})
    }

    return (
        <LoginUser callback={LoginUserCallback} />
    )




}
export default Login