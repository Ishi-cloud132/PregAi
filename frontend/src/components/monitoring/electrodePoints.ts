// ---------------------------------------------------------------------------
// EHG electrode placement reference points.
//
// These coordinates are illustrative — placed over the lower/mid abdomen in
// the standard EHG layout (a small array around the uterine body plus one
// reference electrode near the hip) — NOT a clinically-validated placement
// map. Once the hardware/clinical team finalizes exact electrode geometry,
// update ELECTRODE_POINTS only; the 3D component and legend read from here.
// ---------------------------------------------------------------------------

export interface ElectrodePoint {
  id: string
  label: string
  description: string
  position: [number, number, number]
  role: 'signal' | 'reference'
}

export const ELECTRODE_POINTS: ElectrodePoint[] = [
  {
    id: 'ch1',
    label: 'Channel 1',
    description: 'Upper abdomen, fundal region — primary uterine signal pickup.',
    position: [-0.09, 0.28, 0.38],
    role: 'signal',
  },
  {
    id: 'ch2',
    label: 'Channel 2',
    description: 'Lower-left abdomen — secondary differential pair.',
    position: [-0.18, 0.02, 0.36],
    role: 'signal',
  },
  {
    id: 'ch3',
    label: 'Channel 3',
    description: 'Lower-right abdomen — secondary differential pair.',
    position: [0.18, 0.02, 0.36],
    role: 'signal',
  },
  {
    id: 'ch4',
    label: 'Channel 4',
    description: 'Lower midline, near symphysis — contraction propagation reference.',
    position: [0.0, -0.16, 0.38],
    role: 'signal',
  },
  {
    id: 'ref',
    label: 'Reference',
    description: 'Iliac crest — grounding / common-mode reference electrode.',
    position: [0.34, 0.05, 0.18],
    role: 'reference',
  },
]
