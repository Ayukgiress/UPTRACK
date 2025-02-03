import React from 'react'
import { MessageSquare } from 'lucide-react'

export default function NoChatSelected() {


  return (
    <div className='w-full flex flex-1 flex-col items-center justify-center p-16 bg-white'>
      <div className='max-w-md text-center space-y 6'>
         <div className='flex justify-center gap-4 mb-4'>
            <div className='relative'>
                <div className='w-16 h-16 rounded-2xl bg-white flex items-center justify-center animate-bounce'>
                 <MessageSquare className='w8 h-8 text-black'/>
                </div>

            </div>
         </div>

         <h2 className='text-2xl font-bold'>Welcome to Chat</h2>
         <p className='text-base'>
          select a conversation from sidebar to start chating
         </p>
      </div>
    </div>
  )
}
