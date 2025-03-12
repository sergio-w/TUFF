function renderList(sort_type) {
    document.getElementById("loader").style.display = "block";
    let container = null;
    document.getElementById("itembox").textContent = '';
    document.getElementById("category-container").textContent = '';

    if (sort_type === 'category') {
        container = document.getElementById("category-container");
        document.getElementById("SortList").innerHTML = "Sort by - Category";
        localStorage.setItem("sort_type", JSON.stringify(true));
    } else {
        container = document.getElementById("itembox");
        localStorage.setItem("sort_type", JSON.stringify(false));
        document.getElementById("SortList").innerHTML = "Sort by - Alphabetical";
    }

    fetch('assets/data/index.json')
        .then(response => response.json())
        .then(data => {
            if (sort_type === 'category') {
                data.sort((a, b) => a.category.localeCompare(b.category));
            } else {
                data.sort((a, b) => a.name.localeCompare(b.name));
            }

            const categoryMap = {
                "Gym Class": "Platformers & Skill",
                "Pen & Paper": "Logic & Strategy",
                "Recess": "Calm & Relaxing",
                "Science Lab": "Experimentation & Planning",
                "Sports Club": "Racing & Sports",
                "Music Room": "Rhythm & Music",
                "Math Class": "App & Extra"
            };

            container.textContent = '';

            if (sort_type === 'category') {
                Object.entries(categoryMap).forEach(([category, displayName]) => {
                    const categoryText = document.createElement("h3");
                    categoryText.classList.add("white-text", "category-text");
                    categoryText.id = `itembox_${category}-text`;
                    categoryText.innerText = displayName;
                    categoryText.style.textAlign = 'left';
                    container.appendChild(categoryText);

                    const categoryContainer = document.createElement("div");
                    categoryContainer.id = `itembox_${category}`;
                    categoryContainer.style.marginBottom = '20px';
                    categoryContainer.classList.add("row", "row-cols-3", "category-container");
                    container.appendChild(categoryContainer);
                });
            }

            data.forEach((item, index) => {
                const listItem = document.createElement("a");
                listItem.classList.add("griditem");
                listItem.href = item.url;
                listItem.innerHTML = `
                    <div class="card_margin">
                        <div class="col zoom-effect">
                            <img src="${item.img}" class="img-fluid grid-img img-hover-shadow" style="border-radius: 1vw;" alt="Image">
                            <p class="text-center listing-text">${item.name}</p>
                        </div>
                    </div>`;

                const img = listItem.querySelector("img");
                img.loading = "lazy";
                img.fetchPriority = index < 5 ? "high" : "auto";

                if (sort_type === 'category') {
                    const categoryElement = document.getElementById(`itembox_${item.category}`);
                    if (categoryElement) {
                        categoryElement.appendChild(listItem);
                    } else {
                        console.error(`Category container for "${item.category}" not found.`);
                    }
                } else {
                    container.appendChild(listItem);
                }
            });
        })
        .catch(error => console.error("Error:", error))
        .finally(() => {
            document.getElementById("loader").style.display = "none";
        });
}

document.addEventListener('DOMContentLoaded', function () {
    renderList(JSON.parse(localStorage.getItem("sort_type")) ? 'category' : 'name');

    document.getElementById("loader").style.display = "none";

    setTimeout(() => {
        document.body.classList.add("page-ready");
    }, 100);
});
