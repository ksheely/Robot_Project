import { useEffect } from "react"
import { useCustomFetch } from "../../../hooks/useCustomFetch"

const url = `http://localhost:8000/users`;
const ApiTest = () => {
    const { request, response, error } = useCustomFetch(url);
    useEffect(() => {
        if (response) {
            console.log("ApiTest response: ", response);
        }
        if (error) {
            console.error("ApiTest error: ", error);
        }
    }, [response, error]);

    useEffect(() => {
        request.get();
    }, []);

    return (
        <div>
            
        </div>
    )
}

export default ApiTest


//     // 2. Convert params into a query string ("userId=123&category=books")
//     const queryString = new URLSearchParams(params).toString();
//     const url = `https://example.com{queryString}`;

//     // 3. Execute the GET request (no body allowed)
//     fetch(url)
//       .then(response => response.json())
//       .then(result => setData(result))
//       .catch(error => console.error("Error:", error));
//   }, []);

//   return <div>{/* Render your data here */}</div>;
// }
