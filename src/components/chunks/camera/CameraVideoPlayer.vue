<template>
  <VSheet
    v-if="src"
    class="video-container"
  >
    <video
      ref="videoPlayer"
      controls
      playsinline
      @error="handleError"
    >
      <source
        :src="src"
        type="video/mp4"
      >
      Your browser does not support HTML5 video.
    </video>
    <div
      v-if="error"
      class="error"
    >
      {{ error }}
    </div>
  </VSheet>
  <VSkeletonLoader
    v-else
    height="500"
  />
</template>

<script>
import moment from "moment";

export default {
  name: 'CameraVideoPlayer',
  props: {
    event: {
      type: Object,
      required: true
    },
    src: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      player: null,
      videoObjectUrl: '',
      error: null,
      loading: false
    };
  },
  mounted() {
    this.setupVideoPlayer();
  },
  beforeUnmount() {
    if (this.videoObjectUrl) {
      URL.revokeObjectURL(this.videoObjectUrl);
    }
  },
  methods: {
    onTimeUpdate(e) {
      const seconds = Math.floor(this.player.currentTime)
      const date = moment(this.event.start).add(seconds, 'seconds').toDate()
      this.$store.commit('updatePlayback', {seconds, date})
    },
    setupVideoPlayer() {
      this.loading = true;
      try {
        this.$nextTick(() => {
          this.player = this.$refs.videoPlayer;
          this.player.addEventListener("timeupdate", this.onTimeUpdate);
          this.player.src = this.src;
          this.player.load();
          this.player.play().catch(e => {
            console.log('Autoplay prevented:', e);
          });
        });
      } catch (err) {
        console.error('Error loading video:', err);
        this.error = err.response?.data?.detail || 'Failed to load video';
      } finally {
        this.loading = false;
      }
    },
    handleError(e) {
      console.error('Video error:', e);
      this.error = 'Video playback error';
    }
  }
};
</script>

<style scoped>
.video-container {
  position: relative;
  max-width: 100%;
}

video {
  width: 100%;
  max-height: 80vh;
  background: #000;
}

.error {
  color: #ff4444;
  padding: 10px;
  margin-top: 10px;
  background: #ffeeee;
}
</style>