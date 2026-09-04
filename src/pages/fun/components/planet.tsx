import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Color, Group, MathUtils, Mesh, MeshBasicMaterial, MeshStandardMaterial } from 'three';

import { COLORS, Waypoint } from '../system';

const RULE = new Color(COLORS.rule);
const AMBER = new Color(COLORS.amber);
const DARK = new Color(COLORS.canvas);

interface PlanetProps {
  waypoint: Waypoint;
  docked: boolean;
}

const UNLOCK_SECONDS = 1.4;

const Planet = ({ waypoint, docked }: PlanetProps) => {
  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const shellRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const lit = useRef(0);
  // a locked world is not rendered at all, so mounting *is* the unlock: this runs
  // up from zero exactly once, on the frame the planet first exists
  const reveal = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current || !coreRef.current || !shellRef.current || !ringRef.current) return;

    reveal.current = Math.min(reveal.current + delta / UNLOCK_SECONDS, 1);
    lit.current = MathUtils.damp(lit.current, docked ? 1 : 0, 5, delta);

    // one amber pulse that rises and falls across the unlock, then hands the
    // colour back to whatever the docked state wants
    const arriving = Math.sin(reveal.current * Math.PI);
    const marked = Math.max(lit.current, arriving);

    // the body swells into place, easing out so it settles rather than snapping
    groupRef.current.scale.setScalar(1 - Math.pow(1 - reveal.current, 3));
    coreRef.current.rotation.y += delta * 0.07;

    // the wireframe shell warms from hairline grey to amber as the ring locks on
    const shell = shellRef.current.material as MeshBasicMaterial;
    shell.color.lerpColors(RULE, AMBER, marked);
    shell.opacity = 0.55 + marked * 0.3;

    // barely any: emissive is in linear space, so even a sliver of amber reads as a
    // solid warm fill on a body this large. The ring and the shell mark the dock.
    const core = coreRef.current.material as MeshStandardMaterial;
    core.emissive.lerpColors(DARK, AMBER, marked * 0.035);

    if (labelRef.current) {
      const toCamera = Math.hypot(state.camera.position.x - waypoint.position[0], state.camera.position.y, state.camera.position.z - waypoint.position[2]);
      labelRef.current.style.opacity = String(MathUtils.clamp(1 - (toCamera - 70) / 140, 0.38, 1) * reveal.current);
    }

    // the ring sweeps outward as the world opens, and lands on the same resting
    // size it has always had
    ringRef.current.scale.setScalar(0.4 + reveal.current * 0.34 + lit.current * 0.26);
    ringRef.current.rotation.z += delta * (0.12 + marked * 0.5);
    (ringRef.current.material as MeshBasicMaterial).opacity = Math.max(lit.current * 0.75, arriving * 0.85);
  });

  return (
    <group ref={groupRef} position={waypoint.position}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[waypoint.radius, 1]} />
        <meshStandardMaterial color={COLORS.surface} flatShading roughness={0.85} metalness={0.05} />
      </mesh>

      <mesh ref={shellRef} scale={1.06}>
        <icosahedronGeometry args={[waypoint.radius, 1]} />
        <meshBasicMaterial wireframe transparent color={COLORS.rule} opacity={0.55} />
      </mesh>

      {/* docking ring — flattened onto the flight plane by the parent, left open so
          its spin actually reads, and scaled in only once the ship is inside the radius */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh ref={ringRef}>
          <torusGeometry args={[waypoint.dockRadius * 0.82, 0.05, 6, 72, Math.PI * 1.45]} />
          <meshBasicMaterial color={COLORS.amber} transparent opacity={0} />
        </mesh>
      </group>

      {!docked && (
        <Html ref={labelRef} center distanceFactor={26} position={[0, waypoint.radius + 2.8, 0]} zIndexRange={[20, 0]} pointerEvents="none">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="label text-amber-dim">{String(waypoint.order).padStart(2, '0')}</span>
            <span className="label text-faint">{waypoint.label}</span>
          </div>
        </Html>
      )}
    </group>
  );
};

export default Planet;
