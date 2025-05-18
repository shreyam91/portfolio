"use client"

import { DraggableCardDemo } from '@/components/DraggableCardDemo'
import { FocusCardsDemo } from '@/components/FocusCardsDemo'
import React, { useState } from 'react'

const Photos = () => {
  const [showDraggable, setShowDraggable] = useState(true)

  const toggleComponent = () => {
    setShowDraggable(prev => !prev)
  }

  return (
    <div>
      <button
        onClick={toggleComponent}
        style={{
          padding: '10px 20px',
          marginBottom: '20px',
          background: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        {showDraggable ? 'Show Focus Cards' : 'Show Draggable Cards'}
      </button>

      {showDraggable ? <DraggableCardDemo /> : <FocusCardsDemo />}
    </div>
  )
}

export default Photos
