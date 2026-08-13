/** Parchment blueprint stencils — ink-line vehicle silhouettes for Wolf. */

const ink = 'currentColor'

function Frame({ children, label }) {
  return (
    <svg
      className="wolf-stencil__svg"
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
        WOLF · BLUEPRINT
      </text>
      {children}
    </svg>
  )
}

function MotorcycleStencil() {
  return (
    <Frame label="Fenrir motorcycle stencil">
      <g
        fill="none"
        stroke={ink}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
      <text x="120" y="178" className="wolf-stencil__caption" fill={ink} fillOpacity="0.4" fontSize="9" fontFamily="Georgia, serif">
        adventure motorcycle
      </text>
    </Frame>
  )
}

function AtvStencil() {
  return (
    <Frame label="Hati ATV stencil">
      <g
        fill="none"
        stroke={ink}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
    <Frame label="Sköll car stencil">
      <g
        fill="none"
        stroke={ink}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="100" cy="148" r="22" />
        <circle cx="230" cy="148" r="22" />
        <path d="M62 148 L78 110 H120 L138 78 H210 L248 110 H268 L258 148 H252" />
        <path d="M78 148 H252" />
        <path d="M138 78 L150 110 H210 L222 78" strokeOpacity="0.5" />
        <path d="M120 110 H248" strokeOpacity="0.35" />
        <path d="M168 78 V68" strokeOpacity="0.45" />
      </g>
      <text x="128" y="178" fill={ink} fillOpacity="0.4" fontSize="9" fontFamily="Georgia, serif">
        compact electric car
      </text>
    </Frame>
  )
}

function TruckStencil() {
  return (
    <Frame label="Geri truck stencil">
      <g
        fill="none"
        stroke={ink}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
    <Frame label="Freki helicopter stencil">
      <g
        fill="none"
        stroke={ink}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
    <Frame label="Dire Wolf train stencil">
      <g
        fill="none"
        stroke={ink}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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

const STENCILS = {
  motorcycle: MotorcycleStencil,
  atv: AtvStencil,
  car: CarStencil,
  truck: TruckStencil,
  heli: HeliStencil,
  train: TrainStencil,
}

export default function WolfStencil({ vehicle = 'motorcycle' }) {
  const Cmp = STENCILS[vehicle] || MotorcycleStencil
  return (
    <div className="wolf-stencil" aria-hidden={false}>
      <div className="wolf-stencil__parchment">
        <Cmp />
      </div>
    </div>
  )
}
