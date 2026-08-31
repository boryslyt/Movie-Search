let inputSearch = document.querySelector(".header-search");
let searchButton = document.querySelector(".searchButton");
let results = document.querySelector(".results");

searchButton.addEventListener("click", function() {
    let searchmovie = inputSearch.value.trim();
    if (searchmovie === "") {
        results.innerHTML = "";
        let enterError = document.createElement("p");
        enterError.textContent = "Enter a movie title";
        results.append(enterError);
    return;
    }
    fetch(`https://www.omdbapi.com/?s=${searchmovie}&apikey=APIKEY`)
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
                card.append(errorMessage);
            };
            card.append(poster);
            }


            let title = document.createElement("p");
            title.classList.add("movieTitle");
            card.append(title);
            title.textContent = movie.Title;


            let year = document.createElement("p");
            year.classList.add("movieYear");
            card.append(year);
            year.textContent = movie.Year;

        })
        });
})

inputSearch.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchButton.click();
    }
});
