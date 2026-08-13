/** Parchment blueprint stencils — ink-line silhouettes for product docs. */

const ink = 'currentColor'

function Frame({ children, label, hall = 'VALHALLA' }) {
  return (
    <svg
      className="product-stencil__svg wolf-stencil__svg"
      viewBox="0 0 320 200"
      role="img"
      aria-label={label}
    >
      <rect
        x="8"
        y="8"
        width="304"
        height="184"
        fill="none"
        stroke={ink}
        strokeOpacity="0.18"
        strokeWidth="1"
      />
      <line x1="8" y1="28" x2="312" y2="28" stroke={ink} strokeOpacity="0.12" />
      <line x1="28" y1="8" x2="28" y2="192" stroke={ink} strokeOpacity="0.12" />
      <text
        x="36"
        y="22"
        fill={ink}
        fillOpacity="0.35"
        fontSize="8"
        fontFamily="ui-monospace, monospace"
        letterSpacing="1.5"
      >
        {String(hall).toUpperCase()} · BLUEPRINT
      </text>
      {children}
    </svg>
  )
}

function MotorcycleStencil() {
  return (
    <Frame label="Adventure motorcycle stencil" hall="WOLF">
      <g fill="none" stroke={ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="88" cy="142" r="28" />
        <circle cx="88" cy="142" r="12" strokeOpacity="0.45" />
        <circle cx="232" cy="142" r="28" />
        <circle cx="232" cy="142" r="12" strokeOpacity="0.45" />
        <path d="M116 142h70" />
        <path d="M155 142 L168 88 L198 88 L210 118" />
        <path d="M168 88 L148 70 L132 78" />
        <path d="M198 88 L220 62 L248 70" />
        <path d="M210 118 L232 142" />
        <path d="M116 142 L132 100 L155 100" />
        <path d="M140 100 L140 78 L158 72" />
        <path d="M88 114 L100 90 L120 90" strokeOpacity="0.55" />
      </g>
      <text x="120" y="178" fill={ink} fillOpacity="0.4" fontSize="9" fontFamily="Georgia, serif">
        adventure motorcycle
      </text>
    </Frame>
  )
}

function AtvStencil() {
  return (
    <Frame label="ATV stencil" hall="WOLF">
      <g fill="none" stroke={ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="78" cy="148" r="24" />
        <circle cx="242" cy="148" r="24" />
        <circle cx="78" cy="148" r="10" strokeOpacity="0.4" />
        <circle cx="242" cy="148" r="10" strokeOpacity="0.4" />
        <path d="M102 148h116" />
        <path d="M96 148 L108 108 H212 L224 148" />
        <path d="M118 108 L128 78 H192 L202 108" />
        <path d="M140 78 V62 H180 V78" />
        <path d="M128 90 H192" strokeOpacity="0.45" />
        <path d="M160 62 L168 48 L176 62" strokeOpacity="0.55" />
      </g>
      <text x="138" y="178" fill={ink} fillOpacity="0.4" fontSize="9" fontFamily="Georgia, serif">
        tri-fuel ATV
      </text>
    </Frame>
  )
}

function CarStencil() {
  return (
    <Frame label="Compact car stencil" hall="WOLF">
      <g fill="none" stroke={ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="100" cy="148" r="22" />
        <circle cx="230" cy="148" r="22" />
        <path d="M62 148 L78 110 H120 L138 78 H210 L248 110 H268 L258 148 H252" />
        <path d="M78 148 H252" />
        <path d="M138 78 L150 110 H210 L222 78" strokeOpacity="0.5" />
        <path d="M120 110 H248" strokeOpacity="0.35" />
        <path d="M168 78 V68" strokeOpacity="0.45" />
        {/* outward cameras only — small marks on nose, not cabin */}
        <circle cx="252" cy="118" r="3" strokeOpacity="0.55" />
        <circle cx="70" cy="120" r="2.5" strokeOpacity="0.4" />
        <path d="M155 100 H175" strokeOpacity="0.25" />
      </g>
      <text x="100" y="178" fill={ink} fillOpacity="0.4" fontSize="9" fontFamily="Georgia, serif">
        compact car · outward cams
      </text>
    </Frame>
  )
}

function TruckStencil() {
  return (
    <Frame label="Utility truck stencil" hall="WOLF">
      <g fill="none" stroke={ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="86" cy="150" r="20" />
        <circle cx="200" cy="150" r="20" />
        <circle cx="248" cy="150" r="20" />
        <path d="M48 150 V100 H120 L138 70 H178 V150" />
        <path d="M178 90 H270 V150 H268" />
        <path d="M120 100 H178" strokeOpacity="0.45" />
        <path d="M148 70 V100" strokeOpacity="0.4" />
        <path d="M198 90 V150 M230 90 V150" strokeOpacity="0.3" />
      </g>
      <text x="128" y="178" fill={ink} fillOpacity="0.4" fontSize="9" fontFamily="Georgia, serif">
        utility truck
      </text>
    </Frame>
  )
}

function HeliStencil() {
  return (
    <Frame label="Rescue helicopter stencil" hall="WOLF">
      <g fill="none" stroke={ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M40 70 H280" />
        <path d="M160 70 V88" />
        <path d="M118 100 H210 L222 128 H250 L242 148 H110 L100 128 H118 Z" />
        <path d="M210 110 H268 L278 122 V128 H222" strokeOpacity="0.7" />
        <path d="M100 148 L80 162 H240 L250 148" />
        <path d="M130 100 L120 78 M190 100 L200 78" strokeOpacity="0.45" />
        <circle cx="160" cy="70" r="4" fill={ink} fillOpacity="0.35" stroke="none" />
        <path d="M250 128 V108" strokeOpacity="0.5" />
      </g>
      <text x="118" y="178" fill={ink} fillOpacity="0.4" fontSize="9" fontFamily="Georgia, serif">
        rescue helicopter
      </text>
    </Frame>
  )
}

function TrainStencil() {
  return (
    <Frame label="Railroad stencil" hall="WOLF">
      <g fill="none" stroke={ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M36 158 H284" />
        <path d="M50 158 V110 H120 L138 88 H200 V158" />
        <path d="M200 100 H250 V158" />
        <path d="M250 110 H290 V158" />
        <path d="M70 110 V158 M100 110 V158" strokeOpacity="0.35" />
        <path d="M160 88 V158 M220 100 V158 M270 110 V158" strokeOpacity="0.3" />
        <circle cx="78" cy="158" r="10" />
        <circle cx="112" cy="158" r="10" />
        <circle cx="228" cy="158" r="10" />
        <circle cx="268" cy="158" r="10" />
        <path d="M138 88 H155" strokeOpacity="0.5" />
        <path d="M48 96 H70" strokeOpacity="0.4" />
      </g>
      <text x="108" y="182" fill={ink} fillOpacity="0.4" fontSize="9" fontFamily="Georgia, serif">
        transcontinental railroad
      </text>
    </Frame>
  )
}

function BoatStencil() {
  return (
    <Frame label="Coastal craft stencil" hall="VIKING">
      <g fill="none" stroke={ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M40 130 Q160 170 280 130" />
        <path d="M55 130 L80 90 H240 L265 130" />
        <path d="M100 90 V60 M160 90 V48 M220 90 V62" strokeOpacity="0.55" />
        <path d="M160 48 L168 40 L160 48 L152 40" strokeOpacity="0.45" />
        <path d="M70 130 H250" strokeOpacity="0.35" />
      </g>
      <text x="120" y="178" fill={ink} fillOpacity="0.4" fontSize="9" fontFamily="Georgia, serif">
        coastal craft
      </text>
    </Frame>
  )
}

function CraftStencil() {
  return (
    <Frame label="Expedition craft stencil" hall="VIKING">
      <g fill="none" stroke={ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M30 140 Q160 185 290 140" />
        <path d="M48 140 L95 78 H225 L272 140" />
        <path d="M120 78 L140 50 H180 L200 78" />
        <path d="M160 50 V32" strokeOpacity="0.5" />
        <path d="M70 140 H250" strokeOpacity="0.3" />
        <circle cx="100" cy="100" r="6" strokeOpacity="0.35" />
        <circle cx="220" cy="100" r="6" strokeOpacity="0.35" />
      </g>
      <text x="118" y="178" fill={ink} fillOpacity="0.4" fontSize="9" fontFamily="Georgia, serif">
        expedition craft
      </text>
    </Frame>
  )
}

function AircraftStencil() {
  return (
    <Frame label="Aircraft stencil" hall="EAGLE">
      <g fill="none" stroke={ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M40 100 H280" />
        <path d="M160 100 L130 60 H190 L160 100" />
        <path d="M160 100 L145 150 H175 L160 100" />
        <path d="M70 100 L50 80 M250 100 L270 80" strokeOpacity="0.5" />
        <path d="M100 100 L80 130 M220 100 L240 130" strokeOpacity="0.45" />
        <circle cx="160" cy="100" r="5" fill={ink} fillOpacity="0.3" stroke="none" />
      </g>
      <text x="130" y="178" fill={ink} fillOpacity="0.4" fontSize="9" fontFamily="Georgia, serif">
        aviation concept
      </text>
    </Frame>
  )
}

function RocketStencil() {
  return (
    <Frame label="Ascent concept stencil" hall="PHENIX">
      <g fill="none" stroke={ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M160 40 L185 90 V150 L160 170 L135 150 V90 Z" />
        <path d="M135 150 L120 175 M185 150 L200 175" strokeOpacity="0.55" />
        <path d="M145 70 H175 M145 100 H175 M145 130 H175" strokeOpacity="0.35" />
        <path d="M160 170 V185" strokeOpacity="0.4" />
        <path d="M150 185 H170" strokeOpacity="0.35" />
      </g>
      <text x="118" y="30" fill={ink} fillOpacity="0.35" fontSize="8" fontFamily="Georgia, serif">
        mission concept
      </text>
    </Frame>
  )
}

function ModuleStencil() {
  return (
    <Frame label="Modular volume stencil" hall="HOLM">
      <g fill="none" stroke={ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="70" y="70" width="90" height="70" />
        <rect x="160" y="85" width="90" height="55" />
        <path d="M70 70 L115 45 L160 70" />
        <path d="M160 85 L205 60 L250 85" strokeOpacity="0.7" />
        <path d="M95 100 H135 M95 120 H135" strokeOpacity="0.35" />
        <path d="M185 105 H230 M185 120 H230" strokeOpacity="0.3" />
      </g>
      <text x="118" y="178" fill={ink} fillOpacity="0.4" fontSize="9" fontFamily="Georgia, serif">
        modular volume
      </text>
    </Frame>
  )
}

function HabitatStencil() {
  return (
    <Frame label="Habitat stencil">
      <g fill="none" stroke={ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="160" cy="120" rx="100" ry="40" />
        <path d="M80 120 Q160 70 240 120" strokeOpacity="0.55" />
        <rect x="130" y="95" width="60" height="35" rx="4" />
        <path d="M100 140 Q160 165 220 140" strokeOpacity="0.35" />
      </g>
      <text x="130" y="178" fill={ink} fillOpacity="0.4" fontSize="9" fontFamily="Georgia, serif">
        habitat concept
      </text>
    </Frame>
  )
}

function PlatformStencil() {
  return (
    <Frame label="Platform stencil">
      <g fill="none" stroke={ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M50 140 H270" />
        <path d="M70 140 V90 H250 V140" />
        <path d="M100 90 V70 H220 V90" strokeOpacity="0.65" />
        <circle cx="120" cy="110" r="8" strokeOpacity="0.4" />
        <circle cx="200" cy="110" r="8" strokeOpacity="0.4" />
        <path d="M80 140 L70 165 M240 140 L250 165" strokeOpacity="0.45" />
      </g>
      <text x="128" y="178" fill={ink} fillOpacity="0.4" fontSize="9" fontFamily="Georgia, serif">
        platform study
      </text>
    </Frame>
  )
}

function FieldStencil() {
  return (
    <Frame label="Field lattice stencil" hall="DEMETER">
      <g fill="none" stroke={ink} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M40 150 H280" />
        <path d="M50 150 L70 90 L90 150 M110 150 L130 85 L150 150 M170 150 L190 88 L210 150 M230 150 L250 92 L270 150" strokeOpacity="0.7" />
        <path d="M60 110 H270" strokeOpacity="0.35" />
        <rect x="100" y="55" width="28" height="18" strokeOpacity="0.5" />
        <rect x="190" y="50" width="28" height="18" strokeOpacity="0.5" />
      </g>
      <text x="118" y="178" fill={ink} fillOpacity="0.4" fontSize="9" fontFamily="Georgia, serif">
        agrivoltaic lattice
      </text>
    </Frame>
  )
}

function WaterStencil() {
  return (
    <Frame label="Water systems stencil" hall="NJORD">
      <g fill="none" stroke={ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M40 120 Q80 100 120 120 T200 120 T280 120" />
        <path d="M40 145 Q80 125 120 145 T200 145 T280 145" strokeOpacity="0.45" />
        <path d="M160 120 V70" />
        <circle cx="160" cy="60" r="14" />
        <path d="M140 90 H180" strokeOpacity="0.4" />
      </g>
      <text x="118" y="178" fill={ink} fillOpacity="0.4" fontSize="9" fontFamily="Georgia, serif">
        water systems
      </text>
    </Frame>
  )
}

function WindStencil() {
  return (
    <Frame label="Wind gauge stencil" hall="AEOLUS">
      <g fill="none" stroke={ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M160 160 V50" />
        <path d="M160 70 L220 50 M160 90 L230 75 M160 110 L215 105" strokeOpacity="0.65" />
        <circle cx="160" cy="50" r="6" />
        <path d="M80 140 Q120 120 160 140 T240 140" strokeOpacity="0.35" />
      </g>
      <text x="128" y="178" fill={ink} fillOpacity="0.4" fontSize="9" fontFamily="Georgia, serif">
        atmosphere research
      </text>
    </Frame>
  )
}

function SoftwareStencil() {
  return (
    <Frame label="Software nest stencil" hall="CORVUS">
      <g fill="none" stroke={ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="70" y="55" width="180" height="110" rx="6" />
        <path d="M90 80 H230 M90 100 H200 M90 120 H220 M90 140 H180" strokeOpacity="0.45" />
        <circle cx="245" cy="70" r="10" strokeOpacity="0.5" />
        <path d="M240 75 L248 82" strokeOpacity="0.5" />
      </g>
      <text x="125" y="178" fill={ink} fillOpacity="0.4" fontSize="9" fontFamily="Georgia, serif">
        software nest
      </text>
    </Frame>
  )
}

const STENCILS = {
  motorcycle: MotorcycleStencil,
  atv: AtvStencil,
  car: CarStencil,
  truck: TruckStencil,
  heli: HeliStencil,
  train: TrainStencil,
  boat: BoatStencil,
  craft: CraftStencil,
  aircraft: AircraftStencil,
  rocket: RocketStencil,
  module: ModuleStencil,
  habitat: HabitatStencil,
  platform: PlatformStencil,
  field: FieldStencil,
  water: WaterStencil,
  wind: WindStencil,
  software: SoftwareStencil,
}

export default function ProductStencil({
  vehicle,
  stencil,
  hall = 'VALHALLA',
}) {
  const key = stencil || vehicle || 'module'
  const Cmp = STENCILS[key] || ModuleStencil
  return (
    <div className="product-stencil wolf-stencil" aria-hidden={false}>
      <div className="product-stencil__parchment wolf-stencil__parchment">
        <Cmp />
      </div>
    </div>
  )
}

/** @deprecated use ProductStencil */
export function WolfStencil(props) {
  return <ProductStencil {...props} hall="WOLF" />
}
