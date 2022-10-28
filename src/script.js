import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/8.png')
/**
 * Object
 */

const parameters = {
    count: 5000
}
const particleGeometry = new THREE.BufferGeometry()

const positions = new Float32Array(parameters.count * 3)
const colors = new Float32Array(parameters.count * 3)

for(let i = 0; i < parameters.count * 3; i++) {
    const i3 = i * 3
    positions[i] = (Math.random() - 0.5 ) * 10
    colors[i3] = Math.random()
    colors[i3 + 1] = 1
    colors[i3 + 2] = Math.random()

}

particleGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3))

particleGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
)

const pointsMaterial = new THREE.PointsMaterial(
    {
        color: '#fffff',
        size: 0.1,
        sizeAttenuation: true,
        transparent: true,
        alphaMap: particleTexture,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    }
)

const points = new THREE.Points(particleGeometry, pointsMaterial)
scene.add(points)
/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)



// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Update particles 
    points.rotation.y = elapsedTime * 0.05
    points.rotation.z = Math.sin(elapsedTime * 0.1) * Math.cos(elapsedTime * 0.1)

    // Update controls
    controls.update()
   
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()