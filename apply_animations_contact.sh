#!/bin/bash

TARGET_HTML_FILE="contact.html"

echo "--- Applying animations to ${TARGET_HTML_FILE} ---"
cp "${TARGET_HTML_FILE}" "${TARGET_HTML_FILE}.anim.bak"

# Patch 1: Page Header Animations
echo "Applying Patch 1 (Page Header)"
cat <<EOF | replace_with_git_merge_diff
${TARGET_HTML_FILE}
<<<<<<< SEARCH
<section class="page-header py-16 bg-neutral-lightest">
            <div class="container">
                <h1 class="elegant-heading centered text-4xl md:text-5xl">Contact Us</h1>
                <p class="lead">Get in touch with our team to discuss how we can help with your legal needs.</p>
=======
<section class="page-header py-16 bg-neutral-lightest fade-in">
            <div class="container">
                <h1 class="elegant-heading centered text-4xl md:text-5xl fade-in slide-down">Contact Us</h1>
                <p class="lead fade-in slide-down delay-1">Get in touch with our team to discuss how we can help with your legal needs.</p>
>>>>>>> REPLACE
EOF

# Patch 2: Contact Section (Form and Info Card)
echo "Applying Patch 2 (Contact Section - main content div)"
cat <<EOF | replace_with_git_merge_diff
${TARGET_HTML_FILE}
<<<<<<< SEARCH
<section class="contact-section py-16 bg-white">
            <div class="container">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="main-content">
=======
<section class="contact-section py-16 bg-white fade-in">
            <div class="container">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="main-content fade-in slide-up delay-1">
>>>>>>> REPLACE
EOF

echo "Applying Patch 2B (Contact Section - sidebar)"
cat <<EOF | replace_with_git_merge_diff
${TARGET_HTML_FILE}
<<<<<<< SEARCH
<aside class="sidebar">
                        <div class="card contact-info-card p-6 bg-slate-lightest rounded-lg shadow-md">
=======
<aside class="sidebar fade-in slide-up delay-2">
                        <div class="card contact-info-card p-6 bg-slate-lightest rounded-lg shadow-md">
>>>>>>> REPLACE
EOF

# Patch 3: Map Section
echo "Applying Patch 3 (Map Section)"
cat <<EOF | replace_with_git_merge_diff
${TARGET_HTML_FILE}
<<<<<<< SEARCH
<section class="map-section py-16 bg-neutral-lightest">
            <div class="container">
                <h2 class="elegant-heading centered text-3xl centered mb-8">Our Location</h2>
                <div id="contact-map" style="height: 450px;"></div>
=======
<section class="map-section py-16 bg-neutral-lightest fade-in">
            <div class="container">
                <h2 class="elegant-heading centered text-3xl centered mb-8 fade-in delay-1">Our Location</h2>
                <div id="contact-map" class="fade-in delay-2" style="height: 450px;"></div>
>>>>>>> REPLACE
EOF

# Patch 4: FAQ Section (Section title and first accordion item)
echo "Applying Patch 4 (FAQ Section - title and first item)"
cat <<EOF | replace_with_git_merge_diff
${TARGET_HTML_FILE}
<<<<<<< SEARCH
<section class="faq-section py-16 bg-white">
            <div class="container">
                <h2 class="elegant-heading centered text-3xl centered mb-8">Frequently Asked Questions</h2>
                <div class="accordion">
                    <div class="card accordion-item mb-3">
=======
<section class="faq-section py-16 bg-white fade-in">
            <div class="container">
                <h2 class="elegant-heading centered text-3xl centered mb-8 fade-in delay-1">Frequently Asked Questions</h2>
                <div class="accordion">
                    <div class="card accordion-item mb-3 fade-in slide-up delay-1">
>>>>>>> REPLACE
EOF

# Awk script to animate the rest of the accordion items
echo "Applying animations to remaining accordion items via awk."
awk '
    function add_classes(line, new_cls_str) {
        current_classes = ""; has_class_attr = 0; attr_start_pos = 0; attr_len = 0;
        if (match(line, /class="([^"]*)"/)) { current_classes = substr(line, RSTART + 7, RLENGTH - 8); has_class_attr = 1; attr_start_pos = RSTART; attr_len = RLENGTH; } else if (match(line, /<[^ >]+/)) { attr_start_pos = RSTART + RLENGTH; }
        split(new_cls_str, classes_to_add, " "); for (i in classes_to_add) { cls = classes_to_add[i]; if ((" " current_classes " ") !~ (" " cls " ")) { if (current_classes == "") { current_classes = cls; } else { current_classes = current_classes " " cls; } } }
        if (has_class_attr) { line = substr(line, 1, attr_start_pos + 6) current_classes substr(line, attr_start_pos + attr_len -1); } else if (attr_start_pos > 0) { line = substr(line, 1, attr_start_pos) " class=\"" current_classes "\"" substr(line, attr_start_pos + 1); } return line;
    }
    BEGIN {
        in_faq_section = 0;
        in_accordion = 0;
        accordion_item_delay = 1; # Start delay from 1, first item handled by patch
    }

    /class="faq-section/ { in_faq_section = 1; }
    in_faq_section && /class="accordion"/ { in_accordion = 1; accordion_item_delay = 1; print; next; }

    in_accordion && /class="card accordion-item/ {
        # Skip if already animated by patch (which handles the first item with delay-1)
        if (!($0 ~ "delay-1" && $0 ~ "fade-in slide-up")) {
            accordion_item_delay++;
            # Cycle delays if needed, e.g., 2, 3, then back to 1 or continue
            if (accordion_item_delay > 3 && accordion_item_delay > 1) { accordion_item_delay = 1;} # Example: cycle 1-3, starting next at 2
            else if (accordion_item_delay == 1) { accordion_item_delay = 2; } # Ensure it starts at 2 if first was 1

            anim_class = "fade-in slide-up delay-" accordion_item_delay;
            $0 = add_classes($0, anim_class);
        }
    }
    # More robust exit conditions
    in_accordion && /<\/div>\s*<\/section>/ { # Assuming accordion is directly followed by section end
        in_accordion = 0;
        in_faq_section = 0;
    }
    in_faq_section && /<\/section>/ {
        in_faq_section = 0;
        in_accordion = 0;
    }

    {print}
' "${TARGET_HTML_FILE}" > temp_contact.html && mv temp_contact.html "${TARGET_HTML_FILE}"


# Patch 5: CTA Section Animations
echo "Applying Patch 5 (CTA Section)"
cat <<EOF | replace_with_git_merge_diff
${TARGET_HTML_FILE}
<<<<<<< SEARCH
<section class="cta-section py-16 bg-primary-lightest">
            <div class="container">
                <div class="cta-content">
                    <h2 class="elegant-heading centered text-3xl centered mb-4">Ready to Take the First Step?</h2>
                    <p>Our team is committed to providing prompt, professional legal guidance.</p>
                    <div class="cta-buttons">
                        <a href="tel:+17051234567" class="btn btn-primary" aria-label="Call Now">Call Now</a>
                        <a href="/about.html" class="btn btn-secondary" aria-label="Learn About Our Team">Learn About Our Team</a>
                    </div>
                </div>
            </div>
        </section>
=======
<section class="cta-section py-16 bg-primary-lightest fade-in">
            <div class="container">
                <div class="cta-content">
                    <h2 class="elegant-heading centered text-3xl centered mb-4 fade-in delay-1">Ready to Take the First Step?</h2>
                    <p class="fade-in delay-2">Our team is committed to providing prompt, professional legal guidance.</p>
                    <div class="cta-buttons">
                        <a href="tel:+17051234567" class="btn btn-primary fade-in delay-3 pulse" aria-label="Call Now">Call Now</a>
                        <a href="/about.html" class="btn btn-secondary fade-in delay-3">Learn About Our Team</a>
                    </div>
                </div>
            </div>
        </section>
>>>>>>> REPLACE
EOF

echo "Animations applied to ${TARGET_HTML_FILE}."
echo "--- Verifying some animations in ${TARGET_HTML_FILE} ---"
grep --color=always 'page-header.*fade-in' "${TARGET_HTML_FILE}"
grep --color=always 'contact-section.*fade-in' "${TARGET_HTML_FILE}"
grep --color=always 'accordion-item.*slide-up' "${TARGET_HTML_FILE}"
grep --color=always 'cta-section.*fade-in' "${TARGET_HTML_FILE}"
grep --color=always 'btn-primary.*pulse' "${TARGET_HTML_FILE}"

# cp "${TARGET_HTML_FILE}.anim.bak" "${TARGET_HTML_FILE}" # Restore if needed
echo "--- Finished animation pass for ${TARGET_HTML_FILE} ---"
