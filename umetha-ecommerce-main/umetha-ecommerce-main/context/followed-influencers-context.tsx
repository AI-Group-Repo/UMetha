"use client"

import { createContext, useState, useContext, useEffect, ReactNode } from 'react'
import { useToast } from '@/hooks/use-toast'

type InfluencerId = number
type FollowedInfluencer = {
  id: InfluencerId
  name: string
  avatar: string
  category: string
  followedAt: Date
}

interface FollowedInfluencersContextType {
  followedInfluencers: FollowedInfluencer[]
  isFollowing: (influencerId: InfluencerId) => boolean
  follow: (influencer: Omit<FollowedInfluencer, 'followedAt'>) => void
  unfollow: (influencerId: InfluencerId) => void
  getFollowCount: () => number
}

const FollowedInfluencersContext = createContext<FollowedInfluencersContextType | undefined>(undefined)

export function FollowedInfluencersProvider({ children }: { children: ReactNode }) {
  const [followedInfluencers, setFollowedInfluencers] = useState<FollowedInfluencer[]>([])
  const [loaded, setLoaded] = useState(false)
  const { toast } = useToast()

  // Load followed influencers from localStorage on mount
  useEffect(() => {
    const storedFollowedInfluencers = localStorage.getItem('followedInfluencers')
    if (storedFollowedInfluencers) {
      try {
        const parsed = JSON.parse(storedFollowedInfluencers)
        // Convert stored date strings back to Date objects
        const withDates = parsed.map((inf: any) => ({
          ...inf,
          followedAt: new Date(inf.followedAt),
        }))
        setFollowedInfluencers(withDates)
      } catch (error) {
        console.error('Failed to parse followedInfluencers from localStorage', error)
        // Reset if corrupted
        localStorage.removeItem('followedInfluencers')
      }
    }
    setLoaded(true)
  }, [])

  // Save to localStorage whenever followedInfluencers changes
  useEffect(() => {
    if (loaded) {
      localStorage.setItem('followedInfluencers', JSON.stringify(followedInfluencers))
    }
  }, [followedInfluencers, loaded])

  const isFollowing = (influencerId: InfluencerId) => {
    return followedInfluencers.some((inf) => inf.id === influencerId)
  }

  const follow = (influencer: Omit<FollowedInfluencer, 'followedAt'>) => {
    if (isFollowing(influencer.id)) return

    const newFollowedInfluencer = {
      ...influencer,
      followedAt: new Date(),
    }

    setFollowedInfluencers((prev) => [...prev, newFollowedInfluencer])
    
    toast({
      title: 'Following',
      description: `You're now following ${influencer.name}`,
      duration: 3000,
    })
  }

  const unfollow = (influencerId: InfluencerId) => {
    const influencer = followedInfluencers.find((inf) => inf.id === influencerId)
    if (!influencer) return

    setFollowedInfluencers((prev) => prev.filter((inf) => inf.id !== influencerId))
    
    toast({
      title: 'Unfollowed',
      description: `You've unfollowed ${influencer.name}`,
      duration: 3000,
    })
  }

  const getFollowCount = () => followedInfluencers.length

  return (
    <FollowedInfluencersContext.Provider
      value={{
        followedInfluencers,
        isFollowing,
        follow,
        unfollow,
        getFollowCount,
      }}
    >
      {children}
    </FollowedInfluencersContext.Provider>
  )
}

export const useFollowedInfluencers = () => {
  const context = useContext(FollowedInfluencersContext)
  if (context === undefined) {
    throw new Error('useFollowedInfluencers must be used within a FollowedInfluencersProvider')
  }
  return context
}
