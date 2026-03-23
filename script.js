gsap.registerPlugin(ScrollTrigger);

const sections = document.querySelectorAll(".panel");
const navLinks = document.querySelectorAll(".nav-link");
const revealItems = document.querySelectorAll(".reveal");
const projectModal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const modalImage = document.getElementById("modalImage");
const modalSecondaryImage = document.getElementById("modalSecondaryImage");
const modalDescription = document.getElementById("modalDescription");
const modalProcess = document.getElementById("modalProcess");
const closeModalTriggers = document.querySelectorAll("[data-close-modal]");
const photoTrack = document.querySelector(".photo-track");
const downloadCvButton = document.getElementById("downloadCv");
const modalFlipbook = document.getElementById("modalFlipbook");

function setActiveLink(sectionId) {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.section === sectionId);
  });
}

sections.forEach((section) => {
  ScrollTrigger.create({
    trigger: section,
    start: "top center",
    end: "bottom center",
    onEnter: () => setActiveLink(section.dataset.section),
    onEnterBack: () => setActiveLink(section.dataset.section),
  });
});

revealItems.forEach((item, index) => {
  gsap.to(item, {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: "power3.out",
    delay: index * 0.04,
    scrollTrigger: {
      trigger: item,
      start: "top 82%",
    },
  });
});

gsap.to(".avatar-orbit__ring--one", {
  rotation: 360,
  duration: 20,
  repeat: -1,
  ease: "none",
});

gsap.to(".avatar-orbit__ring--two", {
  rotation: -360,
  duration: 24,
  repeat: -1,
  ease: "none",
});

gsap.to(".avatar-frame", {
  boxShadow: "0 0 120px rgba(119, 94, 136, 0.5)",
  duration: 2.5,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
});

function buildInfiniteTrack() {
  if (!photoTrack) {
    return;
  }

  // Duplica la pista para sostener un loop visual continuo.
  photoTrack.innerHTML += photoTrack.innerHTML;
  const totalWidth = photoTrack.scrollWidth / 2;

  gsap.to(photoTrack, {
    x: -totalWidth,
    duration: 32,
    ease: "none",
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize((value) => parseFloat(value) % totalWidth),
    },
  });
}

function openModal(trigger) {
  const type = trigger.dataset.type || "";
  modalTitle.textContent = trigger.dataset.title || "";
  modalSubtitle.textContent = trigger.dataset.subtitle || "";
  modalImage.src = trigger.dataset.image || "";
  modalImage.alt = trigger.dataset.title || "Proyecto visual";
  modalDescription.textContent = trigger.dataset.description || "";
  modalProcess.textContent = trigger.dataset.process || "";

  if (trigger.dataset.secondary) {
    modalSecondaryImage.src = trigger.dataset.secondary;
    modalSecondaryImage.alt = `${trigger.dataset.title || "Proyecto"} detalle secundario`;
    modalSecondaryImage.classList.remove("hidden");
  } else {
    modalSecondaryImage.classList.add("hidden");
    modalSecondaryImage.removeAttribute("src");
  }

  modalFlipbook.classList.toggle("hidden", type !== "editorial");

  projectModal.classList.add("is-open");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal() {
  projectModal.classList.remove("is-open");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-type]");

  if (!trigger) {
    return;
  }

  openModal(trigger);
});

closeModalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && projectModal.classList.contains("is-open")) {
    closeModal();
  }
});

document.querySelectorAll(".model-card").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = (x / rect.width - 0.5) * 14;
    const rotateX = (y / rect.height - 0.5) * -14;

    gsap.to(card, {
      rotateX,
      rotateY,
      scale: 1.03,
      duration: 0.25,
      transformPerspective: 1000,
      ease: "power2.out",
    });
  });

  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.35,
      ease: "power2.out",
    });
  });
});

function downloadCv() {
  const cvContent = `Iris Del Carpio
Disenadora Grafica

Especialidades:
- Fotografia
- Modelado 3D
- Diseno editorial

Software:
- Photoshop
- Illustrator
- InDesign
- Premiere Pro
- Figma
- Blender
- ZBrush

Contacto:
irisdcb0@gmail.com`;

  const blob = new Blob([cvContent], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Iris-Del-Carpio-CV.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

if (downloadCvButton) {
  downloadCvButton.addEventListener("click", downloadCv);
}

function initThreeScene() {
  const container = document.getElementById("threeScene");

  if (!container || typeof THREE === "undefined") {
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const group = new THREE.Group();
  scene.add(group);

  // Escultura abstracta para reforzar el ambiente futurista del bloque 3D.
  const geometry = new THREE.TorusKnotGeometry(1.1, 0.35, 160, 24);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x775e88,
    emissive: 0x541533,
    emissiveIntensity: 0.4,
    roughness: 0.2,
    metalness: 0.75,
    transparent: true,
    opacity: 0.9,
  });

  const knot = new THREE.Mesh(geometry, material);
  group.add(knot);

  const wireframe = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.95, 0)),
    new THREE.LineBasicMaterial({ color: 0xb8b2b9, transparent: true, opacity: 0.3 })
  );
  group.add(wireframe);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
  const pointLight = new THREE.PointLight(0x775e88, 2.4, 30);
  pointLight.position.set(4, 4, 6);

  const pointLightSecondary = new THREE.PointLight(0x722548, 2.2, 30);
  pointLightSecondary.position.set(-4, -2, 5);

  scene.add(ambientLight, pointLight, pointLightSecondary);
  camera.position.set(0, 0, 5.8);

  const mouse = { x: 0, y: 0 };

  window.addEventListener("pointermove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  function render() {
    knot.rotation.x += 0.003;
    knot.rotation.y += 0.005;
    wireframe.rotation.x -= 0.0018;
    wireframe.rotation.y += 0.0024;
    group.rotation.y += (mouse.x * 0.2 - group.rotation.y) * 0.03;
    group.rotation.x += (mouse.y * 0.12 - group.rotation.x) * 0.03;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  function handleResize() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener("resize", handleResize);
  render();
}

buildInfiniteTrack();
initThreeScene();
