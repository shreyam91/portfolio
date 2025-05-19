'use client'

import { DraggableCardDemo } from '@/components/DraggableCardDemo'
import { FocusCardsDemo } from '@/components/FocusCardsDemo'
import { GridBackgroundDemo } from '@/components/ui/GridBackgroundDemo'
import { FloatingNav } from '@/components/FloatingNav'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

const Photos = () => {
  const [showDraggable, setShowDraggable] = useState(true)

  const toggleComponent = () => {
    setShowDraggable(prev => !prev)
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <GridBackgroundDemo />
      </div>

      {/* Foreground Content */}
      <div className="relative z-1 px-4 py-8 flex flex-col items-center">
        {/* Heading and Paragraph */}
        <h1 className="text-4xl font-bold mb-4 text-center font-cursive">
          📸 Welcome to My Lens View!
        </h1>
        <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl font-fantasy">
          Step into my world of captured moments — a place where every photo tells a story. From spontaneous street shots to serene landscapes, here's where I share the world as seen through my camera. Dive in, get inspired, and see what caught my eye!
        </p>

        {/* Toggle Button */}
        <div className="w-full flex justify-end mb-8">
          <Button
            onClick={toggleComponent}
            variant="outline"
            className="hover:bg-accent"
          >
            {showDraggable ? 'Switch to Focus View' : 'Switch to Grid View'}
          </Button>
        </div>

        {showDraggable ? <DraggableCardDemo /> : <FocusCardsDemo />}
      </div>

      <FloatingNav />
    </div>
  )
}

export default Photos
