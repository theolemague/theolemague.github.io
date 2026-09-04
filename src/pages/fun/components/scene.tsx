import { Grid } from '@react-three/drei';
import { RefObject, useMemo } from 'react';

import { COLORS, Telemetry, Waypoint } from '../system';
import Planet from './planet';
import Ship from './ship';

const STAR_COUNT = 900;

const Starfield = () => {
  const positions = useMemo(() => {
    const array = new Float32Array(STAR_COUNT * 3);
    for (let index = 0; index < STAR_COUNT; index++) {
      // a flattened shell well outside the system, so no star ever ends up
      // sitting between the ship and a planet
      const radius = 200 + Math.random() * 180;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      array[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      array[index * 3 + 1] = radius * Math.cos(phi) * 0.5;
      array[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    return array;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      {/* muted rather than white, and out of the fog, so the stars stay warm */}
      <pointsMaterial color={COLORS.muted} size={1.1} sizeAttenuation transparent opacity={0.7} depthWrite={false} fog={false} />
    </points>
  );
};

interface SceneProps {
  unlocked: Waypoint[];
  objective: Waypoint | null;
  telemetry: RefObject<Telemetry>;
  dockedId: string | null;
  onDock: (id: string | null) => void;
  onFirstFlight: () => void;
}

const Scene = ({ unlocked, objective, telemetry, dockedId, onDock, onFirstFlight }: SceneProps) => (
  <>
    <color attach="background" args={[COLORS.canvas]} />
    <fog attach="fog" args={[COLORS.canvas, 80, 320]} />

    <ambientLight intensity={0.4} />
    <directionalLight position={[40, 60, 20]} intensity={1.2} color={COLORS.ink} />

    <Starfield />

    {/* the navigation plane, sunk below the flight path so speed has something to
        read against — empty space on its own gives no sense of moving at all */}
    <Grid
      position={[0, -7, 0]}
      cellSize={5}
      cellThickness={0.5}
      cellColor="#241f1c"
      sectionSize={25}
      sectionThickness={0.8}
      sectionColor={COLORS.rule}
      fadeDistance={190}
      fadeStrength={1.2}
      infiniteGrid
    />

    {/* a locked world is not dimmed, it is simply not here yet — which is what
        lets each planet play its unlock the moment it first mounts */}
    {unlocked.map(waypoint => (
      <Planet key={waypoint.id} waypoint={waypoint} docked={dockedId === waypoint.id} />
    ))}

    <Ship dockable={unlocked} objective={objective} telemetry={telemetry} dockedId={dockedId} onDock={onDock} onFirstFlight={onFirstFlight} />
  </>
);

export default Scene;
