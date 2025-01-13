function renderList(sort_type) {
    document.getElementById("loader").style.display = "block";
    let container = null;
    
    console.log(sort_type);
    document.getElementById("itembox").innerHTML = '';
    document.getElementById("category-container").innerHTML = '';
    
    if (sort_type === 'category') {
        container = document.getElementById("category-container");
        document.getElementById("SortList").innerHTML = "Sort by - Category";
        localStorage.setItem("sort_type", 'true');
    } else {
        container = document.getElementById("itembox");
        localStorage.setItem("sort_type", 'false');
        document.getElementById("SortList").innerHTML = "Sort by - Alphabetical";
    }
    
    fetch('assets/data/index.json')
        .then(response => response.json())
        .then(data => {
            if (sort_type === 'category') {
                data.sort((a, b) => (a.category > b.category) ? 1 : -1);
            }
            if (sort_type === 'name') {
                data.sort((a, b) => (a.name > b.name) ? 1 : -1);
            }
            
            const categories = [
                "Gym Class",
                "Pen & Paper",
                "Recess",
                "Science Lab",
                "Sports Club",
                "Music Room",
                "Math Class"
            ];
            const realCategories = [
                "Platformers & Skill",
                "Logic & Strategy",
                "Calm & Relaxing",
                "Experimentation & Planning",
                "Racing & Sports",
                "Rhythm & Music",
                "App & Extra"
            ];
            
            container.innerHTML = '';
            
            if (sort_type === 'category') {
                for (const category of categories) {
                    const categoryText = document.createElement("h3");
                    categoryText.classList.add("white-text", "category-text");
                    categoryText.id = "itembox_" + category + "-text";
                    categoryText.innerText = realCategories[categories.indexOf(category)];
                    categoryText.style.textAlign = 'left';
                    container.appendChild(categoryText);

                    const categoryContainer = document.createElement("div");
                    categoryContainer.id = "itembox_" + category;
                    console.log("itembox_" + category);
                    categoryContainer.style.marginBottom = '20px';
                    categoryContainer.classList.add("row", "row-cols-3", "category-container");
                    container.appendChild(categoryContainer);
                }
            }
            
            data.forEach(item => {
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

                if (sort_type === 'category') {
                    const categoryElement = document.getElementById("itembox_" + item.category);
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
    if (localStorage.getItem("sort_type") === 'true') {
        renderList('category');
    } else {
        renderList('name');
    }
});