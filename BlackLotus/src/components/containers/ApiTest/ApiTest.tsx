import { useState, useEffect } from "react"

const ApiTest = () => {


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


useEffect(() => {
        const params = { 
      id: '1'
    };    
    
    // 2. Convert params into a query string ("userId=123&category=books")
    const queryString = new URLSearchParams(params).toString();
    const url = `http://localhost:8000/users?${queryString}`;


const getapi = async () => {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json", 
            "Access-Control-Allow-Origin": "*"
        }
    })
    const exampleHeader = response.headers.get('Content-Type');
    console.log("exampleHeader ", exampleHeader);
    response.headers.forEach((value, key) => {
        console.log(`${key} ==> ${value}`);
    });
    console.log(response)
    const data = await response.json()
    console.log(data)
}

getapi()
}, [])


return (
    <div>
        
    </div>
    )
}

export default ApiTest
