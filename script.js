const audio = document.getElementById('main-audio');
const playBtn = document.getElementById('play-pause');
const playIcon = document.getElementById('play-icon');
const progressBar = document.getElementById('progress-bar');
const playlistEl = document.getElementById('playlist');

const songs = [
    { title: "Intro III", artist: "NF", src: "song1.mp3", img: "https://via.placeholder.com/400" },
    { title: "Outcast", artist: "NF", src: "song2.mp3", img: "https://via.placeholder.com/401" },
    { title: "10 Feet Down", artist: "NF", src: "song3.mp3", img: "https://via.placeholder.com/402" }
];

let songIndex = 0;
const circumference = 2 * Math.PI * 48; // Matches SVG 'r' value

// Initialize app
function loadSong(index) {
    const song = songs[index];
    document.getElementById('title').innerText = song.title;
    document.getElementById('artist').innerText = song.artist;
    document.getElementById('album-art').src = song.img;
    audio.src = song.src;
    renderPlaylist();
}

function renderPlaylist() {
    playlistEl.innerHTML = '';
    songs.forEach((s, i) => {
        const div = document.createElement('div');
        div.className = `track-row ${i === songIndex ? 'active' : ''}`;
        div.innerHTML = `<span>${s.title}</span> <i class="fas fa-play-circle"></i>`;
        div.onclick = () => { songIndex = i; loadSong(i); playMusic(); };
        playlistEl.appendChild(div);
    });
}

function playMusic() {
    audio.play();
    playIcon.className = 'fas fa-pause';
}

function pauseMusic() {
    audio.pause();
    playIcon.className = 'fas fa-play';
}

playBtn.addEventListener('click', () => {
    const isPlaying = playIcon.classList.contains('fa-pause');
    isPlaying ? pauseMusic() : playMusic();
});

// Update Progress Circle
audio.addEventListener('timeupdate', () => {
    const { duration, currentTime } = audio;
    if (duration) {
        const progressPercent = (currentTime / duration);
        const offset = circumference - (progressPercent * circumference);
        progressBar.style.strokeDashoffset = offset;
    }
});

// Auto Next
audio.addEventListener('ended', () => {
    songIndex = (songIndex + 1) % songs.length;
    loadSong(songIndex);
    playMusic();
});

// Start
loadSong(songIndex);
