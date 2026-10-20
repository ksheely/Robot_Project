import React from 'react'
import CreateAuth from '../../pages/Auth/CreateAuth'


const url = `http://localhost:8000/users`;
const CreateUserContainer = () => {
    const CreateUserCallback = async (formData: any) => {
        console.log("CreateUserCallback called with formData:", formData);
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(formData)
        })
        const data = await response.json()
        console.log(data)
    }

    return (
        
         <CreateAuth callback={CreateUserCallback} />
        
    )
}

export default CreateUserContainer