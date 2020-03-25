<template>
</template>

<script>
  /* eslint-disable */
  import THREE from '../../../assets/js/three.min';

  let SEPARATION = 100,
    AMOUNTX = 50,
    AMOUNTY = 50;

  let container;
  let camera, scene, renderer;

  let particles,
    particle,
    count = 0;

  let mouseX = 85,
    mouseY = -200;

  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;
  export default {
    data() {
      return {};
    },
    methods: {
      init() {
        container = document.createElement("div");
        document.body.appendChild(container);
        camera = new THREE.THREE.PerspectiveCamera(
          120,
          window.innerWidth / window.innerHeight,
          1,
          10000
        );
        container.style.cssText = "position:fixed;top:276px;left:0;opacity:0.9;";
        camera.position.z = 1000;

        scene = new THREE.THREE.Scene();

        particles = new Array();

        let PI2 = Math.PI * 2;
        let material = new THREE.THREE.ParticleCanvasMaterial({
          color: 0x02ffff,
          program: function (context) {
            context.beginPath();
            context.arc(0, 0, 1, 0, PI2, true);
            context.fill();
          }
        });

        let i = 0;

        for (let ix = 0; ix < AMOUNTX; ix++) {
          for (let iy = 0; iy < AMOUNTY; iy++) {
            particle = particles[i++] = new THREE.THREE.Particle(material);
            particle.position.x = ix * SEPARATION - AMOUNTX * SEPARATION / 2;
            particle.position.z = iy * SEPARATION - AMOUNTY * SEPARATION / 2;
            scene.add(particle);
          }
        }

        renderer = new THREE.THREE.CanvasRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);


        window.addEventListener("resize", this.onWindowResize, false);
      },
      onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
      },
      animate() {
        requestAnimationFrame(this.animate);

        this.render();
      },
      render() {
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        let i = 0;

        for (let ix = 0; ix < AMOUNTX; ix++) {
          for (let iy = 0; iy < AMOUNTY; iy++) {
            particle = particles[i++];
            particle.position.y =
              Math.sin((ix + count) * 0.3) * 50 +
              Math.sin((iy + count) * 0.5) * 50;
            particle.scale.x = particle.scale.y =
              (Math.sin((ix + count) * 0.3) + 1) * 2 +
              (Math.sin((iy + count) * 0.5) + 1) * 2;
          }
        }

        renderer.render(scene, camera);

        count += 0.1;
      }
    },
    mounted() {
      this.init();
      this.animate();
    }
  };
</script>
<style scoped>

</style>
