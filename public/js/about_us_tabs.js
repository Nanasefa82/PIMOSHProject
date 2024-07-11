// tabs.js
//used in about_us.ejs file

document.addEventListener('DOMContentLoaded', function() {
    // Add a click event handler to the tab links
    document.querySelectorAll('.about_us_tab').forEach(tabLink => {
        tabLink.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default behavior (e.g., navigating to a new page)

            // Remove the 'active' class from all tab links
            document.querySelectorAll('.about_us_tab').forEach(link => {
                link.classList.remove('active');
            });

            // Add the 'active' class to the clicked tab link
            this.classList.add('active');

            // Hide all tab panes
            document.querySelectorAll('.content-text').forEach(tabPane => {
                tabPane.classList.remove('show', 'active');
            });

            // Show the corresponding tab pane
            const target = this.getAttribute('href');
            document.querySelector(target).classList.add('show', 'active');
        });
    });
});