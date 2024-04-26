import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useControls } from 'leva'
import useGame from './stores/useGame.jsx'
import * as THREE from 'three'


export default function Machine({ score, gltfNodes }) {
    
    // Leva
    // const { floorColor  } = useControls ('floorColor ', {
    // floorColor :
    //     {
    //         value: '#2d5c2c' ,
    //         color: true
    //     },
    // })

    const rewardCount = 15
    const delay = 1000

    const phase = useGame((state) => state.phase)
    const restart = useGame((state) => state.restart)
    const baseImpulseForce = 10

    const rewardRefs = useRef(Array.from({ length: rewardCount }, () => useRef()))
    const [hasBeenPushed, setHasBeenPushed] = useState(Array(rewardCount).fill(false))
    const [resetPosition, setResetPosition] = useState(false)
    const [impulseForce, setImpulseForce] = useState(10)
    const [ compressor ] = useState(() => new Audio('./compressor.mp3'))
    const [ compressorOn, setCompressorOn] = useState(false)

    const rotationQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0, 'XYZ'))

    const positions = [
        [-18, 28.1, -3],
        [-12, 28.1, -3],
        [-6, 28.1, -3],
        [0, 28.1, -3],
        [6, 28.1, -3],
        [-18, 17.1, -3],
        [-12, 17.1, -3],
        [-6, 17.1, -3],
        [0, 17.1, -3],
        [6, 17.1, -3],
        [-18, 5.6, -3],
        [-12, 5.6, -3],
        [-6, 5.6, -3],
        [0, 5.6, -3],
        [6, 5.6, -3],
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
                { x: -18, y: 25.6, z: -3 },
                { x: -12, y: 25.6, z: -3 },
                { x: -6, y: 25.6, z: -3 },
                { x: 0, y: 25.6, z: -3 },
                { x: 6, y: 25.6, z: -3 },
                { x: -18, y: 14.6, z: -3 },
                { x: -12, y: 14.6, z: -3 },
                { x: -6, y: 14.6, z: -3 },
                { x: 0, y: 14.6, z: -3 },
                { x: 6, y: 14.6, z: -3 },
                { x: -18, y: 5.6, z: -3 },
                { x: -12, y: 5.6, z: -3 },
                { x: -6, y: 5.6, z: -3 },
                { x: 0, y: 5.6, z: -3 },
                { x: 6, y: 5.6, z: -3 },
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
            <CuboidCollider position={ [ -6, 28, -4 ]} args={ [ 16, 0.5, 4 ] }  />
            <RigidBody type="fixed">
                <mesh receiveShadow position={ [ -6, 28, -4 ]} scale={ [ 32, 1, 8 ] }>
                    <boxGeometry />
                    <meshStandardMaterial color="#49242a" />
                </mesh>
            </RigidBody>
            {/* Shelf Mid */}
            <RigidBody type="fixed">
                <mesh receiveShadow position={ [ -6, 17, -4 ]} scale={ [ 32, 1, 8 ] }>
                    <boxGeometry />
                    <meshStandardMaterial color="#49242a" />
                </mesh>
            </RigidBody>
            {/* Shelf Bot */}
            <CuboidCollider position={ [ -5, 5.5, -4 ]} args={ [ 16, 0.5, 4 ] } />
            {/* Shelf Slide */}
            <CuboidCollider position={ [ -8, -19, 0 ]} args={ [ 14, 0.5, 9 ] } rotation={ [Math.PI * 0.20, 0, 0] }/>
            {/* Stopper Bot */}
            <CuboidCollider position={ [ -5, -30, 8 ]} args={ [ 20, 4, 0.5 ] } />
            {/* Side Left */}
            <CuboidCollider position={ [ -25, 20, 0 ]} args={ [ 0.5, 15, 8 ] } />
            {/* Side Left 2*/}
            <CuboidCollider position={ [ -23.5, -5, 0 ]} args={ [ 0.5, 10, 8 ] } rotation={ [0, 0, Math.PI * 0.05] }/>
            {/* Side Left 2*/}
            <CuboidCollider position={ [ -22, -19, 0 ]} args={ [ 0.5, 4, 8 ] } />
            {/* Side Right */}
            <CuboidCollider position={ [ 12, 20, 0 ]} args={ [ 0.5, 15, 8 ] } />
            {/* Side Right 2*/}
            <CuboidCollider position={ [ 9, -5, 0 ]} args={ [ 0.5, 10, 8 ] } rotation={ [0, 0, - Math.PI * 0.1] }/>
            {/* Side Right 3*/}
            <CuboidCollider position={ [ 6, -19, 0 ]} args={ [ 0.5, 4, 8 ] } />
            {/* Window */}
            <CuboidCollider position={ [ -7, 13, 6.5 ]} args={ [ 18, 28, 0.5 ] } />
            {/* Floor */}
            <RigidBody type="fixed">
                <mesh receiveShadow position={ [ -6, -36, -9 ]} >
                    <cylinderGeometry args={ [ 100, 100, 1 ] }/>
                    <meshStandardMaterial color="#2d5c2c" />
                </mesh>
            </RigidBody>
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
                        <primitive object={gltfNodes.NukaCola.clone()} scale={[6, 6, 6]} position={[0, 0, 0]}>
                            <meshStandardMaterial color={colors.current[index]} />
                        </primitive>
                    </RigidBody>
                ))
            )}
        </>
    )
}
