//here we connect backend with frontend using context api
import React, { createContext, useState } from 'react'

//create context for auth data
export const authDataContext = createContext()
//server url for backend connection 
let serverURL= "http://localhost:8000"







function AuthContext({children}) {
  let[loading,setLoading]=useState(false)



let value={
  serverURL,
  loading,setLoading
}




  return (
    <div>
        {/* //this means all the children components will have access to auth data like app.jsx here childeren is app.jsx */}
        {/* //value provide the server url to all the children components */}
   <authDataContext.Provider value={value}>
    
    {children}

   </authDataContext.Provider>

    </div>
  )
}

export default AuthContext