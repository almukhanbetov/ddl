function toggleSound(e) {
    e.stopPropagation();

    const video = document.getElementById('instaVideo');
    const btn = e.currentTarget;

    video.muted = !video.muted;

    btn.textContent = video.muted ? '🔇' : '🔊';
}