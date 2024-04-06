import React from 'react'
import image from './warning.png'

export const Notfound = () => {
 
    return (
      <>
     <div class="alert alert-danger" role="alert">
       You does not have a right to access this content. 
       <a href="/login" class="alert-link">Click here to Log in</a>.
     </div>
     <img src={image}   class="rounded mx-auto d-block" alt="..."></img>
    </>
    )
}
