/**
 * Audio Controller for Wedding Invitation
 * Plays "Kusuma Wijaya" via YouTube IFrame API (Video ID: TGzpx4kz9Pc)
 * Handles modern browser autoplay restrictions seamlessly.
 */

class WeddingAudioManager {
  constructor() {
    this.videoId = 'TGzpx4kz9Pc'; // Lagu Kusuma Wijaya
    this.player = null;
    this.isReady = false;
    this.isPlaying = false;
    this.hasUserInteracted = false;
    
    // UI Elements
    this.widget = document.getElementById('music-widget');
    this.discIcon = document.getElementById('disc-icon');
    this.musicTitle = document.getElementById('music-title');
    this.musicSub = document.getElementById('music-sub');
    
    this.initYouTubeAPI();
    this.bindEvents();
  }

  initYouTubeAPI() {
    // Check if YouTube API is already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Global callback for YouTube API
    window.onYouTubeIframeAPIReady = () => {
      this.player = new YT.Player('yt-player-container', {
        height: '1',
        width: '1',
        videoId: this.videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          fs: 0,
          loop: 1,
          playlist: this.videoId,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          origin: window.location.origin
        },
        events: {
          onReady: (event) => this.onPlayerReady(event),
          onStateChange: (event) => this.onPlayerStateChange(event),
          onError: (event) => this.onPlayerError(event)
        }
      });
    };
  }

  onPlayerReady(event) {
    this.isReady = true;
    this.player.setVolume(100);
    
    // Attempt automatic playback (works in browsers that allow autoplay or after user interaction)
    try {
      const playPromise = this.player.playVideo();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.setPlayingState(true);
        }).catch(() => {
          // Autoplay was prevented by browser policy; will start when user clicks "Buka Undangan"
          console.log('Audio autoplay prevented by browser. Awaiting user interaction.');
        });
      }
    } catch (e) {
      console.log('Autoplay attempt caught:', e);
    }
  }

  onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
      this.setPlayingState(true);
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
      this.setPlayingState(false);
      // If video ended and loop didn't trigger automatically, replay
      if (event.data === YT.PlayerState.ENDED) {
        this.play();
      }
    }
  }

  onPlayerError(event) {
    console.warn('YouTube Audio Player encountered notice:', event.data);
  }

  play() {
    if (this.player && typeof this.player.playVideo === 'function') {
      try {
        this.player.unMute();
        this.player.setVolume(100);
        this.player.playVideo();
        this.setPlayingState(true);
      } catch (err) {
        console.warn('Error invoking playVideo:', err);
      }
    }
  }

  pause() {
    if (this.player && typeof this.player.pauseVideo === 'function') {
      this.player.pauseVideo();
      this.setPlayingState(false);
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  setPlayingState(playing) {
    this.isPlaying = playing;
    if (this.widget) {
      if (playing) {
        this.widget.classList.add('playing');
        if (this.discIcon) this.discIcon.classList.add('playing');
        if (this.musicSub) this.musicSub.textContent = 'Gendhing Saweg Dipun-putar';
      } else {
        this.widget.classList.remove('playing');
        if (this.discIcon) this.discIcon.classList.remove('playing');
        if (this.musicSub) this.musicSub.textContent = 'Tutul kangge nyetel lagu';
      }
    }
  }

  bindEvents() {
    if (this.widget) {
      this.widget.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });
    }

    // In case user clicks anywhere on page before opening
    const firstInteraction = () => {
      if (!this.hasUserInteracted) {
        this.hasUserInteracted = true;
        if (!this.isPlaying && this.isReady) {
          this.play();
        }
      }
      window.removeEventListener('click', firstInteraction);
      window.removeEventListener('touchstart', firstInteraction);
    };

    window.addEventListener('click', firstInteraction, { once: true });
    window.addEventListener('touchstart', firstInteraction, { once: true });
  }
}

// Instantiate audio manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.weddingAudio = new WeddingAudioManager();
});
