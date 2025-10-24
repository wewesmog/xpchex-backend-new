'use client'

import React, { useState } from 'react'
// Get app id from url  
import { useParams } from 'next/navigation'
import { DataTable } from './data-table'
import { columns, type Review } from './columns'



export const Reviews: Review[] = [
  {
    id: '1',
    username: 'John Doe',
    // random image from https://picsum.photos/200/300
    user_image: `https://picsum.photos/200/300?random=${Math.random()}`,
    content: 'This is a review This is a review This is a review This is a review',
    score: 5,
    review_created_at: '2021-01-01',
    reply_content: 'This is a reply',
    reply_created_at: '2021-01-01',
    app_version: '1.0.0',
    thumbs_up_count: 10
  },
  {
    id: '2',
    username: 'Jane Smith',
    user_image: `https://picsum.photos/200/300?random=${Math.random()}`,
    content: 'Another review',
    score: 4,
    review_created_at: '2021-01-01',
    reply_content: 'This is a reply',
    reply_created_at: '2021-01-01',
    app_version: '1.0.0',
    thumbs_up_count: 10
  },
  {
    id: '3',
    username: 'John Doe',
    user_image: `https://picsum.photos/200/300?random=${Math.random()}`,
    content: 'This is a review',
    score: 5,
    review_created_at: '2021-01-01',
    reply_content: 'This is a reply',
    reply_created_at: '2021-01-01',
    app_version: '1.0.0',
    thumbs_up_count: 10
  }
]

export default function GoogleAppStoreReviews() {
  const { appId } = useParams()
  const data = Reviews


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-gray-500">App ID: {appId}</p>
        <h1 className="text-2xl font-bold">Google Play Store Reviews</h1>
      </div>
      
      {/* Your reviews table component will go here */}
      <div className="bg-white shadow rounded-lg p-6">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
} 