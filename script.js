document.addEventListener('DOMContentLoaded', function() {
    const content = document.querySelector('main.content');

    /**
     * Displays a specific policy section based on its ID.
     * @param {string|null} policyId - The ID of the policy section to display, or null for the default message.
     */
    function displayPolicy(policyId) {
        if (policyId) {
            fetch(`/policies/${policyId}.html`)
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
     * @param {Event} event - The click event object.
     */
    function handleSidebarClick(event) {
        const link = event.target.closest('a');
        if (link) {
            event.preventDefault();
            const href = link.getAttribute('href');

            if (href === 'index.html') {
                window.location.href = 'index.html'; // Full page load for index
                return;
            }

            let targetPolicyId = href && href.startsWith('#') ? href.substring(1) : null;

            if (targetPolicyId) {
                // Update the URL hash
                if (window.history.pushState) {
                    window.history.pushState(null, '', '#' + targetPolicyId);
                } else {
                    window.location.hash = '#' + targetPolicyId;
                }

                displayPolicy(targetPolicyId);
            }
        }
    }

    /**
     * Reads the current URL hash and displays the corresponding policy.
     */
    function handleHashChange() {
        const currentHash = window.location.hash.substring(1);
        displayPolicy(currentHash || null);
    }

    // Attach event listener to the sidebar
    const sidebar = document.querySelector('.sidebar');
    sidebar.addEventListener('click', handleSidebarClick);

    // Listen for changes in the URL hash
    window.addEventListener('hashchange', handleHashChange);

    // Initial load: display policy based on the initial hash, if present
    handleHashChange();
});
