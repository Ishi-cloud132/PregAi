import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { ELECTRODE_POINTS } from './electrodePoints'

// ---------------------------------------------------------------------------
// Renders a torso and the approximate EHG electrode layout, interactively
// (drag to rotate, scroll to zoom, hover a marker for details).
//
// This ships with a procedural low-poly body built from primitives so the
// app works with zero external assets. If a real Blender-exported model is
// added later, drop the .glb at `public/models/torso.glb` and this component
// will load and use it automatically instead — no code changes needed.
// ---------------------------------------------------------------------------

const MODEL_PATH = '/models/torso.glb'

export function ElectrodePlacementModel({ height = 320 }: { height?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [usingCustomModel, setUsingCustomModel] = useState(false)

  useEffect(() => {
    const containerEl = containerRef.current
    if (!containerEl) return
    const container: HTMLDivElement = containerEl

    let width = container.clientWidth
    let frameId: number
    let disposed = false

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100)
    camera.position.set(0.9, 0.5, 2.4)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    container.appendChild(renderer.domElement)

    // Lighting — cool navy-blue key light to match the brand palette, soft fill.
    scene.add(new THREE.AmbientLight(0x8c96a3, 0.55))
    const key = new THREE.DirectionalLight(0x5b8def, 1.1)
    key.position.set(2, 3, 2)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0x2dd4bf, 0.25)
    rim.position.set(-2, -1, -2)
    scene.add(rim)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.enablePan = false
    controls.minDistance = 1.4
    controls.maxDistance = 3.6
    controls.autoRotate = true
    controls.autoRotateSpeed = 1.4
    controls.target.set(0, 0.1, 0)

    const bodyGroup = new THREE.Group()
    scene.add(bodyGroup)

    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x24406b,
      roughness: 0.55,
      metalness: 0.15,
      emissive: 0x101a30,
      emissiveIntensity: 0.4,
    })

    function buildProceduralBody() {
      const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 0.75, 8, 16), bodyMaterial)
      torso.position.y = 0.1
      bodyGroup.add(torso)

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 20, 20), bodyMaterial)
      head.position.y = 0.72
      bodyGroup.add(head)

      const armGeo = new THREE.CapsuleGeometry(0.07, 0.55, 6, 12)
      const armL = new THREE.Mesh(armGeo, bodyMaterial)
      armL.position.set(-0.42, 0.12, 0)
      armL.rotation.z = Math.PI / 7
      bodyGroup.add(armL)
      const armR = new THREE.Mesh(armGeo, bodyMaterial)
      armR.position.set(0.42, 0.12, 0)
      armR.rotation.z = -Math.PI / 7
      bodyGroup.add(armR)

      const legGeo = new THREE.CapsuleGeometry(0.1, 0.65, 6, 12)
      const legL = new THREE.Mesh(legGeo, bodyMaterial)
      legL.position.set(-0.14, -0.75, 0)
      bodyGroup.add(legL)
      const legR = new THREE.Mesh(legGeo, bodyMaterial)
      legR.position.set(0.14, -0.75, 0)
      bodyGroup.add(legR)
    }

    buildProceduralBody()

    // Attempt to load a real Blender-exported model; silently keep the
    // procedural fallback if none is present (expected in most setups).
    const loader = new GLTFLoader()
    loader.load(
      MODEL_PATH,
      (gltf) => {
        if (disposed) return
        bodyGroup.clear()
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = bodyMaterial
          }
        })
        bodyGroup.add(gltf.scene)
        setUsingCustomModel(true)
      },
      undefined,
      () => {
        /* no custom model available — procedural body already rendered */
      },
    )

    // Electrode markers
    const markerGroup = new THREE.Group()
    scene.add(markerGroup)
    const markerMeshes: { mesh: THREE.Mesh; id: string }[] = []

    ELECTRODE_POINTS.forEach((pt) => {
      const color = pt.role === 'reference' ? 0xd4a441 : 0x5b8def
      const geo = new THREE.SphereGeometry(0.028, 16, 16)
      const mat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.9,
        roughness: 0.3,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(...pt.position)
      mesh.userData.id = pt.id
      markerGroup.add(mesh)
      markerMeshes.push({ mesh, id: pt.id })

      // Soft glow halo
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 12, 12),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.18 }),
      )
      halo.position.copy(mesh.position)
      markerGroup.add(halo)
    })

    // Raycasting for hover
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let hoveredId: string | null = null

    function onPointerMove(e: PointerEvent) {
      const rect = container.getBoundingClientRect()
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObjects(markerMeshes.map((m) => m.mesh))

      if (hits.length > 0) {
        const id = (hits[0].object.userData.id as string) || null
        if (id !== hoveredId) {
          hoveredId = id
          setHovered(id)
        }
        container.style.cursor = 'pointer'
        if (tooltipRef.current) {
          tooltipRef.current.style.left = `${e.clientX - rect.left + 12}px`
          tooltipRef.current.style.top = `${e.clientY - rect.top + 12}px`
        }
      } else if (hoveredId !== null) {
        hoveredId = null
        setHovered(null)
        container.style.cursor = 'grab'
      }
    }

    renderer.domElement.addEventListener('pointermove', onPointerMove)

    function onResize() {
      if (!container) return
      width = container.clientWidth
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(container)

    function animate() {
      frameId = requestAnimationFrame(animate)
      // Gentle pulse on markers
      const t = performance.now() * 0.002
      markerMeshes.forEach(({ mesh }, i) => {
        const s = 1 + Math.sin(t + i) * 0.12
        mesh.scale.setScalar(s)
      })
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      disposed = true
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      controls.dispose()
      renderer.dispose()
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose()
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
          else obj.material.dispose()
        }
      })
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, [height])

  const hoveredPoint = ELECTRODE_POINTS.find((p) => p.id === hovered)

  return (
    <div className="relative">
      <div
        ref={containerRef}
        style={{ height }}
        className="w-full cursor-grab overflow-hidden rounded-md border border-border-subtle bg-gradient-to-b from-surface-elevated to-base"
      />
      <div
        ref={tooltipRef}
        className={`pointer-events-none absolute z-10 w-52 rounded-md border border-border bg-surface-elevated p-2.5 text-xs shadow-lg transition-opacity duration-150 ${
          hoveredPoint ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {hoveredPoint && (
          <>
            <p className="font-medium text-ink">{hoveredPoint.label}</p>
            <p className="mt-0.5 text-ink-muted">{hoveredPoint.description}</p>
          </>
        )}
      </div>
      <p className="absolute bottom-2 left-2 rounded bg-base/70 px-1.5 py-0.5 text-[10px] text-ink-faint backdrop-blur-sm">
        Drag to rotate · Scroll to zoom {usingCustomModel ? '· Custom model' : ''}
      </p>
    </div>
  )
}
