varying vec2 vUv;
varying vec2 cloudUV;

varying vec3 vColor;
uniform float uTime;

void main() {
  vUv = uv;
  cloudUV = uv;
  vColor = color;
  vec3 cpos = position;

  float waveSize = 10.0;
  float tipDistance = 0.3;
  float centerDistance = 0.1;

  if (color.x > 0.6) {
    cpos.x += sin((uTime * 1.5) + (uv.x * waveSize)) * tipDistance;
  }else if (color.x > 0.0) {
    cpos.x += sin((uTime * 1.5) + (uv.x * waveSize)) * centerDistance;
  }

  float diff = position.x - cpos.x;
  cloudUV.x += uTime * 0.03;
  cloudUV.y += uTime * 0.03;

  vec4 worldPosition = vec4(cpos, 1.);
  vec4 mvPosition = projectionMatrix * modelViewMatrix * vec4(cpos, 1.0);
  gl_Position = mvPosition;
}
