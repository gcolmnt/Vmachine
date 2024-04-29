import React, { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls, OrbitControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { Perf } from 'r3f-perf'

import { Digit } from './Digit.jsx'
import Machine from './Machine.jsx'
import Model from './Model.jsx'
import Interface from './Interface.jsx'
import Lights from './Lights.jsx'
import Fallback from './Fallback.jsx'
import Loader from './Loader.jsx'
import useGame from './stores/useGame.jsx'
import Grass from "./Grass"
import Glass from "./Glass"

export default function Experience()
{
    const controls = useRef()
    const [timer, setTimer] = useState(0)
    const [score, setScore] = useState(0)
    const [gltfNodes, setGltfNodes] = useState(null)
    const orbitState = useGame(state => state.orbitOff)
    const grassState = useGame(state => state.grassOff)

    const onUpdateTarget = (newTarget) => {
        controls.current.target.set(newTarget.x, newTarget.y, newTarget.z)
    }

    const onUpdateTimer = (newTimer) => {
        setTimer(newTimer)
    }

    const onUpdateScore = (newScore) => {
        setScore(newScore)
    }

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    const keyboardMap = [
        { name: 'key0', keys: ['Numpad0', 'Digit0' ] },
        { name: 'key1', keys: ['Numpad1', 'Digit1' ] },
        { name: 'key2', keys: ['Numpad2', 'Digit2' ] },
        { name: 'key3', keys: ['Numpad3', 'Digit3' ] },
        { name: 'key4', keys: ['Numpad4', 'Digit4' ] },
        { name: 'key5', keys: ['Numpad5', 'Digit5' ] },
        { name: 'key6', keys: ['Numpad6', 'Digit6' ] },
        { name: 'key7', keys: ['Numpad7', 'Digit7' ] },
        { name: 'key8', keys: ['Numpad8', 'Digit8' ] },
        { name: 'key9', keys: ['Numpad9', 'Digit9' ] },
    ]



    return <>
        <KeyboardControls 
          map={ keyboardMap }
        >
            <Canvas
                camera={ {
                    fov: 45,
                    near: 0.1,
                    far: 300,
                    position: isMobile ? [-6, 6, 12] : [-5, 4, 10],
                } }
            >
                {/* <Perf position="top-left" /> */}
                <OrbitControls 
                    ref={controls}
                    enablePan={false}
                    enableZoom={false}
                    enableRotate={!orbitState}
                    maxPolarAngle={Math.PI * 0.5}
                    minPolarAngle={Math.PI * 0.1}
                    maxAzimuthAngle={Math.PI * 2.25}
                    minAzimuthAngle={-Math.PI / 2.25}
                    target={[0, 2.2, 0]}
                />
                <Lights />
                <Suspense fallback={<Fallback/>}>
                    <Loader onGLTFLoaded={setGltfNodes}/>
                    <Physics gravity={[0, -9.81, 0]}debug={ false }>
                    <Machine score={score} gltfNodes={gltfNodes} />
                    </ Physics>
                    <Digit timer={timer} onUpdateTarget={onUpdateTarget} onUpdateScore={onUpdateScore}/>
                    <Model />
                    <Glass />
                </Suspense>
                <Grass />
            </Canvas>
            <Interface onUpdateTimer={onUpdateTimer} />
        </KeyboardControls>
    </>
}