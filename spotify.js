let currentSong = new Audio();
let songs;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/Spotify/try.html")
    let response = await a.text()
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")

    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push((element.href.split("/Spotify/Songs/")[1]))
        }
    }
    return songs;
}


async function main() {
    songs = await getSongs()
    console.log(songs)

    let SongUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        SongUL.innerHTML = SongUL.innerHTML + `<li> 
           <img src="svgs/music.svg" alt="Music logo">
           <span> ${song.replaceAll("%20", " ").split(".mp3")[0].split("-")[0]}</span>
           <span> ${song.replaceAll("%20", " ").split(".mp3")[0].split("-")[1]}</span>
           <img src="svgs/pause.svg" alt="play button">
            </li>`
    }
    const playMusicFromIndex = (track) => {
        currentSong.src = "/Spotify/Songs/" + track
        currentSong.play();
        document.querySelector(".song-info").innerHTML = decodeURI(track).split("-")[0]
        document.querySelector(".song-time").innerHTML = "00:00 / 00:00"
    }  
    const playMusic = (track) => {
        let rest = event.currentTarget.getElementsByTagName("span")[1].innerHTML.trim();
        //let audio = new Audio("/Spotify/Songs/"+track +"%20-%20"+rest +".mp3")
        currentSong.src = "/Spotify/Songs/" + track + "%20-%20" + rest + ".mp3"
        currentSong.play();
        play.src = "svgs/play.svg";
        document.querySelector(".song-info").innerHTML = track
        document.querySelector(".song-time").innerHTML = "00:00/00:00"
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", (event) => {
            console.log(e.getElementsByTagName("span")[0].innerHTML)
            playMusic(e.getElementsByTagName("span")[0].innerHTML.trim())
        })
    })

    // Attach play,prev and next event listener
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "svgs/play.svg"
        }
        else {
            currentSong.pause();
            play.src = "svgs/pause.svg"
        }
    })

    // Attach timeupdate event listener
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime,currentSong.duration)
        document.querySelector(".song-time").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 99 + "%";
    })

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

     
    // Add an event listener to previous
    prev.addEventListener("click",()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(currentSong.src.split("/").slice(-1)[0],index)
        if(index-1 >= 0)
        {
            playMusicFromIndex(songs[index-1]);
        }
    })
 
    // Add an event listener to next
    next.addEventListener("click",()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(currentSong.src.split("/").slice(-1)[0],index)
        if((index+1) < songs.length)
        {
            playMusicFromIndex(songs[index+1]);
        }
    })

    // Add an event to volume
    document.querySelector(".vol-range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume === 0) {
            document.querySelector(".volume").getElementsByTagName("img")[0].src = "svgs/mute.svg";
        } else {
            document.querySelector(".volume").getElementsByTagName("img")[0].src = "svgs/volume.svg";
        }
    })

      // Add an event to hamburger
      document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0%";
      })

       // Add an event to cancel
       document.querySelector(".cancel").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-100%";
       })

}
main()
