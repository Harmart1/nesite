#!/bin/bash

TARGET_HTML_FILE="general-practice.html"

echo "--- Applying animations to ${TARGET_HTML_FILE} ---"
cp "${TARGET_HTML_FILE}" "${TARGET_HTML_FILE}.anim.bak"

# Patch 1: Page Header Animations
echo "Applying Patch 1 (Page Header)"
cat <<EOF | replace_with_git_merge_diff
${TARGET_HTML_FILE}
<<<<<<< SEARCH
<section class="page-header py-16 bg-neutral-lightest">
            <div class="container">
                <h1 class="elegant-heading text-4xl md:text-5xl">General Practice</h1>
                <p class="lead">Comprehensive legal services for a variety of common legal needs and situations.</p>
=======
<section class="page-header py-16 bg-neutral-lightest fade-in">
            <div class="container">
                <h1 class="elegant-heading text-4xl md:text-5xl fade-in slide-down">General Practice</h1>
                <p class="lead fade-in slide-down delay-1">Comprehensive legal services for a variety of common legal needs and situations.</p>
>>>>>>> REPLACE
EOF

# Patch 2: Overview Section Animations
echo "Applying Patch 2 (Overview Section)"
cat <<EOF | replace_with_git_merge_diff
${TARGET_HTML_FILE}
<<<<<<< SEARCH
<section class="general-practice-overview py-16 bg-white">
            <div class="container">
                <div class="content-grid">
                    <div class="main-content">
                        <h2 class="elegant-heading text-3xl mb-4">General Practice at NorthernEdge</h2>
                        <p>Our General Practice area covers a wide range of legal services designed to meet the diverse needs of our clients. Whether you require assistance with family law, real estate transactions, estate planning, or other common legal matters, our experienced team is here to provide expert guidance and representation.</p>

                        <p>We understand that legal issues can be complex and stressful. Our goal is to make the process as smooth and straightforward as possible, offering personalized service and practical solutions tailored to your unique circumstances.</p>
                    </div>

                    <aside class="sidebar">
                        <div class="card cta-card p-6 bg-slate-lightest rounded-lg shadow-md">
                            <h3 class="elegant-heading text-xl mb-3">General Practice Resources</h3>
                            <ul class="resource-links">
                                <li><a href="/resources/family-law-guide.pdf">Family Law Guide</a></li>
                                <li><a href="/resources/estate-planning-checklist.pdf">Estate Planning Checklist</a></li>
                                <li><a href="/resources/real-estate-transactions.pdf">Real Estate Transactions Guide</a></li>
                            </ul>
                            <a href="/contact.html" class="btn btn-primary w-full">Schedule a Consultation</a>
                        </div>
                    </aside>
                </div>
            </div>

            <div class="continue-reading">
                <button class="continue-button fade-in" aria-label="Continue to Services section" data-target="#services">
=======
<section class="general-practice-overview py-16 bg-white fade-in">
            <div class="container">
                <div class="content-grid">
                    <div class="main-content">
                        <h2 class="elegant-heading text-3xl mb-4 fade-in delay-1">General Practice at NorthernEdge</h2>
                        <p>Our General Practice area covers a wide range of legal services designed to meet the diverse needs of our clients. Whether you require assistance with family law, real estate transactions, estate planning, or other common legal matters, our experienced team is here to provide expert guidance and representation.</p>

                        <p>We understand that legal issues can be complex and stressful. Our goal is to make the process as smooth and straightforward as possible, offering personalized service and practical solutions tailored to your unique circumstances.</p>
                    </div>

                    <aside class="sidebar">
                        <div class="card cta-card p-6 bg-slate-lightest rounded-lg shadow-md fade-in slide-up delay-1">
                            <h3 class="elegant-heading text-xl mb-3">General Practice Resources</h3>
                            <ul class="resource-links">
                                <li><a href="/resources/family-law-guide.pdf">Family Law Guide</a></li>
                                <li><a href="/resources/estate-planning-checklist.pdf">Estate Planning Checklist</a></li>
                                <li><a href="/resources/real-estate-transactions.pdf">Real Estate Transactions Guide</a></li>
                            </ul>
                            <a href="/contact.html" class="btn btn-primary w-full">Schedule a Consultation</a>
                        </div>
                    </aside>
                </div>
            </div>

            <div class="continue-reading">
                <button class="continue-button fade-in" aria-label="Continue to Services section" data-target="#services">
>>>>>>> REPLACE
EOF

# Patch 3: Services Section Animations (Section, Title)
echo "Applying Patch 3 (Services Section Title & Section fade-in)"
cat <<EOF | replace_with_git_merge_diff
${TARGET_HTML_FILE}
<<<<<<< SEARCH
<section id="services" class="page-section py-16 bg-neutral-lightest">
            <div class="container">
                <h2 class="section-title text-center elegant-heading text-3xl centered mb-8">Our General Practice Services</h2>
=======
<section id="services" class="page-section py-16 bg-neutral-lightest fade-in">
            <div class="container">
                <h2 class="section-title text-center elegant-heading text-3xl centered mb-8 fade-in delay-1">Our General Practice Services</h2>
>>>>>>> REPLACE
EOF

# Use awk to animate service-item cards in this section
echo "Applying animations to service cards in ${TARGET_HTML_FILE} via awk."
awk '
    function add_classes(line, new_cls_str) {
        current_classes = "";
        has_class_attr = 0;
        attr_start_pos = 0;
        attr_len = 0;
        if (match(line, /class="([^"]*)"/)) {
            current_classes = substr(line, RSTART + 7, RLENGTH - 8);
            has_class_attr = 1;
            attr_start_pos = RSTART;
            attr_len = RLENGTH;
        } else if (match(line, /<[^ >]+/)) {
            attr_start_pos = RSTART + RLENGTH;
        }
        split(new_cls_str, classes_to_add, " ");
        for (i in classes_to_add) {
            cls = classes_to_add[i];
            if ((" " current_classes " ") !~ (" " cls " ")) {
                if (current_classes == "") {
                    current_classes = cls;
                } else {
                    current_classes = current_classes " " cls;
                }
            }
        }
        if (has_class_attr) {
            line = substr(line, 1, attr_start_pos + 6) current_classes substr(line, attr_start_pos + attr_len -1);
        } else if (attr_start_pos > 0) {
            line = substr(line, 1, attr_start_pos) " class=\"" current_classes "\"" substr(line, attr_start_pos + 1);
        }
        return line;
    }
    BEGIN {
        in_services_section = 0;
        in_services_grid = 0;
        service_card_delay = 1;
    }
    /id="services"/ { in_services_section = 1; }
    in_services_section && /class="services-grid"/ { in_services_grid = 1; service_card_delay = 1; } # Reset delay for each grid

    in_services_grid && /class="card service-item/ {
        $0 = add_classes($0, "fade-in slide-up delay-" service_card_delay);
        service_card_delay++;
        if(service_card_delay > 3) { service_card_delay = 1; } # Cycle delays 1-3 for variety
    }

    # Exit conditions for grids/sections to prevent unintended processing
    in_services_grid && /<\/div>/ { # Simplistic check, assumes this div closes the grid
        if (prev_line ~ /class="card service-item/) { # More specific: if previous was a card
             # Potentially set in_services_grid = 0 if it is the true end of the grid
             # This needs careful handling if divs are nested.
             # For now, rely on in_services_section end.
        }
    }
    in_services_section && /<\/section>/ { in_services_section = 0; in_services_grid = 0; }

    prev_line = $0;
    {print}
' "${TARGET_HTML_FILE}" > temp_gp.html && mv temp_gp.html "${TARGET_HTML_FILE}"


# Patch 4: Contact/CTA Section Animations
echo "Applying Patch 4 (Contact/CTA Section)"
cat <<EOF | replace_with_git_merge_diff
${TARGET_HTML_FILE}
<<<<<<< SEARCH
<section id="contact" class="page-section py-16 bg-white">
            <div class="container">
                <h2 class="section-title text-center elegant-heading text-3xl centered mb-8">Get in Touch</h2>
                <p class="section-description text-center">Schedule a consultation with our team to discuss your legal needs and how we can assist you.</p>
                <div class="cta-buttons text-center">
                    <a href="/contact.html" class="btn btn-primary">Schedule a Consultation</a>
                    <a href="tel:+17059993657" class="btn btn-secondary">(705) 999-3657</a>
                </div>
            </div>
        </section>
=======
<section id="contact" class="page-section py-16 bg-white fade-in">
            <div class="container">
                <h2 class="section-title text-center elegant-heading text-3xl centered mb-8 fade-in delay-1">Get in Touch</h2>
                <p class="section-description text-center fade-in delay-2">Schedule a consultation with our team to discuss your legal needs and how we can assist you.</p>
                <div class="cta-buttons text-center">
                    <a href="/contact.html" class="btn btn-primary fade-in delay-3 pulse">Schedule a Consultation</a>
                    <a href="tel:+17059993657" class="btn btn-secondary fade-in delay-3">(705) 999-3657</a>
                </div>
            </div>
        </section>
>>>>>>> REPLACE
EOF

echo "Animations applied to ${TARGET_HTML_FILE}."
echo "--- Verifying some animations in ${TARGET_HTML_FILE} ---"
grep --color=always 'page-header.*fade-in' "${TARGET_HTML_FILE}"
grep --color=always 'class="card service-item.*slide-up' "${TARGET_HTML_FILE}"
grep --color=always 'id="contact".*page-section.*fade-in' "${TARGET_HTML_FILE}"
grep --color=always 'btn-primary.*pulse' "${TARGET_HTML_FILE}"

# cp "${TARGET_HTML_FILE}.anim.bak" "${TARGET_HTML_FILE}" # Restore if needed
echo "--- Finished animation pass for ${TARGET_HTML_FILE} ---"
