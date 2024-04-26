import { useRef, useState, useEffect } from 'react'
import { Text, useKeyboardControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import useGame from './stores/useGame.jsx'
import gsap from 'gsap'


export function Digit({ timer, onUpdateTarget, onUpdateScore }) {

    const digit0 = useRef()
    const digit1 = useRef()
    const digit2 = useRef()
    const digit3 = useRef()
    const digit4 = useRef()
    const digit5 = useRef()
    const digit6 = useRef()
    const digit7 = useRef()
    const digit8 = useRef()
    const digit9 = useRef()


    const gameState = useGame.getState()
    const phase = useGame((state) => state.phase)
    const start = useGame((state) => state.start)
    const ready = useGame((state) => state.ready)
    const reward = useGame((state) => state.reward)    

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const { camera, scene } = useThree()
    const durationAnimationIn = 3
    const durationAnimationOut = 7

    const [targetPos, setTargetPosition] = useState(new Vector3(-5, 0, 0))
    const [ correct ] = useState(() => new Audio('./correct.mp3'))
    const [ wrong ] = useState(() => new Audio('./wrong.mp3'))
    const [ button ] = useState(() => new Audio('./button.mp3'))

    const startGame = () => {
        start()
        hasPressedKey()
    }

    const [subscribeKeys, getKeys] = useKeyboardControls()

    const [userInput, setUserInput] = useState("XXXX")
    const [randomCode, setRandomCode] = useState()
    const [score, setScore] = useState(0)
    const [ firstInput, setFirstInput] = useState(false)

    const updateScore = (newScore) => {
        setScore(newScore)
        onUpdateScore(newScore)
    }

    useEffect(() => {
        setRandomCode(generateRandomCode())

        // Add event listener
        document.addEventListener('keydown', handleKeyPress)

        const unsubscribeAny = subscribeKeys(startGame)

        // Cleanup function
        return () => {
            // Remove event listener
            document.removeEventListener('keydown', handleKeyPress)
        }

    }, [])

    const generateRandomCode = () => {
        return Math.floor(1000 + Math.random() * 9000)
    }

    useEffect(() => {
        if (gameState.phase === 'goToDigit') {
            setRandomCode(generateRandomCode())
            setUserInput("XXXX")
            updateScore(0)
            gsap.to(camera.position, {
                x: 4,
                y: -1,
                z: 20,
                duration: durationAnimationIn,
                onComplete: () => {
                    ready()
                }
            })
            gsap.to(targetPos, {
                x: 4,
                y: -1,
                z: 17,
                duration: durationAnimationIn,
                onUpdate: () => {
                    onUpdateTarget(targetPos)
                },
            })
        }

        if (gameState.phase === 'ended') {
            setRandomCode("GAME")
        }

        if (gameState.phase === 'goToReward') {
            if (isMobile) {
                gsap.to(camera.position, {
                    x: -112.5,
                    y: 75,
                    z: 150,
                    duration: durationAnimationOut,
                    onComplete: () => {
                        reward()
                    }
                })
            } else {
                gsap.to(camera.position, {
                    x: -101.25,
                    y: 67.5,
                    z: 135,
                    duration: durationAnimationOut,
                    onComplete: () => {
                        reward()
                    }
                })
            }
            gsap.to(targetPos, {
                x: -5,
                y: 0,
                z: 0,
                duration: durationAnimationOut,
                onUpdate: () => {
                    onUpdateTarget(targetPos)
                },
            }) 
        }

    }, [gameState, onUpdateTarget])


    // Function to handle digit click
    const handleDigitClick = (value) => {
        const newInput = userInput.split('') // Convert userInput to array
        const index = newInput.findIndex(digit => digit === 'X') // Find first space character
        if (index !== -1) {
            button.currentTime = 0
            button.volume = 1
            button.play()
            newInput[index] = value.toString() // Replace character "X" with wanted value
            setUserInput(newInput.join('')) // Update userInput
        }
    }

    function handleKeyPress(event) {
        // Extract the code from the event object
        const { code } = event
        // Extract the digit from the code
        const digit = parseInt(code.replace(/\D/g,''));
        button.currentTime = 0
        button.volume = 1
        button.play()
        // If the code contains a valid digit
        if (!isNaN(digit)) {
            // Append the digit to the current userInput
            setUserInput(prevInput => {
                // If all digits have been entered, return the current input
                if (prevInput.indexOf('X') === -1) {
                    return prevInput
                }
                // Otherwise, replace the first occurrence of 'X' with the digit
                const index = prevInput.indexOf('X');
                const newInput = prevInput.slice(0, index) + digit + prevInput.slice(index + 1);
                return newInput;
            });
        }
    }

    const hasPressedKey = () => {
        if (!firstInput) {
            setFirstInput(true)
        }
    }

    useEffect(() => {
        const index = userInput.indexOf('X');
        if (index === -1) {
            // All digits have been entered, trigger checkCode
            checkCode();
        }

    }, [userInput])



    // Function to check if userInput matches randomCode
    const checkCode = () => {
        if (gameState.phase === 'ended') {
            setUserInput("OVER")
        }
        else if (userInput === randomCode.toString() && gameState.phase === 'playing') {
            setRandomCode(generateRandomCode())
            correct.currentTime = 0
            correct.volume = 1
            correct.play()
            updateScore(score + 1)
            setUserInput("XXXX")

        } else { 
            setUserInput("XXXX")
            wrong.currentTime = 0
            wrong.volume = 1
            wrong.play()
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
    
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [])
    
    useFrame((state, delta) => {
        console.log()
    })

    return <>
        <group position={[3.8, -2.5, 7]}>
            <Text
                fontSize={0.75}
                font="./arcade.woff"
                position={[-0.2, 5.45, 0.2]}
                color="white"
                textAlign="right"
            >
                {`${timer}`}
            </Text>
            <Text
                fontSize={1}
                font="./arcade.woff"
                position={[0.15, 2.825, 0.2]}
                color="red"
                textAlign="center"
            >
                {`${randomCode}`}
            </Text>
            <Text
                fontSize={1}
                font="./arcade.woff"
                position={[0.15, 1.3, 0.01]}
                color="white"
                textAlign="center"
            >
                {`${userInput}`}
            </Text>
            <Text
                fontSize={1}
                font="./arcade.woff"
                position={[-1.925, 2.83, 0.2]}
                color="green"
            >
                {`${score}`}
            </Text>

            <mesh onClick={() => handleDigitClick(7)} ref={digit7} position={[-1, 0.25, 0]} scale={0.5}>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
                <Text position={[0.05, -0.1, 0.51]} color="black" fontSize={1} font="./arcade.woff">
                    7
                </Text>
            </mesh>
            <mesh onClick={() => handleDigitClick(8)} ref={digit8} position={[0, 0.25, 0]} scale={0.5}>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
                <Text position={[0.05, -0.1, 0.51]} color="black" fontSize={1} font="./arcade.woff">
                    8
                </Text>
            </mesh>
            <mesh onClick={() => handleDigitClick(9)} ref={digit9} position={[1, 0.25, 0]} scale={0.5}>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
                <Text position={[0.05, -0.1, 0.51]} color="black" fontSize={1} font="./arcade.woff">
                    9
                </Text>
            </mesh>
            <mesh onClick={() => handleDigitClick(4)} ref={digit4} position={[-1, -0.5, 0]} scale={0.5}>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
                <Text position={[0.05, -0.1, 0.51]} color="black" fontSize={1} font="./arcade.woff">
                    4
                </Text>
            </mesh>
            <mesh onClick={() => handleDigitClick(5)} ref={digit5} position={[0, -0.5, 0]} scale={0.5}>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
                <Text position={[0.05, -0.1, 0.51]} color="black" fontSize={1} font="./arcade.woff">
                    5
                </Text>
            </mesh>
            <mesh onClick={() => handleDigitClick(6)} ref={digit6} position={[1, -0.5, 0]} scale={0.5}>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
                <Text position={[0.05, -0.1, 0.51]} color="black" fontSize={1} font="./arcade.woff">
                    6
                </Text>
            </mesh>
            <mesh onClick={() => handleDigitClick(1)} ref={digit1} position={[-1, -1.25, 0]} scale={0.5}>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
                <Text position={[0.05, -0.1, 0.51]} color="black" fontSize={1} font="./arcade.woff">
                    1
                </Text>
            </mesh>
            <mesh onClick={() => handleDigitClick(2)} ref={digit2} position={[0, -1.25, 0]} scale={0.5}>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
                <Text position={[0.05, -0.1, 0.51]} color="black" fontSize={1} font="./arcade.woff">
                    2
                </Text>
            </mesh>
            <mesh onClick={() => handleDigitClick(3)} ref={digit3} position={[1, -1.25, 0]} scale={0.5}>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
                <Text position={[0.05, -0.1, 0.51]} color="black" fontSize={1} font="./arcade.woff">
                    3
                </Text>
            </mesh>
            <mesh onClick={() => handleDigitClick(0)} ref={digit0} position={[0, -2, 0]} scale={[2.5, 0.5, 0.5]}>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
                <Text position={[0.02, -0.1, 0.51]} color="black" fontSize={1} scale-x={-0.25} font="./arcade.woff">
                    0
                </Text>
            </mesh>
        </group>
    </>
}
