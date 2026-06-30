document.addEventListener('DOMContentLoaded', () => {
    const seriesForm = document.getElementById('seriesForm');
    const catalogTableBody = document.getElementById('catalogTableBody');
    const catalogSearch = document.getElementById('catalogSearch');
    const filterTabs = document.getElementById('filterTabs');
    
    const updateModal = document.getElementById('updateModal');
    const modalUpdateForm = document.getElementById('modalUpdateForm');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalTargetId = document.getElementById('modalTargetId');

    let activeGenreFilter = 'All';

    let seriesCollection = [
        { id: "ACT-01", name: "Breaking Bad", category: "Action", age: "18+", episodes: 62 },
        { id: "ACT-02", name: "Better Call Saul", category: "Action", age: "18+", episodes: 63 },
        { id: "ACT-03", name: "Stranger Things", category: "Action", age: "16+", episodes: 42 },
        { id: "ACT-04", name: "The Boys", category: "Action", age: "18+", episodes: 32 },
        { id: "ACT-05", name: "The Mandalorian", category: "Action", age: "13+", episodes: 24 },

        { id: "ANI-01", name: "Arcane", category: "Animation", age: "16+", episodes: 18 },
        { id: "ANI-02", name: "Rick and Morty", category: "Animation", age: "16+", episodes: 71 },
        { id: "ANI-03", name: "Avatar: The Last Airbender", category: "Animation", age: "All", episodes: 61 },
        { id: "ANI-04", name: "Demon Slayer", category: "Animation", age: "16+", episodes: 55 },
        { id: "ANI-05", name: "Invincible", category: "Animation", age: "18+", episodes: 16 },

        { id: "COM-01", name: "The Office", category: "Comedy", age: "PG", episodes: 201 },
        { id: "COM-02", name: "Friends", category: "Comedy", age: "13+", episodes: 236 },
        { id: "COM-03", name: "Brooklyn Nine-Nine", category: "Comedy", age: "PG", episodes: 153 },
        { id: "COM-04", name: "The Big Bang Theory", category: "Comedy", age: "PG", episodes: 279 },
        { id: "COM-05", name: "Modern Family", category: "Comedy", age: "PG", episodes: 250 }
    ];

    function renderCatalog() {
        catalogTableBody.innerHTML = '';
        
        let totalEpisodes = 0;
        let matureCount = 0;
        const searchQuery = catalogSearch.value.toLowerCase().trim();

        seriesCollection.forEach((series, index) => {
            if (activeGenreFilter !== 'All' && series.category !== activeGenreFilter) {
                return;
            }

            if (searchQuery && 
                !series.id.toLowerCase().includes(searchQuery) && 
                !series.name.toLowerCase().includes(searchQuery)) {
                return;
            }

            totalEpisodes += series.episodes;
            if (series.age === '16+' || series.age === '18+') {
                matureCount++;
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="font-family: monospace; font-weight: 700; color: var(--text-main);">${series.id}</td>
                <td style="font-weight: 600;">${series.name}</td>
                <td><span class="tag-badge genre-badge">${series.category}</span></td>
                <td><span class="tag-badge">${series.age}</span></td>
                <td><strong>${series.episodes}</strong> eps</td>
                <td style="text-align: right;">
                    <button class="control-btn edit-action" data-index="${index}">Edit</button>
                    <button class="control-btn delete-action" data-index="${index}">Delete</button>
                </td>
            `;
            catalogTableBody.appendChild(row);
        });

        document.getElementById('stat-total-shows').textContent = seriesCollection.length;
        document.getElementById('stat-total-episodes').textContent = totalEpisodes.toLocaleString();
        document.getElementById('stat-mature-shows').textContent = matureCount;
    }

    seriesForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = document.getElementById('seriesId').value.trim().toUpperCase();
        const name = document.getElementById('seriesName').value.trim();
        const category = document.getElementById('seriesCategory').value;
        const age = document.getElementById('seriesAge').value;
        const episodes = parseInt(document.getElementById('seriesEpisodes').value);

        if (seriesCollection.some(item => item.id === id)) {
            alert(`This Show ID is already being used. Please try a different one.`);
            return;
        }

        seriesCollection.push({ id, name, category, age, episodes });
        
        seriesForm.reset();
        renderCatalog();
    });

    catalogTableBody.addEventListener('click', (e) => {
        const target = e.target;
        const targetIndexAttr = target.getAttribute('data-index');
        
        if (targetIndexAttr === null) return;

        const index = parseInt(targetIndexAttr);
        const activeSeries = seriesCollection[index];

        if (target.classList.contains('delete-action')) {
            const confirmPurge = confirm(`Are you sure you want to permanently delete "${activeSeries.name}" (${activeSeries.id}) from your library?`);
            if (confirmPurge) {
                seriesCollection.splice(index, 1);
                renderCatalog();
            }
        }

        if (target.classList.contains('edit-action')) {
            document.getElementById('editIndex').value = index;
            modalTargetId.textContent = activeSeries.id;
            document.getElementById('editName').value = activeSeries.name;
            document.getElementById('editCategory').value = activeSeries.category;
            document.getElementById('editAge').value = activeSeries.age;
            document.getElementById('editEpisodes').value = activeSeries.episodes;
            
            updateModal.classList.remove('hidden');
        }
    });

    modalUpdateForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const index = parseInt(document.getElementById('editIndex').value);
        
        seriesCollection[index].name = document.getElementById('editName').value.trim();
        seriesCollection[index].category = document.getElementById('editCategory').value;
        seriesCollection[index].age = document.getElementById('editAge').value;
        seriesCollection[index].episodes = parseInt(document.getElementById('editEpisodes').value);

        updateModal.classList.add('hidden');
        renderCatalog();
    });

    filterTabs.addEventListener('click', (e) => {
        if (!e.target.classList.contains('tab-btn')) return;

        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        
        e.target.classList.add('active');
        activeGenreFilter = e.target.getAttribute('data-filter');
        
        renderCatalog();
    });

    catalogSearch.addEventListener('input', renderCatalog);
    closeModalBtn.addEventListener('click', () => updateModal.classList.add('hidden'));

    renderCatalog();
});