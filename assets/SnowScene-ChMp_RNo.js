import{j as t,r as n}from"./index-2imuvZ8V.js";import{aU as s,aj as a,aV as l}from"./react-three-fiber.esm-Bezq6Iok.js";function p(){const o=n.useRef(null),r=n.useMemo(()=>{const e=new Float32Array(2460);for(let i=0;i<820;i+=1)e[i*3]=(Math.random()-.5)*13,e[i*3+1]=Math.random()*7-3.5,e[i*3+2]=(Math.random()-.5)*6;return e},[]);return a(({clock:e})=>{o.current&&(o.current.rotation.y=e.getElapsedTime()*.022,o.current.position.y=-(e.getElapsedTime()*.1%1)*.42)}),t.jsxs("points",{ref:o,children:[t.jsx("bufferGeometry",{children:t.jsx("bufferAttribute",{attach:"attributes-position",args:[r,3]})}),t.jsx("shaderMaterial",{transparent:!0,depthWrite:!1,blending:l,vertexShader:`
          varying float vAlpha;
          void main() {
            vAlpha = 0.45 + sin(position.x * 1.7 + position.y) * 0.28;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = 4.0 * (18.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,fragmentShader:`
          varying float vAlpha;
          void main() {
            float d = distance(gl_PointCoord, vec2(0.5));
            float snow = smoothstep(0.5, 0.0, d);
            gl_FragColor = vec4(1.0, 0.94, 0.82, snow * vAlpha);
          }
        `})]})}function f(){const o=n.useRef(null);return a(({clock:r})=>{o.current&&(o.current.rotation.z=Math.sin(r.getElapsedTime()*.38)*.05)}),t.jsx("group",{ref:o,children:[-2.6,-1.25,0,1.25,2.6].map((r,e)=>t.jsxs("mesh",{position:[r,Math.sin(e)*.4,-.3],children:[t.jsx("sphereGeometry",{args:[.095,16,16]}),t.jsx("meshBasicMaterial",{color:e%2?"#f2b554":"#ffdfad",toneMapped:!1})]},r))})}function u(){return t.jsxs(s,{dpr:[1,1.4],camera:{position:[0,0,4.5],fov:48},gl:{alpha:!0,antialias:!0,powerPreference:"high-performance"},children:[t.jsx("fog",{attach:"fog",args:["#172520",2,9]}),t.jsx("ambientLight",{intensity:.35,color:"#d9f3e8"}),t.jsx("pointLight",{position:[0,1.4,2],intensity:16,color:"#ffd68c",distance:7}),t.jsx(p,{}),t.jsx(f,{})]})}export{u as default};
