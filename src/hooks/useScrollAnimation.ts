import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimation = (
  cityGroupRef: React.RefObject<any>, 
  cameraRef: React.RefObject<any>
) => {
  useLayoutEffect(() => {
    if (!cityGroupRef.current || !cameraRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(cityGroupRef.current.rotation, { x: 0.3, y: 0 });
      gsap.set(cameraRef.current.position, { z: 18 });

      // Create scroll timeline spanning the fixed overlay
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#welcome-scroll-container",
          start: "top top",
          end: "bottom bottom",
          scrub: 1, // Smooth scrolling effect
        }
      });

      // At scroll 33%: rotationY = Math.PI * 0.4, camera Z = 14
      tl.to(cityGroupRef.current.rotation, {
        y: Math.PI * 0.4,
        ease: "none"
      }, 0);
      tl.to(cameraRef.current.position, {
        z: 14,
        ease: "none"
      }, 0);

      // At scroll 66%: rotationY = Math.PI * 0.8, rotationX = 0.1, camera Z = 12
      tl.to(cityGroupRef.current.rotation, {
        y: Math.PI * 0.8,
        x: 0.1,
        ease: "none"
      }, 0.33);
      tl.to(cameraRef.current.position, {
        z: 12,
        ease: "none"
      }, 0.33);

      // At scroll 100%: rotationY = Math.PI * 1.2, camera Z = 10
      tl.to(cityGroupRef.current.rotation, {
        y: Math.PI * 1.2,
        x: 0,
        ease: "none"
      }, 0.66);
      tl.to(cameraRef.current.position, {
        z: 10,
        ease: "none"
      }, 0.66);

    });

    return () => ctx.revert(); // Cleanup GSAP context on unmount
  }, [cityGroupRef, cameraRef]);
};
