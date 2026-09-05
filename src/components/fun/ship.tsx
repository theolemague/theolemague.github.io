import { useFrame, useThree } from '@react-three/fiber';
import { RefObject, useEffect, useRef } from 'react';
import { Group, MathUtils, Mesh, MeshBasicMaterial, Plane, PointLight, Raycaster, Vector2, Vector3 } from 'three';

import { COLORS, FLIGHT_BOUNDS, Telemetry, Waypoint } from '../../utils/world-system';

const MAX_SPEED = 26;
const ACCELERATION = 34;
const TURN_RATE = 2.1;
const DRAG = 1.1;
const BRAKE_DRAG = 3.6;
const MAX_BANK = 0.55;
const CAMERA_BACK = 13;
const CAMERA_HEIGHT = 5.4;
const CAMERA_LOOKAHEAD = 7;
// leaving takes more room than arriving, so sitting on the edge of a radius
// cannot flicker the dossier open and shut
const UNDOCK_MARGIN = 1.35;

const LEFT_KEYS = ['a', 'q', 'arrowleft'];
const RIGHT_KEYS = ['d', 'arrowright'];
const THRUST_KEYS = ['w', 'z', 'arrowup'];
const BRAKE_KEYS = ['s', 'arrowdown'];

// heading 0 points down +Z, and grows clockwise seen from above
const createFlight = (start: Waypoint) => {
  const position = new Vector3(start.position[0] - 6, 0, start.position[2] + 32);
  return {
    position,
    heading: Math.atan2(start.position[0] - position.x, start.position[2] - position.z),
    velocity: new Vector3(),
    roll: 0,
    throttle: 0,
    hasFlown: false,
  };
};

interface ShipProps {
  dockable: Waypoint[];
  objective: Waypoint | null;
  telemetry: RefObject<Telemetry>;
  dockedId: string | null;
  onDock: (id: string | null) => void;
  onFirstFlight: () => void;
}

const Ship = ({ dockable, objective, telemetry, dockedId, onDock, onFirstFlight }: ShipProps) => {
  const { camera, gl } = useThree();

  const shipRef = useRef<Group>(null);
  const rollRef = useRef<Group>(null);
  const glowRef = useRef<Mesh>(null);
  const plumeRef = useRef<Mesh>(null);
  const engineLightRef = useRef<PointLight>(null);

  const flight = useRef(createFlight(dockable[0]));
  const keys = useRef(new Set<string>());
  const pointerActive = useRef(false);
  const pointerNdc = useRef(new Vector2());

  const raycaster = useRef(new Raycaster());
  const flightPlane = useRef(new Plane(new Vector3(0, 1, 0), 0));
  const steerTarget = useRef(new Vector3());
  const forward = useRef(new Vector3());
  const cameraGoal = useRef(new Vector3());
  const lookGoal = useRef(new Vector3());
  const homeward = useRef(new Vector3());

  useEffect(() => {
    const { position, heading } = flight.current;
    camera.position.set(position.x - Math.sin(heading) * CAMERA_BACK, CAMERA_HEIGHT, position.z - Math.cos(heading) * CAMERA_BACK);
  }, [camera]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keys.current.add(event.key.toLowerCase());
      // the arrows would otherwise scroll the page under the canvas
      if (event.key.startsWith('Arrow')) event.preventDefault();
    };
    const handleKeyUp = (event: KeyboardEvent) => keys.current.delete(event.key.toLowerCase());
    // a key held while the tab loses focus never reports its release
    const handleBlur = () => keys.current.clear();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  useEffect(() => {
    const canvas = gl.domElement;

    const readPointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointerNdc.current.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -((event.clientY - bounds.top) / bounds.height) * 2 + 1);
    };
    const handleDown = (event: PointerEvent) => {
      pointerActive.current = true;
      readPointer(event);
      canvas.setPointerCapture(event.pointerId);
    };
    const handleMove = (event: PointerEvent) => {
      if (!pointerActive.current) return;
      readPointer(event);
    };
    const handleUp = () => {
      pointerActive.current = false;
    };

    canvas.addEventListener('pointerdown', handleDown);
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
    return () => {
      canvas.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
    };
  }, [gl]);

  useFrame((_, rawDelta) => {
    if (!shipRef.current || !rollRef.current || !plumeRef.current || !glowRef.current || !engineLightRef.current) return;

    // a backgrounded tab returns one enormous delta, which would teleport the ship
    const delta = Math.min(rawDelta, 0.05);
    const ship = flight.current;
    const pressed = keys.current;

    let turn = 0;
    if (LEFT_KEYS.some(key => pressed.has(key))) turn += 1;
    if (RIGHT_KEYS.some(key => pressed.has(key))) turn -= 1;
    let thrust = THRUST_KEYS.some(key => pressed.has(key)) ? 1 : 0;
    const braking = BRAKE_KEYS.some(key => pressed.has(key));

    // holding the pointer steers toward wherever it lands on the flight plane,
    // which is the same gesture on a mouse and under a thumb
    if (pointerActive.current) {
      raycaster.current.setFromCamera(pointerNdc.current, camera);
      if (raycaster.current.ray.intersectPlane(flightPlane.current, steerTarget.current)) {
        const desired = Math.atan2(steerTarget.current.x - ship.position.x, steerTarget.current.z - ship.position.z);
        const difference = desired - ship.heading;
        turn = MathUtils.clamp(Math.atan2(Math.sin(difference), Math.cos(difference)) * 2.2, -1, 1);
        thrust = 1;
      }
    }

    if (!ship.hasFlown && (thrust > 0 || turn !== 0)) {
      ship.hasFlown = true;
      onFirstFlight();
    }

    ship.heading += turn * TURN_RATE * delta;
    forward.current.set(Math.sin(ship.heading), 0, Math.cos(ship.heading));
    ship.velocity.addScaledVector(forward.current, thrust * ACCELERATION * delta);
    ship.velocity.multiplyScalar(Math.exp(-(braking ? BRAKE_DRAG : DRAG) * delta));
    if (ship.velocity.length() > MAX_SPEED) ship.velocity.setLength(MAX_SPEED);

    const distanceFromCentre = Math.hypot(ship.position.x, ship.position.z);
    const outOfRange = distanceFromCentre > FLIGHT_BOUNDS;
    // the edge of the system is a tow home, not a wall — you can always fly out
    // a little, you just cannot get lost out there
    if (outOfRange) {
      homeward.current.set(ship.position.x, 0, ship.position.z).normalize();
      ship.velocity.addScaledVector(homeward.current, -(distanceFromCentre - FLIGHT_BOUNDS) * 1.6 * delta);
    }

    ship.position.addScaledVector(ship.velocity, delta);

    shipRef.current.position.copy(ship.position);
    shipRef.current.rotation.y = ship.heading;
    ship.roll = MathUtils.damp(ship.roll, -turn * MAX_BANK, 6, delta);
    rollRef.current.rotation.z = ship.roll;

    ship.throttle = MathUtils.damp(ship.throttle, thrust, 8, delta);
    plumeRef.current.scale.set(1, 0.15 + ship.throttle * 1.35, 1);
    (plumeRef.current.material as MeshBasicMaterial).opacity = ship.throttle * 0.3;
    glowRef.current.scale.setScalar(0.75 + ship.throttle * 0.5);
    engineLightRef.current.intensity = 1.2 + ship.throttle * 2.5;

    cameraGoal.current.copy(ship.position).addScaledVector(forward.current, -CAMERA_BACK);
    cameraGoal.current.y = CAMERA_HEIGHT;
    camera.position.lerp(cameraGoal.current, 1 - Math.exp(-4 * delta));
    lookGoal.current.copy(ship.position).addScaledVector(forward.current, CAMERA_LOOKAHEAD);
    camera.lookAt(lookGoal.current);

    let nearest: Waypoint | null = null;
    let nearestDistance = Infinity;
    for (const waypoint of dockable) {
      const distance = Math.hypot(ship.position.x - waypoint.position[0], ship.position.z - waypoint.position[2]);
      if (distance >= nearestDistance) continue;
      nearest = waypoint;
      nearestDistance = distance;
    }

    if (nearest) {
      if (dockedId !== nearest.id && nearestDistance < nearest.dockRadius) onDock(nearest.id);
      else if (dockedId === nearest.id && nearestDistance > nearest.dockRadius * UNDOCK_MARGIN) onDock(null);
      else if (dockedId && dockedId !== nearest.id) onDock(null);
    }

    // the needle marks the world that is open but not yet reached, so it always
    // answers "where next" rather than "what am I parked on". Once the whole
    // system is open there is no next, and it falls back to the nearest.
    const target = objective ?? nearest;
    if (target) {
      const distance = Math.hypot(ship.position.x - target.position[0], ship.position.z - target.position[2]);
      const bearing = Math.atan2(target.position[0] - ship.position.x, target.position[2] - ship.position.z) - ship.heading;
      telemetry.current.targetId = target.id;
      telemetry.current.targetDistance = distance;
      telemetry.current.targetBearing = -Math.atan2(Math.sin(bearing), Math.cos(bearing));
    }

    telemetry.current.speed = ship.velocity.length();
    telemetry.current.outOfRange = outOfRange;
  });

  return (
    <group ref={shipRef}>
      <group ref={rollRef}>
        {/* a three-sided hull, so its own wireframe reads as the hairline edges
            the rest of the system is drawn with */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.62, 2.4, 3]} />
          <meshStandardMaterial color={COLORS.surface} flatShading roughness={0.6} metalness={0.2} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={1.02}>
          <coneGeometry args={[0.62, 2.4, 3]} />
          <meshBasicMaterial color={COLORS.primaryDim} wireframe transparent opacity={0.6} />
        </mesh>

        <mesh position={[0, -0.14, -0.5]}>
          <boxGeometry args={[2.5, 0.1, 0.9]} />
          <meshStandardMaterial color={COLORS.surface} flatShading roughness={0.6} metalness={0.2} />
        </mesh>
        <mesh position={[0, -0.14, -0.5]} scale={1.02}>
          <boxGeometry args={[2.5, 0.1, 0.9]} />
          <meshBasicMaterial color={COLORS.primaryDim} wireframe transparent opacity={0.45} />
        </mesh>

        <mesh ref={glowRef} position={[0, 0, -1.28]}>
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshBasicMaterial color={COLORS.primary} transparent opacity={0.95} />
        </mesh>
        <mesh ref={plumeRef} position={[0, 0, -2.4]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.26, 2.2, 8, 1, true]} />
          <meshBasicMaterial color={COLORS.primary} transparent opacity={0} depthWrite={false} />
        </mesh>
        {/* short reach on purpose: this is the engine lighting its own hull, not a
            lamp that floods whatever planet the ship is parked against */}
        <pointLight ref={engineLightRef} position={[0, 0, -1.6]} color={COLORS.primary} distance={3.2} intensity={1.2} />
      </group>
    </group>
  );
};

export default Ship;
