import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useControls } from 'leva'
import useGame from './stores/useGame.jsx'
import * as THREE from 'three'


export default function Machine({ score, gltfNodes }) {
    
    // // Leva
    // const { floorColor  } = useControls ('floorColor ', {
    // floorColor :
    //     {
    //         value: '#74c474' ,
    //         color: true
    //     },
    // })

    const rewardCount = 15
    const delay = 1000

    const phase = useGame((state) => state.phase)
    const restart = useGame((state) => state.restart)
    const baseImpulseForce = 0.001

    const rewardRefs = useRef(Array.from({ length: rewardCount }, () => useRef()))
    const [hasBeenPushed, setHasBeenPushed] = useState(Array(rewardCount).fill(false))
    const [resetPosition, setResetPosition] = useState(false)
    const [impulseForce, setImpulseForce] = useState(0.001)
    const [ compressor ] = useState(() => new Audio('./compressor.mp3'))
    const [ compressorOn, setCompressorOn] = useState(false)

    const rotationQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0, 'XYZ'))

    const positions = [
        [-0.7, 3.3, 0.15],
        [-0.35, 3.3, 0.15],
        [-0, 3.3, 0.15],
        [0.35, 3.3, 0.15],
        [0.7, 3.3, 0.15],
        [-0.7, 2.7, 0.15],
        [-0.35, 2.7, 0.15],
        [0, 2.7, 0.15],
        [0.35, 2.7, 0.15],
        [0.7, 2.7, 0.15],
        [-0.7, 2.1, 0.15],
        [-0.35, 2.1, 0.15],
        [0, 2.1, 0.15],
        [0.35, 2.1, 0.15],
        [0.7, 2.1, 0.15],
    ]

    const resetReward = (ref) => {
        ref.current.setLinvel({ x: 0, y: 0, z: 0 })
        ref.current.setAngvel({ x: 0, y: 0, z: 0 })
        ref.current.setRotation(rotationQuaternion)
    };

    const pushReward = (index, force) => {
        const ref = rewardRefs.current[index]
        if (ref.current) {
            ref.current.applyImpulse({ x: 0, y: 0, z: force }, true)
            setTimeout(() => setHasBeenPushed((prev) => [...prev.slice(0, index), true, ...prev.slice(index + 1)]), delay)
        }
    };

    useEffect(() => {
        if (phase === 'rewarding' && !compressorOn) {
            compressor.currentTime = 0
            compressor.volume = 1
            compressor.play()
            setCompressorOn(true)
        }
        if (phase === 'rewarding' && (hasBeenPushed[0] || score === 0)) {
            compressor.pause()
            setTimeout(restart, 2000)
        } else if (phase === 'prepared' && !resetPosition) {
            rewardRefs.current.forEach(resetReward)
            setCompressorOn(false)
            // Set initial positions for rewards
            const positions = [
                { x: -0.7, y: 3.3, z: 0.15 },
                { x: -0.35, y: 3.3, z: 0.15 },
                { x: 0, y: 3.3, z: 0.15 },
                { x: 0.35, y: 3.3, z: 0.15 },
                { x: 0.7, y: 3.3, z: 0.15 },
                { x: -0.7, y: 2.7, z: 0.15 },
                { x: -0.35, y: 2.7, z: 0.15 },
                { x: 0, y: 2.7, z: 0.15 },
                { x: 0.35, y: 2.7, z: 0.15 },
                { x: 0.7, y: 2.7, z: 0.15 },
                { x: -0.7, y: 2.1, z: 0.15 },
                { x: -0.35, y: 2.1, z: 0.15 },
                { x: 0, y: 2.1, z: 0.15 },
                { x: 0.35, y: 2.1, z: 0.15 },
                { x: 0.7, y: 2.1, z: 0.15 },
            ]
            rewardRefs.current.forEach((ref, index) => ref.current.setTranslation(positions[index]))
            setHasBeenPushed(Array(rewardCount).fill(false))
            setResetPosition(true)
        }
    }, [phase, score, hasBeenPushed, restart])

    // Use state variables to track push status for each reward
    const [rewardPushStatus, setRewardPushStatus] = useState(Array(rewardCount).fill(false))

    useFrame((state, delta) => {
        let fps = 1/delta
        let adjustedForce = baseImpulseForce * (60 / fps)

        if (phase === 'rewarding') {
            setResetPosition(false)
            for (let i = Math.min(score - 1, 14); i >= 0; i--) {
                if (!hasBeenPushed[i]) {
                    pushReward(i, adjustedForce)
                    break; // Push one reward per frame
                }

            }
        }
    console.log()
    })

    // Generate random colors for rewards
    const colors = useRef(Array.from({ length: rewardCount }, () => {
        const hue = Math.random()
        return new THREE.Color().setHSL(hue, 0.80, 0.5).getStyle()
    }));

    return (
        <>
            {/* Static colliders */}
            {/* Shelf Top */}
            <CuboidCollider position={ [ 0, 4, 0 ]} args={ [ 1.1, 0.02, 0.7] }  />
            <RigidBody type="fixed">
                <mesh receiveShadow position={ [ 0, 3.3, 0 ]} scale={ [ 1.8, 0.04, 0.7] }>
                    <boxGeometry />
                    <meshStandardMaterial color="#49242a" />
                </mesh>
            </RigidBody>
            {/* Shelf Mid */}
            <RigidBody type="fixed">
                <mesh receiveShadow position={ [ 0, 2.7, 0 ]} scale={ [ 1.8, 0.04, 0.7] }>
                    <boxGeometry />
                    <meshStandardMaterial color="#49242a" />
                </mesh>
            </RigidBody>
            {/* Shelf Bot */}
            <CuboidCollider position={ [ 0, 2.1, 0 ]} args={ [ 1, 0.04, 0.4 ] } />
            {/* Shelf Slide */}
            <CuboidCollider position={ [ 0, 1, 0 ]} args={ [ 0.85, 0.02, 1 ] } rotation={ [Math.PI * 0.20, 0, 0] }/>
            {/* Stopper Bot */}
            <CuboidCollider position={ [ 0, 0.2, 0.7 ]} args={ [ 1, 0.2, 0.02 ] } />
            {/* Stopper Bot */}
            <CuboidCollider position={ [ 0, 0.2, 3 ]} args={ [ 5, 2, 0.02 ] } />
            {/* Side Left */}
            <CuboidCollider position={ [ -1, 3, 0 ]} args={ [ 0.02, 1, 0.8 ] } />
            {/* Side Left 2*/}
            <CuboidCollider position={ [ -0.94, 1.5, 0 ]} args={ [ 0.02, 0.5, 0.8 ] } rotation={ [0, 0, Math.PI * 0.05] }/>
            {/* Side Left 3*/}
            <CuboidCollider position={ [ -0.86, 0.5, 0 ]} args={ [ 0.02, 0.5, 0.8 ] } />
            {/* Side Right */}
            <CuboidCollider position={ [ 1, 3, 0 ]} args={ [ 0.02, 1, 0.8 ] } />
            {/* Side Right 2*/}
            <CuboidCollider position={ [ 0.78, 1.55, 0 ]} args={ [ 0.02, 0.5, 0.8 ] } rotation={ [0, 0, - Math.PI * 0.15] }/>
            {/* Side Right 3*/}
            <CuboidCollider position={ [ 0.54, 0.6, 0 ]} args={ [ 0.02, 0.5, 0.8 ] } />
            {/* Window */}
            <CuboidCollider position={ [ 0, 2.5, 0.75 ]} args={ [ 1, 1.4, 0.02 ] } />
            {/* Floor */}
            <CuboidCollider position={ [ 0, 0, 0 ]} args={ [ 7, 0.1, 7 ] } />
            <mesh position={ [ 0, 0, 0 ]} >
                <cylinderGeometry args={ [ 6.75, 6.75, 0.1 ] }/>
                <meshStandardMaterial color={"#74c474"} />
            </mesh>

            {/* Moving colliders */}
            {/* Falling rewards */}
            {gltfNodes && gltfNodes.NukaCola && (
                rewardRefs.current.map((rewardRef, index) => (
                    <RigidBody 
                        key={index} 
                        ref={rewardRef} 
                        colliders="hull" 
                        type="Dynamic" 
                        mass={1}
                        density={1}
                        friction={0.5}
                        restitution={0.3}
                        position={positions[index]} 
                        rotation={[0, 0, 0]} 
                        linearDamping={0}
                    >
                        <primitive object={gltfNodes.NukaCola.clone()} scale={[0.35, 0.35, 0.35]} position={[0, 0, 0]}>
                            <meshStandardMaterial color={colors.current[index]} />
                        </primitive>
                    </RigidBody>
                ))
            )}
        </>
    )
}
