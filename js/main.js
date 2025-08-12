const charContainer = document.querySelector("#character-con");
const lightbox = document.querySelector("#lightbox");
const lightboxContent = document.querySelector("#lightbox-content");
const closeLightbox = document.querySelector("#close-lightbox");
const movieTemplate = document.querySelector("#movie-template");

function getChars() {
    fetch("https://swapi.info/api/people")
        .then(response => response.json())
        .then(data => {
            const ul = document.createElement("ul");
            
            data.slice(0, 10).forEach(person => {
                const li = document.createElement("li");
                const link = document.createElement("a");
                link.textContent = person.name;
                link.dataset.films = JSON.stringify(person.films);
                link.addEventListener("click", getMovies);
                
                li.appendChild(link);
                ul.appendChild(li);
            });
            
            charContainer.appendChild(ul);
        })
        .catch(error => {
            charContainer.innerHTML = "<p>Error loading characters</p>";
            console.log(error);
        });
}

function getMovies(e) {
    const films = JSON.parse(e.target.dataset.films);
    lightbox.style.display = "flex";
    lightboxContent.innerHTML = "<p>Loading...</p>";
    
    Promise.all(films.map(filmUrl => fetch(filmUrl).then(r => r.json())))
        .then(movies => {
            lightboxContent.innerHTML = "";
            
            movies.forEach(movie => {
                const clone = movieTemplate.content.cloneNode(true);
                clone.querySelector(".film_title").textContent = movie.title;
                clone.querySelector(".film_director").textContent = "Director: " + movie.director;
                clone.querySelector(".film_description").textContent = movie.opening_crawl;
                clone.querySelector(".film_images").src = `images/${movie.title}.jpg`;
                
                lightboxContent.appendChild(clone);
            });
        })
        .catch(error => {
            lightboxContent.innerHTML = "<p>Error loading movies</p>";
            console.log(error);
        });
}

closeLightbox.addEventListener("click", () => {
    lightbox.style.display = "none";
});

getChars();