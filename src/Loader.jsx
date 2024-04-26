import React, { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Loader({ onGLTFLoaded }) {

  const { nodes } = useGLTF('./NukaCola.glb')

  useEffect(() => {
    onGLTFLoaded(nodes)
  }, [nodes, onGLTFLoaded])

  return <>
  </>
}