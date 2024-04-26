import { useKeyboardControls } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { addEffect } from '@react-three/fiber'
import useGame from './stores/useGame.jsx'


export default function Interface({ onUpdateTimer })
{

    const start = useGame((state) => state.start)
    const travelOut = useGame((state) => state.travelOut)
    const phase = useGame((state) => state.phase)
    const end = useGame((state) => state.end)
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    const timeOut = 25
    let timer = timeOut
    
    useEffect(() =>
    {
        const unsubscribeEffect = addEffect(() => 
        {
            const state = useGame.getState()

            
            if(state.phase === 'prepared') {
                timer = timeOut
            }
            else if(state.phase === 'playing') {
                timer = timeOut - (Date.now() - state.startTime) / 1000
            }
            else if(state.phase === 'ended') {
                timer = 0.0
            }
            timer = Math.max(timer, 0)
            timer = timer.toFixed(2)
            
            if (timer <= 0 && state.phase === 'playing') {
                end()
            }

            onUpdateTimer(timer)

        })

        return () =>
        {
            unsubscribeEffect()
        }

    }, [])


    return <div className="interface">
       
        {/* Ready */}

        { phase === 'prepared' ? 
            <>
                <div className="start" onClick={ start } >{isMobile ? 'Touch HERE to start' : 'Press any key'}</div>
            </>
             : null }       

        {/* Reward */}
        { phase === 'ended' ? 
            <>
                <div className="reward" onClick={ travelOut } >click Here to get rewards</div> 
            </>
             : null }

    </div>

}