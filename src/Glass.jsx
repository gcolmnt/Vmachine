import { useGLTF } from '@react-three/drei'

export default function Model() {

    const { nodes: glass } = useGLTF('./glass.glb')
    glass.glass.traverse((child) => {
        if (child.isMesh) {
          child.material.transparent = true
          child.material.opacity = 0.2
        }
    })

    return (<>
        <primitive object={glass.glass} scale={ 0.41 } position={ [ 0, 2, 1.43] } rotation={ [ - Math.PI * 0.5, 0, Math.PI * 0.5 ] } />
        </>
    )
}