'use client'

import { DraggableCardDemo } from '@/components/ui/DraggableCardDemo'
import { FocusCardsDemo } from '@/components/ui/FocusCardsDemo'
import { GridBackgroundDemo } from '@/components/ui/GridBackgroundDemo'
import { FloatingNav } from '@/components/ui/FloatingNav'
import { navItems } from '@/data'
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
      <div className="relative z-10 px-4 py-8 flex flex-col items-center ">
        {/* Heading and Paragraph */}
        <div className="relative z-10">
          {/* <h1 className="text-4xl font-bold mb-4 text-center font-cursive">
            Welcome to My Lens View!
          </h1> */}
          <p className="text-2xl text-muted-foreground  text-center max-w-2l font-fantasy mt-20 ">
            From fleeting city lights to calm horizons, my photography reflects the way I see the world — vibrant, curious, and full of detail.
            <br /> Discover the world through my lens and experience the beauty in everyday scenes.
          </p>
        </div>

        {/* Toggle Button */}
        {/* <div className="w-full flex justify-end mb-8 relative z-10">
          <Button
            onClick={toggleComponent}
            variant="outline"
            className="hover:bg-accent"
          >
            {showDraggable ? 'Switch to Focus View' : 'Switch to Grid View'}
          </Button>
        </div> */}

        {/* Draggable/Focus Cards Container */}
        <div className="relative z-20 w-full">
          {showDraggable ? <FocusCardsDemo /> : <DraggableCardDemo />} 
        </div>
      </div>

      <FloatingNav navItems={navItems} />
    </div>
  )
}

export default Photos
