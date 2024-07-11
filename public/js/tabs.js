document.addEventListener('DOMContentLoaded', function() {
    // Add a click event handler to the profile tab links only
    document.querySelectorAll('#myTab .nav-link').forEach(tabLink => {
        tabLink.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default behavior (e.g., navigating to a new page)

            // Remove the 'active' class from all tab links in the profile section
            document.querySelectorAll('#myTab .nav-link').forEach(link => {
                link.classList.remove('active');
            });

            // Add the 'active' class to the clicked tab link
            this.classList.add('active');

            // Hide all tab panes in the profile section
            document.querySelectorAll('#myTabContent .tab-pane').forEach(tabPane => {
                tabPane.classList.remove('show', 'active');
            });

            // Show the corresponding tab pane
            const target = this.getAttribute('href');
            document.querySelector(target).classList.add('show', 'active');
        });
    });
});
