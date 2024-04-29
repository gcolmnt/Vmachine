import { useState, useEffect } from 'react'
import useGame from './stores/useGame.jsx'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export default function Model() {
    const phase = useGame((state) => state.phase)
    const travelIn = useGame((state) => state.travelIn)

    // State to track whether the cursor is hovering over the mesh
    const [isHovered, setIsHovered] = useState(false)

    const { nodes: machine } = useGLTF('./vMachine.glb') 

    const handlePointerEnter = () => {
        setIsHovered(true)
    }
    
    const handlePointerLeave = () => {
        setIsHovered(false)
    }
    
    // Determine the cursor style based on the game phase and hover state
    useEffect(() => {
        if (phase === 'wait') {
            document.body.style.cursor = isHovered ? 'pointer' : 'auto'
        } else { document.body.style.cursor = 'auto'}
    }, [isHovered])
    
    return (<>
        <primitive object={machine.machine} scale={0.0245} opacity={ 0.2 } rotation={[ 0, Math.PI * 1.5, 0 ]} position={[0, 0, 0]} />
        <mesh
            onClick={travelIn}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            position={[0, 2, 0]}
            scale={[2.2, 4, 1.45]}
        >
            <boxGeometry />
            <meshStandardMaterial color="blue" transparent opacity={0.1} />
        </mesh>
        </>
    )
}
