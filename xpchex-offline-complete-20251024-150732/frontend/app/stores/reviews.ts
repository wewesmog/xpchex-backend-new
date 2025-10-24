// This file is used to store the reviews data for the app
// Zustand is used to store the reviews data

import { create } from "zustand"

export type Review = {
    id: string
    text: string
    rating: number
    author: string
    author_image_url: string
    date: string
    sentiment: 'positive' | 'negative' | 'neutral'
}

export type ReviewsSummary = {
    review_ai_summary: string
    total_reviews: number
    total_positive_reviews: number
    total_negative_reviews: number
    total_neutral_reviews: number
    total_positive_reviews_percentage: number
    total_negative_reviews_percentage: number
    total_neutral_reviews_percentage: number
}

export type ReviewsStore = {
    reviews: Review[]
    reviewsSummary: ReviewsSummary
    // setReviews: (reviews: Review[]) => void
}



export const useReviewsStore = create<ReviewsStore>((set) => ({
    reviewsSummary: {
        review_ai_summary: "most customers are happy with the app, but some are not. The app is not working as expected.",
        total_reviews: 100,
        total_positive_reviews: 80,
        total_negative_reviews: 20,
        total_neutral_reviews: 23,
        total_positive_reviews_percentage: 80,
        total_negative_reviews_percentage: 23,
        total_neutral_reviews_percentage: 20,
    },
    reviews: [
        {
            id: "1",
            text: "Hey @KCB, the app is quite good, and very intuitive making using it very easy. I love it. However, lastest release has some bugs. When sending to mobile the seleted contact from the contact list isn't populated on the phone number field. The interactivity of most of the buttons have regressed, it's no longer snappy like before I updated like three days ago. The buttons also apper with the text cropped and it's like they have some offset. Just minor issues. Like I said it's very useful app.",
            rating: 5,
            date: "2021-01-01",
            sentiment: "positive",
            author: "James Doe",
            author_image_url: "https://play-lh.googleusercontent.com/a-/ALV-UjU6ZHLQIXmvMmlxiBNx050PhpTMjonFSbaCiBFdH0ieSLcexy29=s32-rw",
        },
        {
            id: "2",
            text: "Nice app, reduces my visits to the atm and purchase of credit for ussd codes. But I can't give full five star because lately I have been experiencing a challenge. When sending money to mobile, it is impossible for me to key in the authorization code and the app also doesn't auto read the codes anymore. They end up getting timed out and the app tells me to resend and it becomes a cycle. Developers team kindly check on that.",
            rating: 4,
            date: "2021-01-01",
            sentiment: "neutral",
            author: "kil Doe",
            author_image_url:  "https://play-lh.googleusercontent.com/a-/ALV-UjU6ZHLQIXmvMmlxiBNx050PhpTMjonFSbaCiBFdH0ieSLcexy29=s32-rw",
        },
        {
            id: "3",
            text: "IHere's my two cents worth of wisdom. Not everyone has the liberty to change phones with each new OS upgrade. Some people can have a single phone for 10yrs in near-perfect condition. (Think if it ain't broken don't fix it) You could carter for these people as well by having legacy versions of your app, with the limited functionality available at the time of last support (with a disclaimer), then have newer versions that require a more recent OS with full updated functionality and security..",
            rating: 2,
            date: "2021-01-01",
            sentiment: "negative",
            author: "kgds Doe",
            author_image_url:  "https://play-lh.googleusercontent.com/a-/ALV-UjU6ZHLQIXmvMmlxiBNx050PhpTMjonFSbaCiBFdH0ieSLcexy29=s32-rw",
        },
        {
            id: "4",
            text: "I'm so frustrated with this app. It's not working as expected.",
            rating: 1,
            date: "2021-01-01",
            sentiment: "negative",
            author: "etru Doe",
            author_image_url:  "https://play-lh.googleusercontent.com/a-/ALV-UjU6ZHLQIXmvMmlxiBNx050PhpTMjonFSbaCiBFdH0ieSLcexy29=s32-rw",
        },
        {
            id: "5",
            text: "I'm so frustrated with this app.",
            rating: 1,
            date: "2021-01-01",
            sentiment: "negative",
            author: "dfd Doe",
            author_image_url:  "https://play-lh.googleusercontent.com/a-/ALV-UjU6ZHLQIXmvMmlxiBNx050PhpTMjonFSbaCiBFdH0ieSLcexy29=s32-rw",
        },
    ],
    
}))
