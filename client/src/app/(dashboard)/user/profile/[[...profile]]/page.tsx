import  Header from '@/components/Header'
import React from 'react'
import {UserProfile} from "@clerk/nextjs"
import { dark } from '@clerk/themes'

// This page is used to display the user profile using Clerk's UserProfile component
const UserProfilePage = () => {
  return (
    <>
        <Header title="Profile" subtitle ="View your profile" />
        <UserProfile 
        path="/user/profile"
        routing="path"
        appearance={{
          baseTheme: dark,
          elements: {
            scrollBox: "bg-customgreys-darkGrey",
            navbar: {
              "& > div:nth-child(1)":{
                background: "none"
              },
            },
          },
        }}
            />
    </>
  )
}

export default UserProfilePage