document.addEventListener('DOMContentLoaded', function() {
    // Get references to sidebar links, content sections, and default message
    const defaultMessage = document.getElementById('default-message');
    const content = document.querySelector('main.content');

    /**
     * Displays a specific policy section based on its ID and highlights the corresponding link.
     * Hides all other policy sections. Shows default message if ID is invalid or null.
     * @param {string|null} policyId - The ID of the policy section to display (without '#''), or null to show default.
     */
    function displayPolicy(policyId) {
        if (policyId) {
            fetch(`/policies/${policyId}-policy.html`)
                .then(response => response.text())
                .then(data => {
                    content.innerHTML = data;
                })
                .catch(error => {
                    console.error('Error fetching policy:', error);
                    content.innerHTML = '<p>Failed to load policy.</p>';
                });
        } else {
            content.innerHTML = `
                <h2>Welcome</h2>
                <p>Please select an application from the sidebar menu to view its specific Privacy Policy.</p>
            `;
        }
    }

    /**
     * Handles clicks on the sidebar links.
     * Prevents default navigation, updates URL hash, and displays the selected policy.
     * @param {Event} event - The click event object.
     */
    function handleLinkClick(event) {
        const link = event.currentTarget; // Get the clicked link element
        const targetPolicyId = link.getAttribute('href').substring(1); // Get ID from href (remove '#')

        // Manually update the URL hash without causing a page jump/scroll
        if (window.history.pushState) {
            // Use pushState to change the hash without triggering hashchange immediately (smoother)
            window.history.pushState(null, '', '#' + targetPolicyId);
        } else {
            // Fallback for older browsers
            window.location.hash = '#' + targetPolicyId;
        }


        // Display the clicked policy section
        displayPolicy(targetPolicyId);
    }

    /**
     * Reads the current URL hash and displays the corresponding policy.
     * Called on initial load and when the hash changes (e.g., back/forward buttons).
     */
    function handleHashChange() {
        const currentHash = window.location.hash.substring(1); // Get hash without '#'
        displayPolicy(currentHash); // Display policy based on hash, or default if hash is empty/invalid
    }

    // Listen for changes in the URL hash (e.g., browser back/forward buttons)
    window.addEventListener('hashchange', handleHashChange);

    // Call handleHashChange on initial page load to show the correct policy if a hash is present
    handleHashChange();

});
