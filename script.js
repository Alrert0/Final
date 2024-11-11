document.addEventListener("DOMContentLoaded", function() {
    var articlesSection = document.getElementById("articles-section");
    var themeToggleBtn = document.getElementById("theme-toggle");
    var sortPopularBtn = document.getElementById("sort-popular");
    var sortDateBtn = document.getElementById("sort-date");
    var modalContent = document.getElementById("modalContent");
    var articlesData = [];

    function fetchArticles() {
        articlesSection.innerHTML = "<p>Loading articles...</p>";
        fetch("articles.json")
            .then(function(response) { return response.json(); })
            .then(function(data) {
                articlesData = data.articles;
                renderArticles(articlesData);
            })
            .catch(function() {
                articlesSection.innerHTML = "<p>Failed to load articles. Try again later.</p>";
            });
    }

    function renderArticles(articles) {
        articlesSection.innerHTML = "";
        
        articles.forEach(function(article) {
            if (!article.title || !article.content) return;

            var articleCard = document.createElement("div");
            articleCard.className = "article-card";

            if (article.imageUrl) {
                var imgContainer = document.createElement("div");
                imgContainer.className = "article-image-container";
                var img = document.createElement("img");
                img.src = article.imageUrl;
                img.alt = article.title;
                img.className = "article-image";
                imgContainer.appendChild(img);
                articleCard.appendChild(imgContainer);
            }

            var title = document.createElement("h3");
            title.className = "headline";
            title.textContent = article.title;

            var date = document.createElement("p");
            date.innerHTML = "<strong>" + article.date + "</strong> - " + Math.ceil(article.wordCount / 200) + " min read";

            var summary = document.createElement("p");
            summary.className = "summary";
            summary.textContent = article.content.substring(0, 100) + "...";

            articleCard.appendChild(title);
            articleCard.appendChild(date);
            articleCard.appendChild(summary);

            articleCard.addEventListener("click", function() {
                loadModalContent(article.title, article.content);
            });

            articlesSection.appendChild(articleCard);
        });
    }

    function loadModalContent(title, content) {
        document.getElementById("infoModalLabel").innerText = title || "Untitled Article";
        modalContent.innerHTML = "<p>" + (content || "No content available.") + "</p>";
        $('#infoModal').modal('show');
    }

    function toggleTheme() {
        var isDark = document.body.classList.contains("dark-mode");
        document.body.classList.toggle("dark-mode", !isDark);
        document.body.classList.toggle("light-mode", isDark);
        localStorage.setItem("theme", isDark ? "light-mode" : "dark-mode");
        themeToggleBtn.textContent = isDark ? "Dark Mode" : "Light Mode";
    }

    function sortArticles(criteria) {
        var sortedArticles = articlesData.slice().sort(function(a, b) {
            return criteria === "views" ? b.views - a.views : new Date(b.date) - new Date(a.date);
        });
        renderArticles(sortedArticles);
    }

    window.filterByCategory = function(category) {
        renderArticles(articlesData.filter(function(article) {
            return article.category === category;
        }));
    };

    window.showAllArticles = function() {
        renderArticles(articlesData);
    };

    themeToggleBtn.addEventListener("click", toggleTheme);
    sortPopularBtn.addEventListener("click", function() { sortArticles("views"); });
    sortDateBtn.addEventListener("click", function() { sortArticles("date"); });

    document.body.classList.add(localStorage.getItem("theme") || "light-mode");
    themeToggleBtn.textContent = document.body.classList.contains("dark-mode") ? "Light Mode" : "Dark Mode";

    fetchArticles();
});
