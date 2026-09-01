let favorites = [];
let showingFavorites = false;

let localFavorites = localStorage.getItem("favorites");
favorites = JSON.parse(localFavorites) || [];

let inputSearch = document.querySelector(".header-search");
let searchButton = document.querySelector(".searchButton");
let favoritesButton = document.querySelector(".favoritesButton");
let results = document.querySelector(".results");


function createMovieCard(movie) {
    let card = document.createElement("div");
    card.classList.add("movieCard");
    results.append(card);

    let poster = document.createElement("img");
    if (movie.Poster === "N/A") {
        let errorMessage = document.createElement("p");
        errorMessage.textContent = "No poster available";
        card.append(errorMessage);
    } else {
        poster.src = movie.Poster;
        poster.onerror = function() {
            poster.remove();

        let errorMessage = document.createElement("p");
        errorMessage.textContent = "No poster available";
        card.insertBefore(errorMessage, info);
    };
    card.append(poster);
    }

    let info = document.createElement("div");
    info.classList.add("movieInfo");
    card.append(info);

    let title = document.createElement("p");
    title.classList.add("movieTitle");
    info.append(title);
    title.textContent = movie.Title;


    let year = document.createElement("p");
    year.classList.add("movieYear");
    info.append(year);
    year.textContent = movie.Year;    

    let cardButtons = document.createElement("div");
    cardButtons.classList.add("cardButtons");
    info.append(cardButtons);

    let moreInfo = document.createElement("button");
    moreInfo.classList.add("moreInfoButton");
    moreInfo.textContent = "More Information";
    cardButtons.append(moreInfo);

    moreInfo.addEventListener("click", function() {
    if (details.innerHTML !== "") {
        details.innerHTML = "";
        moreInfo.textContent = "More Information";
    return;
    }
    fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=1ff65e07`)
        .then(function(response) {
            return response.json();
        })
        .then(function(moreData) {
            createMovieDetails(moreData, details);
            moreInfo.textContent = "Less Information";
        });
    });

    let details = document.createElement("div");
    details.classList.add("movieDetails");
    info.append(details);

    let favorite = document.createElement("button");
    favorite.classList.add("cardfavoriteButton");
    let isFavorite = favorites.some(function(item) {
        return item.imdbID === movie.imdbID;
    });

    if (isFavorite === true) {
        favorite.textContent = "♥ Added";
    } else {
        favorite.textContent = "♡ Favorite";
    }
    cardButtons.append(favorite);


    favorite.addEventListener("click", function() {
        let alreadyFavorite = favorites.some(function(item) {
            return item.imdbID === movie.imdbID;
        });

        if (alreadyFavorite === true) {
            favorites = favorites.filter(function(item) {
                return item.imdbID !== movie.imdbID;
        });

        localStorage.setItem("favorites", JSON.stringify(favorites));
        favorite.textContent = "♡ Favorite";

        if (showingFavorites === true) {
            card.remove();
        }
        return;
        }

        favorites.push(movie);
        favorite.textContent = "♥ Added";
        localStorage.setItem("favorites", JSON.stringify(favorites));
        });
    }

searchButton.addEventListener("click", function() {
    let searchmovie = inputSearch.value.trim();
    showingFavorites = false;
    if (searchmovie === "") {
        results.innerHTML = "";
        let enterError = document.createElement("p");
        enterError.textContent = "Enter a movie title";
        results.append(enterError);
    return;
    }
    fetch(`https://www.omdbapi.com/?s=${searchmovie}&apikey=1ff65e07`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            results.innerHTML = "";

        if (data.Response === "False") {
            let notFound = document.createElement("p");
            notFound.textContent = "Nothing found";
            results.append(notFound);
        return;
        }

        data.Search.forEach(function(movie) {
            createMovieCard(movie);
            });
        })
    });

inputSearch.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchButton.click();
    }
});

favoritesButton.addEventListener("click", function() {
    results.innerHTML = "";
    showingFavorites = true;

    if (favorites.length === 0) {
        let favError = document.createElement("p");
        favError.textContent = "No favorite movies yet";
        results.append(favError);
        return;
    }

    favorites.forEach(function(movie) {
        createMovieCard(movie);
    });
});

function createMovieDetails(moreData, details) {
    let genre = document.createElement("p");
    genre.classList.add("genre");
    genre.textContent = "Genre: " + moreData.Genre;
    details.append(genre);

    let Runtime = document.createElement("p");
    Runtime.classList.add("runtime");
    Runtime.textContent = "Runtime: " + moreData.Runtime;
    details.append(Runtime);

    let Director = document.createElement("p");
    Director.classList.add("director");
    Director.textContent = "Director: " + moreData.Director;
    details.append(Director);

    let Actors = document.createElement("p");
    Actors.classList.add("actors");
    Actors.textContent = "Actors: " + moreData.Actors;
    details.append(Actors);

    let IMDbRating = document.createElement("p");
    IMDbRating.classList.add("imdbrating");
    IMDbRating.textContent = "IMDb Rating: " + moreData.imdbRating + "⭐";
    details.append(IMDbRating);

    let Plot = document.createElement("p");
    Plot.classList.add("plot");
    Plot.textContent = "Plot: " + moreData.Plot;
    details.append(Plot);
}
