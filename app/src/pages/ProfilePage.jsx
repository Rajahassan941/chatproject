import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Camera } from 'lucide-react'

const ProfilePage = () => {
  const {authUser,isUpdatingProfile,updateProfile}=useAuthStore()
  const onSubmit = () => {

  }
  return (
    <div className='h-screen pt-20'>
      <div className='max-w-2xl mx-auto p-4 py-8'>
        <div className='bg-base-300 rounded-xl p-6 space-y-8'>
          <div className='text-center'>
            <h1 className='text-2xl font-semibold'> Profile</h1>
            <p className='mt-2'>Your profile information</p>
          </div>
{/* avatar */}
<div className='flex flex-col items-center gap-4'>
  <div className='relative'>
    <img src={authUser.profilePicture || "/avatar.png"} alt="profile" className='size-32 rounded-full object-cover border-4' />
    <label htmlFor='avatar-upload' className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${isUpdatingProfile}? "animate-pulse pointer-events-none":""`}>
<Camera className='w-5 h-5 text-base-200'/>
<input type='file' id='avatar-upload' className='hidden' accept='image/*' onChange={onSubmit} disabled={isUpdatingProfile}/>
    </label>

  </div>
  <p className='text-sm text-zinc-400'>{isUpdatingProfile?"Uploading":"Click on icon to update your photo"}</p>

</div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage