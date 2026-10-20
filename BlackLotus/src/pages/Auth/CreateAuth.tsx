import { useForm } from "react-hook-form";
import Button from "../../components/shared/Button"
import Input from "../../components/shared/Input"


const name = "name"
const email = "email"
const password = "password"
const defaultValues = {name, email, password}
const CreateAuth = ({callback = () => {}}) => {
    const {
        setValue,
        getValues,
        // formState: { errors, isDirty, isSubmitting, isValid },
    } = useForm({ mode: 'onChange', defaultValues })

    const submitHandler = (event: any) => {
        event.preventDefault();
        callback(getValues());
    }

    const inputHandler = (data:any) => {
        return setValue(data.id, data.value)
    }

    return (
    <>

        <h1 className="p-8">
            Create your Account
        </h1>

        <div className="p-12 shadow-md rounded-[4%] bg-violet-400">
            <form name="account"className="flex flex-col gap-4" onSubmit={submitHandler}>
                <Input id="name" label="Full Name" placeholder="Jane Doe" callback={inputHandler}/>
                <Input id="email" label="Email Address" placeholder="jane.doe@mnsu.edu" type="email" callback={inputHandler}/>
                <Input id="password" label="Password" type="password" callback={inputHandler}/>
                <Button className="bg-violet-200 w-full" text="Create Account" type="submit" />
            </form>
        </div>

    </>



    )



}
export default CreateAuth