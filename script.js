document.addEventListener("DOMContentLoaded", function () {
    const songList = document.querySelector(".song-list");

    // Replace these placeholders with your actual song data
    const songs = [
        { title: "Get Got", artist: "Death Grips", src: "Songs/GetGot.mp3" },
        { title: "Song 2", artist: "Artist 2", src: "songs/song2.mp3" },
        // Add more songs here
    ];

    songs.forEach((song) => {
        const songCard = document.createElement("div");
        songCard.classList.add("song-card");
        songCard.innerHTML = `
            <h2>${song.title}</h2>
            <p>${song.artist}</p>
            <audio controls>
                <source src="${song.src}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
        `;
        songList.appendChild(songCard);
    });

    // Fetch the remote version.txt file
    fetch('https://example.com/version.txt')
        .then(response => response.text())
        .then(remoteVersion => {
            const localVersion = '1.0'; // Replace with your installed version
            if (remoteVersion.trim() !== localVersion) {
                alert('A newer version is available. Please update before proceeding.');
                // Optionally, you can prevent further actions or redirect to a download link.
            }
        })
        .catch(error => {
            console.error('Error checking version:', error);
        });

    // Add your other functionality here, such as handling the "Submit via Email" button.
});
