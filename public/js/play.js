const music = document.querySelector("audio");
const playBtn = document.querySelector("#play");
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");

const songs = [
  {
    name: "jacinto-1",
  },
  {
    name: "jacinto-2",
  },
  {
    name: "jacinto-3",
  },
  {
    name: "metric-1",
  },
];


let isPlaying = false;

function playSong() {
  isPlaying = true;
  playBtn.classList.replace("fa-play", "fa-pause");
  playBtn.setAttribute("title", "Pause");
  music.play();
}

function pauseSong() {
  isPlaying = false;
  playBtn.classList.replace("fa-pause", "fa-play");
  playBtn.setAttribute("title", "Play");
  music.pause();
}


function loadSong(song) {
  music.src = `music/${song.name}.mp3`;
}

let songIndex = 0;

function PrevSong(){
    songIndex --;
    if(songIndex < 0){
        songIndex = songs.length -1
    };
    loadSong(songs[songIndex]);
    playSong();
};

function NextSong(){
    songIndex ++;
    if(songIndex > songs.length-1){
        songIndex = 0
    };
    loadSong(songs[songIndex]);
    playSong();
};

playBtn.addEventListener("click", () => (isPlaying ? pauseSong() : playSong()));
prevBtn.addEventListener("click", PrevSong);
nextBtn.addEventListener("click", NextSong);


//Handling the progress bar
const Progress_container = document.querySelector("#progress-container");
const Progress = document.querySelector("#progress");

const currentTimeEl = document.querySelector("#current-time");
const durationEl = document.querySelector("#duration");


function updateProgressBar(e){
      const {duration, currentTime} = e.srcElement;
      const progressPercent = (currentTime/duration)*100;
      Progress.style.width = `${progressPercent}%`;

      //display duration
      const DurationMinutes = Math.floor(duration/60);
      const DurationSeconds = String(Math.floor(duration % 60)).padStart(2,"0");
      if (duration){
        durationEl.textContent = `${DurationMinutes}:${DurationSeconds}`;
      }

      //display currentTime
      const CurrentMinutes = Math.floor(currentTime / 60);
      const CurrentSeconds = String(Math.floor(currentTime % 60)).padStart(2, "0");
      if (currentTime) {
        currentTimeEl.textContent = `${CurrentMinutes}:${CurrentSeconds}`;
      }

}

function setProgressBar(e){
    const TotalWidth = this.clientWidth;
    const clickX = e.offsetX;
    const { duration } = music;
    music.currentTime = (clickX / TotalWidth) * duration;
}

music.addEventListener("timeupdate", updateProgressBar);
Progress_container.addEventListener("click", setProgressBar);
music.addEventListener("ended", NextSong);