'use client'

import { DraggableCardDemo } from '@/components/DraggableCardDemo'
import { FocusCardsDemo } from '@/components/FocusCardsDemo'
import { GridBackgroundDemo } from '@/components/ui/GridBackgroundDemo'
import React, { useState } from 'react'

const Photos = () => {
  const [showDraggable, setShowDraggable] = useState(true)

  const toggleComponent = () => {
    setShowDraggable(prev => !prev)
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Background Layer */}
      <div
        style={{
          position: 'fixed', // stays fixed while scrolling
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none' // allows clicks through the background
        }}
      >
        <GridBackgroundDemo />
      </div>

      {/* Foreground Content */}
      <div
  style={{
    position: 'relative',
    zIndex: 1,
    padding: '20px',
    textAlign: 'center', // <-- centers h1 and p
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }}
>

        {/* Heading and Paragraph */}
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px', alignContent: 'center', fontFamily: 'cursive'}}>
          📸 Welcome to My Lens View!
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '30px', fontFamily:'fantasy'}}>
          Step into my world of captured moments — a place where every photo tells a story. From spontaneous street shots to serene landscapes, here’s where I share the world as seen through my camera. Dive in, get inspired, and see what caught my eye!
        </p>

        {/* Toggle Button aligned to the right */}
  <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
    <button
      onClick={toggleComponent}
      style={{
        padding: '10px 20px',
        background: '#ff5722',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background 0.3s'
      }}
      onMouseOver={(e) => (e.target.style.background = 'lightgray')}
      onMouseOut={(e) => (e.target.style.background = 'gray')}
    >
      {showDraggable ? 'Click here' : 'Click here'}
    </button>
  </div>

        {showDraggable ? <DraggableCardDemo /> : <FocusCardsDemo />}
      </div>
    </div>
  )
}

export default Photos
