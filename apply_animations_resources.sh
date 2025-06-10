#!/bin/bash

TARGET_HTML_FILE="resources.html"

echo "--- Applying animations to ${TARGET_HTML_FILE} ---"
cp "${TARGET_HTML_FILE}" "${TARGET_HTML_FILE}.anim.bak"

# Patch 1: Page Header Animations
echo "Applying Patch 1 (Page Header)"
cat <<EOF | replace_with_git_merge_diff
${TARGET_HTML_FILE}
<<<<<<< SEARCH
<section class="page-header py-16 bg-neutral-lightest">
            <div class="container">
                <h1 class="elegant-heading text-4xl md:text-5xl">Legal Resources</h1>
                <p class="lead">Guides, checklists, and information to help you navigate legal matters with confidence.</p>
=======
<section class="page-header py-16 bg-neutral-lightest fade-in">
            <div class="container">
                <h1 class="elegant-heading text-4xl md:text-5xl fade-in slide-down">Legal Resources</h1>
                <p class="lead fade-in slide-down delay-1">Guides, checklists, and information to help you navigate legal matters with confidence.</p>
>>>>>>> REPLACE
EOF

# Patch 2: Resource Filtering System Animations
echo "Applying Patch 2 (Resource Filters)"
cat <<EOF | replace_with_git_merge_diff
${TARGET_HTML_FILE}
<<<<<<< SEARCH
<section class="resource-filters py-16 bg-white">
            <div class="container">
                <div class="category-tabs">
                    <button class="category-tab btn btn-sm btn-primary mr-2 mb-2 active" data-category="all">All Resources</button>
                    <button class="category-tab btn btn-sm btn-outline-secondary mr-2 mb-2" data-category="guides">Guides & Handbooks</button>
                    <button class="category-tab btn btn-sm btn-outline-secondary mr-2 mb-2" data-category="faq">FAQs</button>
                </div>
                <div class="search-bar">
                    <input type="text" class="form-control w-full md:w-1/2" id="search-input" placeholder="Search resources...">
                </div>
=======
<section class="resource-filters py-16 bg-white fade-in">
            <div class="container">
                <div class="category-tabs fade-in delay-1">
                    <button class="category-tab btn btn-sm btn-primary mr-2 mb-2 active" data-category="all">All Resources</button>
                    <button class="category-tab btn btn-sm btn-outline-secondary mr-2 mb-2" data-category="guides">Guides & Handbooks</button>
                    <button class="category-tab btn btn-sm btn-outline-secondary mr-2 mb-2" data-category="faq">FAQs</button>
                </div>
                <div class="search-bar fade-in delay-1">
                    <input type="text" class="form-control w-full md:w-1/2" id="search-input" placeholder="Search resources...">
                </div>
>>>>>>> REPLACE
EOF

# Patch 3: Resources Section (section itself and the example card)
# Note: The example card is commented out in the actual resources.html.
# The script will attempt this patch, but it might not find the exact match if the card is indeed commented.
# The main goal here is to animate the section container.
# The actual resource cards are dynamically loaded by JS and would need JS-driven animation.
echo "Applying Patch 3 (Resources Section and example card if present)"
cat <<EOF | replace_with_git_merge_diff
${TARGET_HTML_FILE}
<<<<<<< SEARCH
<section class="resources-section py-16 bg-neutral-lightest">
            <div class="container">
                <div class="resource-grid" id="resource-grid">
                    <!-- Resources will be dynamically loaded here -->
                    <div class="card resource-card p-6 rounded-lg shadow-md flex flex-col md:flex-row items-start gap-4 mb-6" data-categories="guides">
=======
<section class="resources-section py-16 bg-neutral-lightest fade-in">
            <div class="container">
                <div class="resource-grid" id="resource-grid">
                    <!-- Resources will be dynamically loaded here -->
                    <div class="card resource-card p-6 rounded-lg shadow-md flex flex-col md:flex-row items-start gap-4 mb-6 fade-in slide-up delay-1" data-categories="guides">
>>>>>>> REPLACE
EOF

# Patch 4: External Legal Links Section
echo "Applying Patch 4 (External Legal Links Section - first card)"
cat <<EOF | replace_with_git_merge_diff
${TARGET_HTML_FILE}
<<<<<<< SEARCH
<section class="legal-links-section py-16 bg-white">
            <div class="container">
                <h2 class="elegant-heading text-3xl centered mb-8">External Legal Resources</h2>
                <div class="legal-links-grid">
                    <div class="card legal-link-card p-6 rounded-lg shadow-md">
=======
<section class="legal-links-section py-16 bg-white fade-in">
            <div class="container">
                <h2 class="elegant-heading text-3xl centered mb-8 fade-in delay-1">External Legal Resources</h2>
                <div class="legal-links-grid">
                    <div class="card legal-link-card p-6 rounded-lg shadow-md fade-in slide-up delay-1">
>>>>>>> REPLACE
EOF

# Awk script to animate the rest of the legal-link-cards
echo "Applying animations to remaining legal-link-cards via awk."
awk '
    function add_classes(line, new_cls_str) {
        current_classes = ""; has_class_attr = 0; attr_start_pos = 0; attr_len = 0;
        if (match(line, /class="([^"]*)"/)) { current_classes = substr(line, RSTART + 7, RLENGTH - 8); has_class_attr = 1; attr_start_pos = RSTART; attr_len = RLENGTH; } else if (match(line, /<[^ >]+/)) { attr_start_pos = RSTART + RLENGTH; }
        split(new_cls_str, classes_to_add, " "); for (i in classes_to_add) { cls = classes_to_add[i]; if ((" " current_classes " ") !~ (" " cls " ")) { if (current_classes == "") { current_classes = cls; } else { current_classes = current_classes " " cls; } } }
        if (has_class_attr) { line = substr(line, 1, attr_start_pos + 6) current_classes substr(line, attr_start_pos + attr_len -1); } else if (attr_start_pos > 0) { line = substr(line, 1, attr_start_pos) " class=\"" current_classes "\"" substr(line, attr_start_pos + 1); } return line;
    }
    BEGIN {
        in_legal_links_section = 0;
        in_legal_links_grid = 0;
        legal_card_delay = 1; # Start delay from 1, first card handled by patch
    }

    /class="legal-links-section/ { in_legal_links_section = 1; }
    in_legal_links_section && /class="legal-links-grid"/ { in_legal_links_grid = 1; legal_card_delay = 1; } # Reset for each grid

    in_legal_links_grid && /class="card legal-link-card/ {
        # Skip if already animated by patch (which handles the first card with delay-1)
        if (!($0 ~ "delay-1")) {
            legal_card_delay++; # Increment for second card onwards
            # Cycle delays if necessary, e.g., 2, 3, then back to 1 or continue
            if (legal_card_delay > 3) { legal_card_delay = 1;} # Example: cycle 1-3
            anim_class = "fade-in slide-up delay-" legal_card_delay;
            $0 = add_classes($0, anim_class);
        }
    }
    # More robust exit conditions
    in_legal_links_grid && /<\/div>\s*<\/section>/ { # Assuming grid is directly followed by section end
        in_legal_links_grid = 0;
        in_legal_links_section = 0;
    }
    in_legal_links_section && /<\/section>/ { in_legal_links_section = 0; in_legal_links_grid = 0; } # Fallback end of section

    prev_line = $0; # Not actively used here but good practice
    {print}
' "${TARGET_HTML_FILE}" > temp_resources.html && mv temp_resources.html "${TARGET_HTML_FILE}"


# Patch 5: CTA Section Animations
echo "Applying Patch 5 (CTA Section)"
cat <<EOF | replace_with_git_merge_diff
${TARGET_HTML_FILE}
<<<<<<< SEARCH
<section class="cta-section py-16 bg-primary-dark text-white">
            <div class="container">
                <div class="cta-content">
                    <h2 class="elegant-heading text-3xl centered mb-4">Need Personalized Legal Guidance?</h2>
                    <p>Our team is available to answer your questions and provide tailored legal advice for your specific situation.</p>
                    <div class="cta-buttons">
                        <a href="/contact.html" class="btn btn-primary">Contact Our Team</a>
                        <a href="/practice-areas.html" class="btn btn-secondary">Explore Our Services</a>
                    </div>
                </div>
            </div>
        </section>
=======
<section class="cta-section py-16 bg-primary-dark text-white fade-in">
            <div class="container">
                <div class="cta-content">
                    <h2 class="elegant-heading text-3xl centered mb-4 fade-in delay-1">Need Personalized Legal Guidance?</h2>
                    <p class="fade-in delay-2">Our team is available to answer your questions and provide tailored legal advice for your specific situation.</p>
                    <div class="cta-buttons">
                        <a href="/contact.html" class="btn btn-primary fade-in delay-3 pulse">Contact Our Team</a>
                        <a href="/practice-areas.html" class="btn btn-secondary fade-in delay-3">Explore Our Services</a>
                    </div>
                </div>
            </div>
        </section>
>>>>>>> REPLACE
EOF

echo "Animations applied to ${TARGET_HTML_FILE}."
echo "--- Verifying some animations in ${TARGET_HTML_FILE} ---"
grep --color=always 'page-header.*fade-in' "${TARGET_HTML_FILE}"
grep --color=always 'resource-card.*slide-up' "${TARGET_HTML_FILE}" || echo "NOTE: Example resource-card might be commented out or not present."
grep --color=always 'legal-link-card.*slide-up' "${TARGET_HTML_FILE}"
grep --color=always 'cta-section.*fade-in' "${TARGET_HTML_FILE}"
grep --color=always 'btn-primary.*pulse' "${TARGET_HTML_FILE}"

# cp "${TARGET_HTML_FILE}.anim.bak" "${TARGET_HTML_FILE}" # Restore if needed
echo "--- Finished animation pass for ${TARGET_HTML_FILE} ---"
