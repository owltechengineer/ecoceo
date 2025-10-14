"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const AnimatedBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const animationIdRef = useRef<number>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Create fluid particles
    const particleCount = 2000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random positions
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;

      // Black, white, or grey colors
      const colorChoice = Math.random();
      if (colorChoice < 0.4) {
        // Black
        colors[i3] = 0;
        colors[i3 + 1] = 0;
        colors[i3 + 2] = 0;
      } else if (colorChoice < 0.8) {
        // White
        colors[i3] = 1;
        colors[i3 + 1] = 1;
        colors[i3 + 2] = 1;
      } else {
        // Grey
        const grey = Math.random() * 0.5 + 0.25;
        colors[i3] = grey;
        colors[i3 + 1] = grey;
        colors[i3 + 2] = grey;
      }

      sizes[i] = Math.random() * 3 + 1;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Shader material for fluid effect
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          vec3 pos = position;
          
          // Add fluid movement
          pos.x += sin(time * 0.5 + position.y * 0.1) * 0.5;
          pos.y += cos(time * 0.3 + position.x * 0.1) * 0.5;
          pos.z += sin(time * 0.4 + position.x * 0.05) * 0.3;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float distance = length(gl_PointCoord - vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distance);
          gl_FragColor = vec4(vColor, alpha * 0.8);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });

    const particleSystem = new THREE.Points(particles, material);
    scene.add(particleSystem);

    // Add swirling meshes for more fluid effect
    const createSwirlMesh = () => {
      const geometry = new THREE.PlaneGeometry(8, 8, 32, 32);
      const swirlMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0x000000) },
          color2: { value: new THREE.Color(0xffffff) }
        },
        vertexShader: `
          varying vec2 vUv;
          uniform float time;
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            pos.z += sin(pos.x * 2.0 + time) * 0.1;
            pos.z += cos(pos.y * 2.0 + time * 0.7) * 0.1;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 color1;
          uniform vec3 color2;
          varying vec2 vUv;
          
          void main() {
            vec2 center = vec2(0.5, 0.5);
            float dist = distance(vUv, center);
            float angle = atan(vUv.y - center.y, vUv.x - center.x);
            float swirl = sin(angle * 3.0 + time + dist * 10.0) * 0.5 + 0.5;
            
            vec3 color = mix(color1, color2, swirl);
            float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
            gl_FragColor = vec4(color, alpha * 0.3);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending
      });
      
      const mesh = new THREE.Mesh(geometry, swirlMaterial);
      mesh.position.z = -2;
      return mesh;
    };

    // Add multiple swirl meshes
    for (let i = 0; i < 3; i++) {
      const swirl = createSwirlMesh();
      swirl.position.x = (Math.random() - 0.5) * 10;
      swirl.position.y = (Math.random() - 0.5) * 10;
      swirl.rotation.z = Math.random() * Math.PI * 2;
      scene.add(swirl);
    }

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;
      
      // Update particle system
      if (material.uniforms.time) {
        material.uniforms.time.value = time;
      }
      
      // Rotate particle system
      particleSystem.rotation.x = time * 0.1;
      particleSystem.rotation.y = time * 0.05;
      
      // Update swirl meshes
      scene.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.ShaderMaterial) {
          if (child.material.uniforms.time) {
            child.material.uniforms.time.value = time;
          }
          child.rotation.z += 0.01;
        }
      });
      
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!renderer || !camera) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      
      if (material.uniforms.resolution) {
        material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particles.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
};

export default AnimatedBackground;
