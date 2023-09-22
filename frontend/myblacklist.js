  document.addEventListener('DOMContentLoaded', () => {
    const blacklistTable = document.getElementById('blacklistTable');
    const blacklistBody = document.getElementById('blacklistBody');

    const savedURLs = localStorage.getItem('blacklistURLs');
    const blacklistURLs = savedURLs ? JSON.parse(savedURLs) : [];

    function updateBlacklist() {
         blacklistBody.innerHTML = '';

        blacklistURLs.forEach((url, index) => {
            const row = document.createElement('tr');
            const urlCell = document.createElement('td');
            urlCell.textContent = url;
            const actionCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('deleteButton');

        
            deleteButton.addEventListener('click', () => {
                
                blacklistURLs.splice(index, 1);
                localStorage.setItem('blacklistURLs', JSON.stringify(blacklistURLs));
                updateBlacklist();
            });

            actionCell.appendChild(deleteButton);
            row.appendChild(urlCell);
            row.appendChild(actionCell);

            blacklistBody.appendChild(row);
        });

        
        if (blacklistURLs.length === 0) {
            const emptyRow = document.createElement('tr');
            const emptyCell = document.createElement('td');
            emptyCell.colSpan = 2;
            emptyCell.textContent = 'No URLs in the blacklist yet.';
            emptyRow.appendChild(emptyCell);
            blacklistBody.appendChild(emptyRow);
        }
    }

    updateBlacklist();
});