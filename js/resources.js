document.addEventListener('DOMContentLoaded', function() {
    fetchResources();
    initializeSearch();
    initializeFilters();
});

function fetchResources() {
    fetch('https://api.example.com/resources')
        .then(response => response.json())
        .then(data => {
            const resourceGrid = document.getElementById('resource-grid');
            data.forEach(resource => {
                const resourceCard = document.createElement('div');
                resourceCard.classList.add('resource-card');
                resourceCard.setAttribute('data-categories', resource.categories.join(' '));
                resourceCard.innerHTML = `
                    <div class="resource-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="${resource.iconPath}"/></svg>
                    </div>
                    <div class="resource-content">
                        <span class="resource-tag">${resource.type}</span>
                        <h3>${resource.title}</h3>
                        <p>${resource.description}</p>
                        <a href="${resource.link}" class="btn btn-secondary" target="_blank">View Resource</a>
                    </div>
                `;
                resourceGrid.appendChild(resourceCard);
            });
        })
        .catch(error => console.error('Error fetching resources:', error));
}

function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const resourceCards = document.querySelectorAll('.resource-card');
        resourceCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            if (title.includes(query) || description.includes(query)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

function initializeFilters() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const resourceCards = document.querySelectorAll('.resource-card');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const selectedCategory = this.getAttribute('data-category');
            if (selectedCategory === 'all') {
                resourceCards.forEach(card => {
                    card.style.display = 'flex';
                });
                return;
            }
            
            resourceCards.forEach(card => {
                const cardCategories = card.getAttribute('data-categories');
                if (cardCategories && cardCategories.includes(selectedCategory)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}
