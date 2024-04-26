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
        <primitive object={glass.glass} scale={ 7.8 } position={ [ -5, 3.2, 20.58] } rotation={ [ - Math.PI * 0.5, 0, Math.PI * 0.5 ] } />
        </>
    )
}