import { StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Stop,
} from 'react-native-svg';

import { palette } from '@/theme';

import {
  CHIN_BOUNDS,
  DETECTION_VIEWBOX,
  FACE_MESH_DOTS,
  MESH_LEFT,
  MESH_RIGHT,
} from './faceMeshGeometry';

type Props = {
  width: number;
  height: number;
};

/**
 * Figma node 0:55 — vector face mesh, landmark dots, and jaw scan gradient.
 * Rendered as native SVG (not a flattened PNG) for a crisp, transparent overlay.
 */
export function FaceDetectionMesh({ width, height }: Props) {
  const vbW = DETECTION_VIEWBOX.width;
  const vbH = DETECTION_VIEWBOX.height;

  return (
    <View style={[styles.wrap, { width, height }]}>
      <Svg width={width} height={height} viewBox={`0 0 ${vbW} ${vbH}`}>
        <Defs>
          <LinearGradient
            id="chinScanGradient"
            x1={CHIN_BOUNDS.width / 2}
            y1={2.76}
            x2={CHIN_BOUNDS.width / 2}
            y2={CHIN_BOUNDS.height + 25}
            gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor={palette.brand[300]} stopOpacity={0} />
            <Stop offset="1" stopColor={palette.brand[300]} stopOpacity={0.8} />
          </LinearGradient>
        </Defs>

        <G x={CHIN_BOUNDS.x} y={CHIN_BOUNDS.y}>
          <Path d={CHIN_BOUNDS.path} fill="url(#chinScanGradient)" />
        </G>

        <G
          transform={`translate(${MESH_LEFT.x}, ${MESH_LEFT.y}) scale(${MESH_LEFT.width / 97.779}, ${MESH_LEFT.height / 256.039})`}>
          <Path
            d={MESH_LEFT.path}
            stroke={palette.white}
            strokeWidth={1.25}
            strokeOpacity={0.3}
            fill="none"
          />
        </G>

        <G
          transform={`translate(${MESH_RIGHT.x}, ${MESH_RIGHT.y}) scale(${MESH_RIGHT.width / 100.388}, ${MESH_RIGHT.height / 255.4})`}>
          <Path
            d={MESH_RIGHT.path}
            stroke={palette.white}
            strokeWidth={1.25}
            strokeOpacity={0.3}
            fill="none"
          />
        </G>

        {FACE_MESH_DOTS.map((dot, index) => (
          <G key={index}>
            <Circle cx={dot.x} cy={dot.y} r={4} fill={palette.white} fillOpacity={0.25} />
            <Circle cx={dot.x} cy={dot.y} r={2.5} fill={palette.white} fillOpacity={0.95} />
          </G>
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: 'transparent',
  },
});
