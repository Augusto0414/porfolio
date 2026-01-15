document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll(".carousel-container");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage") as HTMLImageElement;
  const closeLightbox = document.getElementById("closeLightbox");

  const videoLightbox = document.getElementById("videoLightbox");
  const lightboxVideo = document.getElementById("lightboxVideo") as HTMLVideoElement;
  const lightboxVideoSource = document.getElementById("lightboxVideoSource") as HTMLSourceElement;
  const closeVideoLightbox = document.getElementById("closeVideoLightbox");

  // Funcionalidad del Lightbox (solo para imágenes)
  const allImageContainers = document.querySelectorAll(".carousel-track > div");
  allImageContainers.forEach((container) => {
    const hasVideo = container.querySelector(".digiturno-video");
    if (hasVideo) return;

    container.addEventListener("click", (e) => {
      e.stopPropagation();
      const img = container.querySelector(".carousel-image") as HTMLImageElement;
      if (img && lightbox && lightboxImage) {
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightbox.classList.remove("hidden");
        lightbox.classList.add("flex");
      }
    });
  });

  // Cerrar lightbox con botón X
  if (closeLightbox) {
    closeLightbox.addEventListener("click", () => {
      if (lightbox) {
        lightbox.classList.add("hidden");
        lightbox.classList.remove("flex");
      }
    });
  }

  // Cerrar lightbox haciendo click fuera
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.classList.add("hidden");
        lightbox.classList.remove("flex");
      }
    });
  }

  // Cerrar con tecla ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (lightbox && !lightbox.classList.contains("hidden")) {
        lightbox.classList.add("hidden");
        lightbox.classList.remove("flex");
      }
      if (videoLightbox && !videoLightbox.classList.contains("hidden")) {
        videoLightbox.classList.add("hidden");
        videoLightbox.classList.remove("flex");
        if (lightboxVideo) lightboxVideo.pause();
      }
    }
  });

  // Cerrar video lightbox con botón X
  if (closeVideoLightbox) {
    closeVideoLightbox.addEventListener("click", () => {
      if (videoLightbox) {
        videoLightbox.classList.add("hidden");
        videoLightbox.classList.remove("flex");
        if (lightboxVideo) lightboxVideo.pause();
      }
    });
  }

  // Cerrar video lightbox haciendo click fuera
  if (videoLightbox) {
    videoLightbox.addEventListener("click", (e) => {
      if (e.target === videoLightbox) {
        videoLightbox.classList.add("hidden");
        videoLightbox.classList.remove("flex");
        if (lightboxVideo) lightboxVideo.pause();
      }
    });
  }

  // Botones de ampliar video
  const expandButtons = document.querySelectorAll(".expand-video");
  expandButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const container = (button as HTMLElement).closest(".group\\/video");
      if (!container) return;

      const video = container.querySelector(".digiturno-video") as HTMLVideoElement;
      if (!video) return;

      const videoSrc = video.getAttribute("data-video-src");
      if (videoSrc && videoLightbox && lightboxVideo && lightboxVideoSource) {
        lightboxVideoSource.src = videoSrc;
        lightboxVideo.load();
        videoLightbox.classList.remove("hidden");
        videoLightbox.classList.add("flex");
        lightboxVideo.play();
      }
    });
  });

  // Funcionalidad del Carrusel
  carousels.forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track") as HTMLElement;
    const slides = carousel.querySelectorAll(".carousel-track > div");
    const prevBtn = carousel.querySelector(".prev") as HTMLButtonElement;
    const nextBtn = carousel.querySelector(".next") as HTMLButtonElement;
    const dots = carousel.querySelectorAll(".dot");

    if (!track || !prevBtn || !nextBtn || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    function pauseAllVideos() {
      const allVideos = carousel.querySelectorAll(".digiturno-video") as NodeListOf<HTMLVideoElement>;
      allVideos.forEach((video) => {
        if (!video.paused) {
          video.pause();
          video.classList.remove("playing");
        }
      });
    }

    function updateCarousel() {
      if (track) {
        pauseAllVideos();
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
      }
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
      });
    }

    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateCarousel();
    });

    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % totalSlides;
      updateCarousel();
    });

    dots.forEach((dot, index) => {
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        currentIndex = index;
        updateCarousel();
      });
    });
  });

  // Funcionalidad del Video
  const videoElements = document.querySelectorAll(".digiturno-video");
  videoElements.forEach((video) => {
    const container = video.parentElement;
    if (!container) return;

    const overlay = container.querySelector(".video-overlay") as HTMLElement;
    if (!overlay) return;

    overlay.addEventListener("click", (e) => {
      e.stopPropagation();
      video.classList.add("playing");
      (video as HTMLVideoElement).play();
    });

    video.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!(video as HTMLVideoElement).paused) {
        (video as HTMLVideoElement).pause();
        video.classList.remove("playing");
      }
    });

    video.addEventListener("pause", () => {
      video.classList.remove("playing");
    });

    video.addEventListener("ended", () => {
      video.classList.remove("playing");
    });
  });
});
