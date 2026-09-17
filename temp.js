const API_KEY = '5cebcce54c91429938b5f673c64cbade';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'; 

const searchBtn = document.getElementById('searchBtn');
const movieInput = document.getElementById('movieInput');
const movieGrid = document.getElementById('movieGrid');
const resultTitle = document.getElementById('resultTitle'); 

const movieModal = document.getElementById('movieModal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const modalOverview = document.getElementById('modalOverview');
const trailerContainer = document.getElementById('trailerContainer'); 

searchBtn.addEventListener('click', handleSearch); 

closeModal.addEventListener('click', hideModal);
movieModal.addEventListener('click', (e) => {
  if (e.target === movieModal) hideModal();
}); 

async function handleSearch() {
  const query = movieInput.value.trim();
  if (!query) return; 

  movieGrid.innerHTML = '<p style="text-align:center; width:100%;">Gazing into the void...</p>'; 

  try {
    const searchRes = await fetch(BASE_URL + "/search/movie?api_key=" + API_KEY + "&query=" + encodeURIComponent(query));
    const searchData = await searchRes.json(); 

    if (!searchData.results || searchData.results.length === 0) {
      movieGrid.innerHTML = '<p style="text-align:center; width:100%;">No spirits responded. Try another query.</p>';
      return;
    }
    
    displayResults("Search Results", searchData.results);
  } catch (error) {
    console.error("Search error:", error);
    movieGrid.innerHTML = '<p style="text-align:center; width:100%;">The abyss is silent right now. Try again later.</p>';
  }
} 

function displayResults(sourceTitle, recommendations) {
  movieGrid.innerHTML = '';
  resultTitle.classList.remove('hidden'); 

  if (!recommendations || recommendations.length === 0) {
    movieGrid.innerHTML = '<p style="text-align:center; width:100%;">No further visions found in the abyss.</p>';
    return;
  } 

  recommendations.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card'); 

    let posterPath = "";
    if (movie.poster_path) {
      posterPath = IMAGE_BASE_URL + movie.poster_path;
    } 

    movieCard.innerHTML = "<img src='" + posterPath + "' alt='" + movie.title + "' /><h3>" + movie.title + "</h3>";
    
    // Make sure clicking the card opens the modal!
    movieCard.addEventListener('click', () => openModal(movie));
    
    movieGrid.appendChild(movieCard);
  });
} 

async function openModal(movie) {
  // Fill the modal with the movie's info
  modalTitle.textContent = movie.title;
  
  if (modalOverview) {
    modalOverview.textContent = movie.overview || "No dark lore available for this film.";
  }
  
  trailerContainer.innerHTML = '<p>Summoning trailer...</p>';
  movieModal.classList.remove('hidden'); // Show the pop-up 

  try {
    // Fetch the video data for this specific movie
    const videoRes = await fetch(BASE_URL + "/movie/" + movie.id + "/videos?api_key=" + API_KEY);
    const videoData = await videoRes.json();
    
    // Find the first official YouTube trailer
    const trailer = videoData.results.find(vid => vid.site === 'YouTube' && vid.type === 'Trailer');
    
    if (trailer) {
      // Build the YouTube player
      trailerContainer.innerHTML = "<iframe width='100%' height='315' src='https://www.youtube.com/embed/" + trailer.key + "' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>";
    } else {
      trailerContainer.innerHTML = "<p>No trailer found in the abyss.</p>";
    }
  } catch (error) {
    console.error("Trailer error:", error);
    trailerContainer.innerHTML = "<p>Failed to summon the trailer.</p>";
  }
} 

function hideModal() {
  if (movieModal) {
    movieModal.classList.add('hidden');
    // Clear the video container so it stops playing when closed
    trailerContainer.innerHTML = '';
  }
}
