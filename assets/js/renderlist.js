function renderList() {
    document.getElementById("loader").style.display = "block";
    const container = document.getElementById("itembox");

    fetch('assets/data/index.json')
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => (a.name > b.name) ? 1 : -1);
            container.innerHTML = ''; // Clear the container before appending items

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
                </div>
                <div class="descBox" style="display: none; position: absolute;">
                  <p class="descText">${item.desc}</p>
                </div>
                `;

                // Add hover functionality for the `descBox`
                const imgElement = listItem.querySelector('.grid-img');
                const descBox = listItem.querySelector('.descBox');

                imgElement.addEventListener('mouseenter', (event) => {
                    descBox.style.display = 'block';
                });

                imgElement.addEventListener('mousemove', (event) => {
                    const parentRect = container.getBoundingClientRect();
                    const mouseX = event.clientX - parentRect.left + container.scrollLeft;
                    const mouseY = event.clientY - parentRect.top + container.scrollTop;

                    descBox.style.left = `${mouseX + 310}px`;
                    descBox.style.top = `${mouseY + 10}px`;
                });

                imgElement.addEventListener('mouseleave', () => {
                    descBox.style.display = 'none';
                });

                container.appendChild(listItem);
            });
        })
        .catch(error => console.error("Error:", error))
        .finally(() => {
            document.getElementById("loader").style.display = "none";
        });
}

renderList();
