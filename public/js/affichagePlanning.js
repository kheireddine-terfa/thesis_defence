document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('.column-toggle');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Utilisation d'une fonction fléchée pour maintenir le contexte
            const columnSelector = `th:nth-child(${parseInt(this.dataset.column) + 1}), td:nth-child(${parseInt(this.dataset.column) + 1})`;
            const columns = document.querySelectorAll(columnSelector);

            columns.forEach(col => {
                // Maintenant 'this' se réfère correctement à l'élément de la case à cocher
                col.style.display = this.checked ? '' : 'none';
            });
        });
    });
});
