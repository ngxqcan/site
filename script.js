// Navigation
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.content-section');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const sectionId = item.getAttribute('data-section');
        
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        sections.forEach(section => section.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');
        
        // Scroll behavior: if footer is fixed, just scroll section into view; else scroll with footer at bottom
        const footer = document.querySelector('.site-footer');
        const isFixedFooter = document.body.classList.contains('has-fixed-footer');

        if (sectionId === 'about' || sectionId === 'socials') {
            if (footer && !isFixedFooter) {
                // ensure footer is visible at bottom of viewport
                footer.scrollIntoView({ behavior: 'smooth', block: 'end' });
            } else {
                // if footer is fixed, just scroll the section into view normally
                const target = document.getElementById(sectionId);
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            // for other sections, scroll to top of main content for better UX
            const main = document.querySelector('.main-content');
            if (main) main.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});


// Public function to toggle fixed footer mode
function setFixedFooter(enabled) {
    if (enabled) {
        document.body.classList.add('has-fixed-footer');
    } else {
        document.body.classList.remove('has-fixed-footer');
    }
    // adjust music player bottom if needed (already handled via CSS), but ensure transition is smooth
    const musicPlayer = document.getElementById('musicPlayer');
    if (musicPlayer) {
        musicPlayer.style.transition = 'bottom 0.25s ease';
    }
}

// Automatically enable fixed footer on desktop (>=520px) and disable on smaller screens
document.addEventListener('DOMContentLoaded', function() {
    try {
        // enable fixed footer on larger screens, disable on small screens
        const check = () => {
            const isMobile = window.matchMedia('(max-width: 520px)').matches;
            setFixedFooter(!isMobile);
        };
        check();
        window.addEventListener('resize', check);
    } catch (e) {
        // fallback: enable fixed footer
        setFixedFooter(true);
    }
});

// Profile animations: enable banner shift, avatar hover and username reveal
document.addEventListener('DOMContentLoaded', function(){
    const banner = document.querySelector('.profile-banner');
    const avatar = document.querySelector('.profile-img');
    const username = document.querySelector('.username');
    if (banner) banner.classList.add('animated');
    if (avatar) avatar.classList.add('animated');
    if (username) username.classList.add('animated');

    // clicking avatar pulses it
    if (avatar) {
        avatar.addEventListener('click', () => {
            avatar.classList.remove('pulse');
            // reflow to restart animation
            void avatar.offsetWidth;
            avatar.classList.add('pulse');
        });
    }
});

// Show footer only when user scrolls to the bottom area
function updateFooterVisibility() {
    const footer = document.querySelector('.site-footer');
    if (!footer) return;
    const scrollBottom = window.pageYOffset + window.innerHeight;
    const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    const nearBottom = scrollBottom >= (docHeight - 20); // 20px threshold
    if (nearBottom) {
        footer.classList.add('footer-visible');
    } else {
        footer.classList.remove('footer-visible');
    }
}

window.addEventListener('scroll', updateFooterVisibility, { passive: true });
window.addEventListener('resize', updateFooterVisibility);
// run once on load
document.addEventListener('DOMContentLoaded', updateFooterVisibility);

// Card hover effects
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Music player variables
const bgMusic = document.getElementById('bgMusic');
const playBtn = document.getElementById('playBtn');
const progress = document.getElementById('progress');
const currentTime = document.getElementById('currentTime');
const volumeLevel = document.getElementById('volumeLevel');
const musicPlayer = document.getElementById('musicPlayer');
const musicIcon = document.getElementById('musicIcon');
let isPlaying = false;
let isDraggingVolume = false;

// Set initial volume
bgMusic.volume = 0.1;

// Expand/Collapse Player
function expandPlayer() {
    musicPlayer.classList.remove('collapsed');
    musicPlayer.classList.add('expanded');
}

function collapsePlayer() {
    musicPlayer.classList.remove('expanded');
    musicPlayer.classList.add('collapsed');
}

// Toggle Music Play/Pause
function toggleMusic(e) {
    e.stopPropagation();
    if (isPlaying) {
        bgMusic.pause();
        playBtn.textContent = '▶';
        musicIcon.classList.remove('spinning');
    } else {
        bgMusic.play();
        playBtn.textContent = '❚❚';
        musicIcon.classList.add('spinning');
    }
    isPlaying = !isPlaying;
}

// Auto start spinning on load
bgMusic.addEventListener('play', () => {
    musicIcon.classList.add('spinning');
    playBtn.textContent = '❚❚';
    isPlaying = true;
});

bgMusic.addEventListener('pause', () => {
    musicIcon.classList.remove('spinning');
    playBtn.textContent = '▶';
    isPlaying = false;
});

// Seek functionality
function seek(event) {
    event.stopPropagation();
    const bar = event.currentTarget;
    const percent = event.offsetX / bar.offsetWidth;
    bgMusic.currentTime = percent * bgMusic.duration;
}

// Volume control with drag support
function changeVolume(event) {
    event.stopPropagation();
    const bar = event.currentTarget;
    const rect = bar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    bgMusic.volume = percent;
    volumeLevel.style.width = (percent * 100) + '%';
    document.getElementById('volumeNumber').textContent = Math.round(percent * 100);
}

// Volume dragging functionality
document.querySelector('.volume-bar').addEventListener('mousedown', (e) => {
    isDraggingVolume = true;
    changeVolume(e);
});

document.addEventListener('mousemove', (e) => {
    if (isDraggingVolume) {
        const volumeBar = document.querySelector('.volume-bar');
        const rect = volumeBar.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        bgMusic.volume = percent;
        volumeLevel.style.width = (percent * 100) + '%';
        document.getElementById('volumeNumber').textContent = Math.round(percent * 100);
    }
});

document.addEventListener('mouseup', () => {
    isDraggingVolume = false;
});

// Format time helper
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Update progress bar
bgMusic.addEventListener('timeupdate', () => {
    const percent = (bgMusic.currentTime / bgMusic.duration) * 100;
    progress.style.width = percent + '%';
    currentTime.textContent = formatTime(bgMusic.currentTime);
});

// Set duration when loaded
bgMusic.addEventListener('loadedmetadata', () => {
    // Duration display removed as per design
});