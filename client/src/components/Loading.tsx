import { Loader2 } from 'lucide-react'
import React from 'react'

const Loading = () => {
  return (
    <div className="loading">Loading
    <Loader2 className="loading__spinner" />
    <span className= "loading__text">Please wait...</span>
    </div>
  )
}

export default Loading