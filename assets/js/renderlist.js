function renderList() {
  document.getElementById("loader").style.display = "block";
  const container = document.getElementById("itembox");
  
  fetch('assets/data/index.json')
      .then(response => response.json())
      .then(data => {
          data.sort((a, b) => (a.name > b.name) ? 1 : -1);
          container.innerHTML = '';
          data.forEach(item => {
              const listItem = document.createElement("a")
              listItem.classList.add("griditem")
              listItem.href = item.url
              listItem.innerHTML = `
              <div class="card_margin">
                <div class="col zoom-effect">
                    <img src="${item.img}" class="img-fluid grid-img img-hover-shadow" style="border-radius: 1vw;"alt="Image">
                    <p class="text-center listing-text">${item.name}</p>
                </div>
              </div>
              <div class="descBox" id="descBox">
                <p class="descText">${item.desc}</p>
              </div>
              `;
              container.appendChild(listItem);
          });
      })    
      .catch((error) => console.error("Error:", error))
      .finally(() => {
          console.log("");
      });
    // Get all elements with the class 'hover-target'
        const targets = document.getElementsByClassName('grid-img');
        const floatingBox = document.getElementById('descBox');

        // Function to update the floating box position based on mouse position
        function updateFloatingBoxPosition(event) {
            const mouseX = event.clientX;
            const mouseY = event.clientY;
            floatingBox.style.left = `${mouseX + 10}px`;  // 10px offset to avoid overlap
            floatingBox.style.top = `${mouseY + 10}px`;
        }

        // Loop through each target and add event listeners
        for (let i = 0; i < targets.length; i++) {
            const target = targets[i];

            // Show floating box when mouse enters a target
            target.addEventListener('mouseenter', function() {
                floatingBox.style.display = 'box';
                document.addEventListener('mousemove', updateFloatingBoxPosition);
            });

            // Hide floating box when mouse leaves the target
            target.addEventListener('mouseleave', function() {
                floatingBox.style.display = 'none';
                document.removeEventListener('mousemove', updateFloatingBoxPosition);
            });
        }
    document.getElementById("loader").style.display = "none";
}

renderList(); 
