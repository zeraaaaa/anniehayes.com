// Music Player Functionality

document.addEventListener('DOMContentLoaded', function() {
    const audioPlayer = document.getElementById('audio-player');
    
    if (!audioPlayer) {
        return; // Music player not on this page
    }
    
    initMusicPlayer();
});

function initMusicPlayer() {
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const volumeBar = document.getElementById('volume-bar');
    const volumeBtn = document.getElementById('volume-btn');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const trackTitleEl = document.querySelector('.player-track-title');
    const trackArtistEl = document.querySelector('.player-track-artist');
    
    // Track list - placeholder data structure
    // Replace with actual track data
    const tracks = [
        {
            title: 'Track Title 1',
            artist: 'Annie Hayes',
            src: 'assets/audio/track1.mp3'
        },
        {
            title: 'Track Title 2',
            artist: 'Annie Hayes',
            src: 'assets/audio/track2.mp3'
        },
        {
            title: 'Track Title 3',
            artist: 'Annie Hayes',
            src: 'assets/audio/track3.mp3'
        }
    ];
    
    let currentTrackIndex = 0;
    let wasPlaying = false;
    
    // Initialize volume
    if (volumeBar) {
        audioPlayer.volume = volumeBar.value / 100;
    }
    
    // Play/Pause functionality
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlayPause);
    }
    
    function togglePlayPause() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseBtn.textContent = '⏸';
            playPauseBtn.setAttribute('aria-label', 'Pause');
        } else {
            audioPlayer.pause();
            playPauseBtn.textContent = '▶';
            playPauseBtn.setAttribute('aria-label', 'Play');
        }
    }
    
    // Previous track
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
            loadTrack(currentTrackIndex);
            if (wasPlaying) {
                audioPlayer.play();
            }
        });
    }
    
    // Next track
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
            loadTrack(currentTrackIndex);
            if (wasPlaying) {
                audioPlayer.play();
            }
        });
    }
    
    // Load track
    function loadTrack(index) {
        if (tracks[index]) {
            const track = tracks[index];
            audioPlayer.src = track.src;
            
            if (trackTitleEl) trackTitleEl.textContent = track.title;
            if (trackArtistEl) trackArtistEl.textContent = track.artist;
            
            // Update album art if needed
            // You can add logic here to change album art based on track
            
            wasPlaying = !audioPlayer.paused;
            audioPlayer.load();
        }
    }
    
    // Progress bar
    if (progressBar) {
        audioPlayer.addEventListener('loadedmetadata', function() {
            progressBar.max = audioPlayer.duration;
            if (durationEl) {
                durationEl.textContent = formatTime(audioPlayer.duration);
            }
        });
        
        audioPlayer.addEventListener('timeupdate', function() {
            if (progressBar) {
                progressBar.value = audioPlayer.currentTime;
            }
            if (currentTimeEl) {
                currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
            }
        });
        
        progressBar.addEventListener('input', function() {
            audioPlayer.currentTime = progressBar.value;
        });
        
        progressBar.addEventListener('change', function() {
            audioPlayer.currentTime = progressBar.value;
        });
    }
    
    // Volume control
    if (volumeBar) {
        volumeBar.addEventListener('input', function() {
            audioPlayer.volume = volumeBar.value / 100;
            updateVolumeIcon();
        });
    }
    
    if (volumeBtn) {
        volumeBtn.addEventListener('click', function() {
            if (audioPlayer.volume > 0) {
                audioPlayer.volume = 0;
                volumeBar.value = 0;
            } else {
                audioPlayer.volume = 0.5;
                volumeBar.value = 50;
            }
            updateVolumeIcon();
        });
    }
    
    function updateVolumeIcon() {
        if (!volumeBtn) return;
        
        if (audioPlayer.volume === 0) {
            volumeBtn.textContent = '🔇';
            volumeBtn.setAttribute('aria-label', 'Unmute');
        } else if (audioPlayer.volume < 0.5) {
            volumeBtn.textContent = '🔉';
            volumeBtn.setAttribute('aria-label', 'Mute');
        } else {
            volumeBtn.textContent = '🔊';
            volumeBtn.setAttribute('aria-label', 'Mute');
        }
    }
    
    // Track ended - play next
    audioPlayer.addEventListener('ended', function() {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        loadTrack(currentTrackIndex);
        audioPlayer.play();
    });
    
    // Track list play buttons
    const trackItems = document.querySelectorAll('.track-item');
    trackItems.forEach((item, index) => {
        const playBtn = item.querySelector('.track-play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', function() {
                currentTrackIndex = index;
                loadTrack(currentTrackIndex);
                audioPlayer.play();
                if (playPauseBtn) {
                    playPauseBtn.textContent = '⏸';
                    playPauseBtn.setAttribute('aria-label', 'Pause');
                }
            });
        }
    });
    
    // Release card play buttons
    const playOverlays = document.querySelectorAll('.play-overlay');
    playOverlays.forEach((overlay, index) => {
        overlay.addEventListener('click', function() {
            const trackNum = parseInt(this.getAttribute('data-track')) - 1;
            if (trackNum >= 0 && trackNum < tracks.length) {
                currentTrackIndex = trackNum;
                loadTrack(currentTrackIndex);
                audioPlayer.play();
                if (playPauseBtn) {
                    playPauseBtn.textContent = '⏸';
                    playPauseBtn.setAttribute('aria-label', 'Pause');
                }
            }
        });
    });
    
    // Format time helper
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Initialize first track
    if (tracks.length > 0) {
        loadTrack(0);
    }
}
