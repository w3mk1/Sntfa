const songs = [
    { title: "Intro III", artist: "NF", src: "path/to/song1.mp3", duration: "4:29" },
    { title: "Outcast", artist: "NF", src: "path/to/song2.mp3", duration: "5:26" },
    { title: "10 Feet Down", artist: "NF", src: "path/to/song3.mp3", duration: "3:37" }
];

let songIndex = 0;
const audio = document.getElementById('audio-player');
const circle = document.querySelector('.progress-ring__circle');
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

// Load song details
function loadSong(song) {
    document.getElementById('current-title').innerText = song.title;
    document.getElementById('current-artist').innerText = song.artist;
    audio.src = song.src;
}

// Update Progress Circle
audio.addEventListener('timeupdate', () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    const offset = circumference - (percent / 100 * circumference);
    circle.style.strokeDashoffset = offset;
});

// Play/Pause Toggle
document.getElementById('play-pause').addEventListener('click', (e) => {
    if (audio.paused) {
        audio.play();
        e.target.innerText = '⏸';
    } else {
        audio.pause();
        e.target.innerText = '▶';
    }
});

// Render Playlist
const playlist = document.getElementById('playlist');
songs.forEach((song, index) => {
    const div = document.createElement('div');
    div.className = `track-item ${index === songIndex ? 'active' : ''}`;
    div.innerHTML = `<span>${song.title}</span><span>${song.duration}</span>`;
    div.onclick = () => {
        songIndex = index;
        loadSong(songs[songIndex]);
        audio.play();
    };
    playlist.appendChild(div);
});

loadSong(songs[songIndex]);
