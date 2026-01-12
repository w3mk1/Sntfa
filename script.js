const audio = document.getElementById('audio-engine');
const playBtn = document.getElementById('play-pause');
const playIcon = document.getElementById('play-icon');
const progressBar = document.getElementById('progress-bar');
const playlistContainer = document.getElementById('playlist-items');

// 1. App Data
const songs = [
    { title: "Intro III", artist: "NF", file: "song1.mp3", cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=500" },
    { title: "Outcast", artist: "NF", file: "song2.mp3", cover: "https://images.unsplash.com/photo-1459749411177-042180ceea72?w=500" },
    { title: "10 Feet Down", artist: "NF", file: "song3.mp3", cover: "https://images.unsplash.com/photo-1514525253361-bee8a19740c1?w=500" }
];

let currentIndex = 0;
const circumference = 2 * Math.PI * 48;

// 2. Core Functions
function loadTrack(index) {
    const song = songs[index];
    document.getElementById('title').innerText = song.title;
    document.getElementById('artist').innerText = song.artist;
    document.getElementById('album-art').src = song.cover;
    audio.src = song.file;
    
    updatePlaylistUI();
    setupMediaSession(song);
}

function togglePlay() {
    if (audio.paused) {
        audio.play();
        playIcon.className = "fas fa-pause";
    } else {
        audio.pause();
        playIcon.className = "fas fa-play";
    }
}

function updatePlaylistUI() {
    playlistContainer.innerHTML = '';
    songs.forEach((song, i) => {
        const item = document.createElement('div');
        item.className = `track-item ${i === currentIndex ? 'active' : ''}`;
        item.innerHTML = `<span>${song.title}</span><i class="fas fa-play-circle"></i>`;
        item.onclick = () => { currentIndex = i; loadTrack(i); audio.play(); playIcon.className = "fas fa-pause"; };
        playlistContainer.appendChild(item);
    });
}

// 3. Progress Tracking
audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const progress = audio.currentTime / audio.duration;
        const offset = circumference - (progress * circumference);
        progressBar.style.strokeDashoffset = offset;
    }
});

// 4. Lock Screen Controls (Professional Feature)
function setupMediaSession(song) {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: song.title,
            artist: song.artist,
            artwork: [{ src: song.cover, sizes: '512x512', type: 'image/jpeg' }]
        });

        navigator.mediaSession.setActionHandler('play', () => togglePlay());
        navigator.mediaSession.setActionHandler('pause', () => togglePlay());
        navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
        navigator.mediaSession.setActionHandler('previoustrack', () => prevTrack());
    }
}

function nextTrack() {
    currentIndex = (currentIndex + 1) % songs.length;
    loadTrack(currentIndex);
    audio.play();
}

function prevTrack() {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    loadTrack(currentIndex);
    audio.play();
}

// 5. Event Listeners
playBtn.addEventListener('click', togglePlay);
document.getElementById('next').addEventListener('click', nextTrack);
document.getElementById('prev').addEventListener('click', prevTrack);
audio.addEventListener('ended', nextTrack);

// Boot
loadTrack(currentIndex);
