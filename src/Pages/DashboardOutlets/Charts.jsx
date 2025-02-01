import React from 'react'
import { useChatStore } from '../../Components/Store/useChatStore'
import ChatSideBar from '../../Components/ChatSideBar'
import ChatContainer from '../../Components/ChatContainer'
import NoChatSelected from '../../Components/NoChatSelected'

export default function Charts() {
  const {selectedUser} = useChatStore()

  return (
    <div className=' h-screen bg-current'>
      <div className='flex items-center justify-center pt-20 px-4'>
         <div className='bg-custom-background rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem'>
              <div className='flex h-full rounded-lg overflow-hidden'>
                 <ChatSideBar/>

                 {!selectedUser ? <NoChatSelected/> : <ChatContainer/>}
              </div>
         </div>
      </div>
    </div>
  )
}
