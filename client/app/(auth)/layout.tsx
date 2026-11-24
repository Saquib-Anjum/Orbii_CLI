import React from 'react'
interface Children{
  children:React.ReactNode
}
function AuthLayout({children}:Children) {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      {children}
    </div>
  )
}

export default AuthLayout
