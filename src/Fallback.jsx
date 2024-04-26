import React from 'react'
import { Html, useProgress } from '@react-three/drei'

export default function Fallback() {

  const { progress } = useProgress()
  const loadingBarWidth = `${progress * 100}%`


  return <Html center>
    <span style={{ color: '#ffffff', fontWeight: 'bold' }}>Loading...</span>
    <div
      style={{
        width: '200px',
        height: '20px',
        backgroundColor: '#ddd',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          width: loadingBarWidth,
          height: '100%',
          backgroundColor: '#007bff',
          transition: 'width 0.3s ease-in-out'
        }}
      />
    </div>
  </Html>
}