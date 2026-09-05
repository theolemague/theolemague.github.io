import { Canvas } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { buildJourney, buildParcours } from '@/data/parcours';
import Hud from './components/hud';
import Scene from './components/scene';
import { buildSystem, Telemetry } from './system';

// DESIGN.md: no WebGL, or a stated preference for less motion, falls back to the
// serious version entirely rather than to a degraded flight
const isFlightSupported = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
};

const Home = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('fr') ? 'fr' : 'en';
  const [flightSupported] = useState(isFlightSupported);
  const [dockedId, setDockedId] = useState<string | null>(null);
  const [hasFlown, setHasFlown] = useState(false);
  // how far along the route the visitor has actually got. Worlds open one at a
  // time, so this single number is the whole progression.
  const [reached, setReached] = useState(0);
  const telemetry = useRef<Telemetry>({ speed: 0, targetId: null, targetDistance: 0, targetBearing: 0, outOfRange: false });

  const parcours = buildParcours(lang, t('ui.present'));
  const journey = buildJourney(parcours);
  const waypoints = buildSystem(parcours, journey, lang, { intro: t('nav.intro'), projects: t('sections.projects'), contact: t('sections.contact') });
  const unlocked = waypoints.slice(0, reached + 1);
  const objective = waypoints[reached] ?? null;
  const docked = waypoints.find(waypoint => waypoint.id === dockedId) ?? null;

  const handleDock = (id: string | null) => {
    setDockedId(id);
    if (!id) return;
    // only arriving at the newest world opens the next one — going back to an
    // earlier one is free, and changes nothing
    const index = waypoints.findIndex(waypoint => waypoint.id === id);
    if (index === reached) setReached(index + 1);
  };

  if (!flightSupported) return <Navigate to="/serious" replace />;

  return (
    <div className="px-6 md:px-12 fixed inset-0 touch-none">
      {/* flat keeps tone mapping off, so the amber lands on screen as the exact
          value DESIGN.md specifies rather than a filmic approximation of it */}
      <Canvas flat dpr={[1, window.innerWidth < 768 ? 1.25 : 2]} camera={{ fov: 62, near: 0.1, far: 700 }}>
        <Scene unlocked={unlocked} objective={objective} telemetry={telemetry} dockedId={dockedId} onDock={handleDock} onFirstFlight={() => setHasFlown(true)} />
      </Canvas>
      {/* nothing is announced at the start: reached 0 means only the presentation
          is open, and it was never unlocked by anything */}
      <Hud telemetry={telemetry} unlocked={unlocked} justUnlocked={reached > 0 ? objective : null} docked={docked} parcours={parcours} lang={lang} hasFlown={hasFlown} />
    </div>
  );
};

export default Home;
