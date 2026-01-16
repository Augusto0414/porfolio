<script lang="ts">
  import { onMount, tick } from 'svelte';
  import ProjectCard from './ProjectCard.svelte';
  import { projects } from '../data/projects';

  // --- Portal Action ---
  function portal(node: HTMLElement) {
    let target = document.body;
    async function update() {
      // Ensure we move it to body
      target.appendChild(node);
      node.hidden = false;
    }
    
    function destroy() {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    }
    
    update();
    
    return {
      destroy
    };
  }

  // --- Image Lightbox State ---
  let isLightboxOpen = false;
  let lightboxImageSrc = '';
  let lightboxImageAlt = '';

  // --- Video Lightbox State ---
  let isVideoLightboxOpen = false;
  let lightboxVideoEl: HTMLVideoElement;
  let lightboxVideoSrcWebm = '';
  let lightboxVideoSrcMp4 = '';
  // Error state
  let videoError = false;

  // --- Helper: Check if resource exists ---
  async function exists(url: string): Promise<boolean> {
    try {
      const r = await fetch(url, { method: 'HEAD' });
      return r.ok;
    } catch (e) {
      return false;
    }
  }

  // --- Handlers ---
  function handleOpenImageLightbox(event: CustomEvent) {
    lightboxImageSrc = event.detail.src;
    lightboxImageAlt = event.detail.alt;
    isLightboxOpen = true;
    document.body.classList.add('overflow-hidden');
  }

  function closeLightbox() {
    isLightboxOpen = false;
    lightboxImageSrc = '';
    lightboxImageAlt = '';
    document.body.classList.remove('overflow-hidden');
  }

  async function handleOpenVideoLightbox(event: CustomEvent) {
    const rawSrc = event.detail.videoSrc; 
    
    const BASE = import.meta.env.BASE_URL || '/';
    const toBase = (p: string) => (p.startsWith('/') ? BASE + p.slice(1) : BASE + p);

    let mp4SrcLocal = rawSrc.startsWith('/assets/') ? rawSrc.slice(1) : `assets/img/${rawSrc}`;
    const finalMp4Url = toBase(mp4SrcLocal);
    
    const baseWithoutExt = finalMp4Url.replace(/\.mp4$/i, '');
    const webmPath = `${baseWithoutExt}.webm`;
    const h264Path = `${baseWithoutExt}-h264.mp4`;

    let chosenWebm = '';
    let chosenMp4 = '';

    if (await exists(webmPath)) chosenWebm = webmPath;
    if (await exists(h264Path)) chosenMp4 = h264Path;
    if (!chosenMp4 && await exists(finalMp4Url)) chosenMp4 = finalMp4Url;

    lightboxVideoSrcWebm = chosenWebm;
    lightboxVideoSrcMp4 = chosenMp4;
    
    videoError = false;
    isVideoLightboxOpen = true;
    document.body.classList.add('overflow-hidden');
    
    // Play after UI update
    await tick();
    setTimeout(() => {
        if (lightboxVideoEl) {
            lightboxVideoEl.load();
            lightboxVideoEl.muted = true;
            lightboxVideoEl.play().catch(e => console.error("Auto-play failed", e));
            setTimeout(() => { if(lightboxVideoEl) lightboxVideoEl.muted = false; }, 150);
        }
    }, 50);
  }

  function closeVideoLightbox() {
    if (lightboxVideoEl) {
        lightboxVideoEl.pause();
        lightboxVideoSrcWebm = '';
        lightboxVideoSrcMp4 = '';
        lightboxVideoEl.load(); 
    }
    isVideoLightboxOpen = false;
    document.body.classList.remove('overflow-hidden');
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      if (isLightboxOpen) closeLightbox();
      if (isVideoLightboxOpen) closeVideoLightbox();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="projects-wrapper">
  <div class="mb-8">
    <h2 class="text-3xl sm:text-4xl font-bold text-white mb-2">Proyectos</h2>
    <p class="text-base text-gray-500">Aplicaciones que he desarrollado</p>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each projects as project (project.id)}
      <ProjectCard 
        {project} 
        on:openImageLightbox={handleOpenImageLightbox}
        on:openVideoLightbox={handleOpenVideoLightbox}
      />
    {/each}
  </div>

  <!-- Image Lightbox -->
  {#if isLightboxOpen}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div 
        class="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4"
        on:click|self={closeLightbox}
        use:portal
    >
      <div class="lightbox-inner relative w-full max-w-[95vw] max-h-[95vh] flex items-center justify-center p-4">
        <button 
            class="close-btn absolute top-3 right-3 z-20" 
            aria-label="Cerrar"
            on:click={closeLightbox}
        >
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        <img src={lightboxImageSrc} alt={lightboxImageAlt} class="lightbox-image max-w-full max-h-full object-contain rounded-lg shadow-xl" />
      </div>
    </div>
  {/if}

  <!-- Video Lightbox -->
  {#if isVideoLightboxOpen}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div 
        class="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4"
        on:click|self={closeVideoLightbox}
        use:portal
    >
      <button 
          class="close-btn fixed top-4 right-4 z-[9999]" 
          aria-label="Cerrar video"
          on:click={closeVideoLightbox}
      >
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <div class="lightbox-inner relative w-full max-w-[95vw] max-h-[95vh] flex items-center justify-center p-4">
        <video 
            bind:this={lightboxVideoEl}
            class="lightbox-video w-full h-full max-w-full max-h-full object-contain rounded-lg shadow-xl" 
            controls 
            playsinline 
            loop
            on:error={() => { videoError = true; }}
            on:loadeddata={() => { videoError = false; }}
        >
            {#if lightboxVideoSrcWebm}<source src={lightboxVideoSrcWebm} type="video/webm" />{/if}
            {#if lightboxVideoSrcMp4}<source src={lightboxVideoSrcMp4} type="video/mp4" />{/if}
        </video>
        
        {#if videoError}
            <div class="absolute inset-0 flex items-center justify-center text-center p-6">
                <div class="bg-black/80 text-white rounded-md p-4 max-w-[90%]">
                <p class="mb-2">No se puede reproducir este video en tu navegador.</p>
                <a class="underline text-sm" href={lightboxVideoSrcMp4} target="_blank" rel="noreferrer">Descargar video</a>
                </div>
            </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  /* Lightbox specialized styles passed from original css */
  .lightbox-inner {
    backdrop-filter: blur(6px);
    border-radius: 12px;
    overflow: hidden;
    animation: fadeInScale .18s ease-out both;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .lightbox-video {
    background: #000;
  }

  .lightbox-image {
    max-width: 100%;
    max-height: calc(95vh - 3rem);
    width: auto;
    height: auto;
    object-fit: contain;
  }
  
  .close-btn {
    background: rgba(0,0,0,0.5);
    padding: 6px;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 18px rgba(0,0,0,0.5);
    transition: background .15s ease, transform .08s ease;
    cursor: pointer;
  }

  .close-btn:hover {
    background: rgba(255,255,255,0.06);
    transform: scale(1.02);
  }

  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(.985); }
    to   { opacity: 1; transform: scale(1); }
  }
  
  /* Ensure styles for portal are global or at least applied */
  :global(.lightbox-open) {
      overflow: hidden;
  }
</style>
