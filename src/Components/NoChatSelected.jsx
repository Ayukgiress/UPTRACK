import React from 'react'
import { MessageSquare } from 'lucide-react'

export default function NoChatSelected() {
  return (
    <div className='w-full flex flex-1 flex-col items-center justify-center p-16 bg-gradient-to-br from-base-100 to-base-200 min-h-[60vh]'>
      <div className='max-w-md text-center space-y-8'>
        <div className='flex justify-center gap-4 mb-6'>
          <div className='relative'>
            <div className='w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary-focus flex items-center justify-center shadow-xl animate-pulse'>
              <MessageSquare className='w-10 h-10 text-primary-foreground'/>
            </div>
            <div className='absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-base-100 animate-ping'></div>
            <div className='absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-base-100'></div>
          </div>
        </div>

        <div className='space-y-4'>
          <h2 className='text-3xl font-bold text-base-content bg-gradient-to-r from-primary to-primary-focus bg-clip-text text-transparent'>
            Welcome to Chat
          </h2>
          <p className='text-base-content/70 text-lg leading-relaxed'>
            Select a conversation from the sidebar to start chatting
          </p>
        </div>

        <div className='flex justify-center'>
          <div className='w-32 h-1 bg-gradient-to-r from-primary to-primary-focus rounded-full opacity-50'></div>
        </div>
      </div>
    </div>
  )
}
