const video = document.getElementById('video');
const subtitleBox = document.getElementById('subtitleBox');
const spanishSubtitles = document.getElementById('spanishSubtitles');

// Cargar subtítulos en español
fetch('videos/español.srt')
    .then(response => response.text())
    .then(text => parseSubtitles(text));

let subtitles = []; // Array para almacenar subtítulos en español
let currentIndex = 0;

// Función para parsear el archivo SRT
function parseSubtitles(text) {
    const subtitleRegex = /\d+\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\n([\s\S]*?)(?=\n\n|\n$)/g;
    let match;
    while ((match = subtitleRegex.exec(text)) !== null) {
        subtitles.push({
            start: timeToSeconds(match[1]),
            end: timeToSeconds(match[2]),
            text: match[3].trim()
        });
    }
}

// Convertir tiempo de SRT a segundos
function timeToSeconds(time) {
    const parts = time.split(/[:,]/);
    return (
        parseInt(parts[0]) * 3600 + 
        parseInt(parts[1]) * 60 + 
        parseInt(parts[2]) + 
        parseInt(parts[3]) / 1000
    );
}

// Escuchar eventos del video para detenerlo en cada nuevo diálogo
video.addEventListener('timeupdate', () => {
    if (currentIndex < subtitles.length) {
        const currentTime = video.currentTime;
        const currentSubtitle = subtitles[currentIndex];

        if (currentTime >= currentSubtitle.start && currentTime < currentSubtitle.end) {
            spanishSubtitles.textContent = currentSubtitle.text;
        }

        if (currentTime >= currentSubtitle.start && currentTime < currentSubtitle.start + 0.1) {
            video.pause();
        }

        if (currentTime >= currentSubtitle.end) {
            currentIndex++;
        }
    }
});

// Reanudar el video al hacer clic en la caja de subtítulos
subtitleBox.addEventListener('click', () => {
    if (video.paused) {
        video.play();
    }
});
