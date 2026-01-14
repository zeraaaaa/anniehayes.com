// Preview Player - 30 second previews only

document.addEventListener('DOMContentLoaded', function() {
    const previewPlayer = document.getElementById('preview-player');
    
    if (!previewPlayer) {
        return; // Preview player not on this page
    }
    
    initPreviewPlayer();
});

function initPreviewPlayer() {
    const previewPlayer = document.getElementById('preview-player');
    const playBtn = document.getElementById('preview-play-btn');
    const timeDisplay = document.getElementById('preview-time');
    
    const PREVIEW_DURATION = 30; // 30 seconds
    
    if (!previewPlayer || !playBtn) {
        return;
    }
    
    // Preview tracks - replace with actual preview URLs
    const previewTracks = [
        {
            title: 'Track Preview',
            src: 'assets/audio/preview1.mp3'
        }
    ];
    
    let currentTrackIndex = 0;
    let previewTimer = null;
    
    // Play/Pause functionality
    playBtn.addEventListener('click', function() {
        if (previewPlayer.paused) {
            playPreview();
        } else {
            stopPreview();
        }
    });
    
    function playPreview() {
        if (previewTracks[currentTrackIndex]) {
            previewPlayer.src = previewTracks[currentTrackIndex].src;
            previewPlayer.currentTime = 0;
            previewPlayer.play();
            
            playBtn.textContent = '⏸ Stop Preview';
            playBtn.setAttribute('aria-label', 'Stop preview');
            
            // Stop after 30 seconds
            previewTimer = setTimeout(function() {
                stopPreview();
            }, PREVIEW_DURATION * 1000);
            
            // Update time display
            updateTimeDisplay();
            const timeInterval = setInterval(updateTimeDisplay, 100);
            
            previewPlayer.addEventListener('ended', function onEnded() {
                clearInterval(timeInterval);
                stopPreview();
                previewPlayer.removeEventListener('ended', onEnded);
            });
        }
    }
    
    function stopPreview() {
        previewPlayer.pause();
        previewPlayer.currentTime = 0;
        playBtn.textContent = '▶ Play Preview';
        playBtn.setAttribute('aria-label', 'Play preview');
        
        if (previewTimer) {
            clearTimeout(previewTimer);
            previewTimer = null;
        }
        
        if (timeDisplay) {
            timeDisplay.textContent = '0:00 / 0:30';
        }
    }
    
    function updateTimeDisplay() {
        if (timeDisplay && previewPlayer) {
            const current = Math.floor(previewPlayer.currentTime);
            const max = Math.min(current, PREVIEW_DURATION);
            timeDisplay.textContent = `${formatTime(max)} / 0:30`;
        }
    }
    
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Optional: Load preview when clicking on release cards
    const releaseCards = document.querySelectorAll('.release-card');
    releaseCards.forEach((card, index) => {
        card.addEventListener('click', function(e) {
            // Only trigger if not clicking on a link
            if (!e.target.closest('a')) {
                if (previewTracks[index]) {
                    currentTrackIndex = index;
                    const trackTitle = card.querySelector('h3')?.textContent || 'Track Preview';
                    const titleEl = document.querySelector('.preview-track-title');
                    if (titleEl) {
                        titleEl.textContent = trackTitle;
                    }
                    playPreview();
                }
            }
        });
    });
}
