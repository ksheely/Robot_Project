import Button from "../../components/shared/Button"
import Input from "../../components/shared/Input"
import RouteLink from "../../components/shared/RouteLink"
import { useForm } from 'react-hook-form'


const email = "email"
const password = "password"
const defaultValues = {email, password}
type AuthValues = { email: string; password: string };
type LoginAuthProps = { callback?: (values: AuthValues) => void };
const LoginUser = ({callback = () => {}}: LoginAuthProps) => {
    const {
        setValue,
        getValues,
        // formState: { errors, isDirty, isSubmitting, isValid },
    } = useForm({ mode: 'onChange', defaultValues })

    const submitHandler = (event: any) => {
        console.log("form submitted", getValues());
        event.preventDefault();
        callback(getValues());
    }

    const inputHandler = (data:any) => {
        return setValue(data.id, data.value)
    }


    return (
    <div className="bg-violet-200">

        <h1 className="p-8">
            Sign into your account
        </h1>

        <div className="p-12 shadow-md rounded-[4%] bg-violet-400">
            <form name="account"className="flex flex-col gap-4" onSubmit={submitHandler}>
                <Input id={email} label="Email Address" placeholder="jane.doe@mnsu.edu" type="email" callback={inputHandler} />
                <div className="flex-col flex ">
                    <Input id={password} label="Password" type="password" callback={inputHandler} />
                    <div className="text-right" style={{width:"100%"}}>
                        <RouteLink text="forgot password?" href="/home" />
                    </div>
                </div>
                <Button className="bg-violet-200 w-full" text="Log In" type="submit" />
            </form>
        </div>

    </div>

    )



}
export default LoginUser