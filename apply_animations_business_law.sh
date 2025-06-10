#!/bin/bash

TARGET_HTML_FILE="business-law.html"

echo "--- Applying animations to ${TARGET_HTML_FILE} ---"
cp "${TARGET_HTML_FILE}" "${TARGET_HTML_FILE}.anim_attempt.bak"

# Patch 1: Page Header Animations
echo "Applying Patch 1 (Page Header)"
cat <<EOF | replace_with_git_merge_diff
${TARGET_HTML_FILE}
<<<<<<< SEARCH
<section class="page-header py-16 bg-neutral-lightest">
            <div class="container">
                <h1 class="elegant-heading text-4xl md:text-5xl">Business Law</h1>
                <p class="lead">Legal counsel for businesses at every stage, from formation to growth and beyond.</p>
=======
<section class="page-header py-16 bg-neutral-lightest fade-in">
            <div class="container">
                <h1 class="elegant-heading text-4xl md:text-5xl fade-in slide-down">Business Law</h1>
                <p class="lead fade-in slide-down delay-1">Legal counsel for businesses at every stage, from formation to growth and beyond.</p>
>>>>>>> REPLACE
EOF

# Patch 2: Overview Section Animations
echo "Applying Patch 2 (Overview Section)"
cat <<EOF | replace_with_git_merge_diff
${TARGET_HTML_FILE}
<<<<<<< SEARCH
<section id="overview" class="page-section py-16 bg-white">
            <div class="container">
                <div class="content-grid">
                    <div class="main-content">
                        <h2 class="elegant-heading text-3xl mb-4">Business Law at NorthernEdge</h2>
                        <p>Business law encompasses the legal frameworks that guide the formation, operation, and growth of businesses. At NorthernEdge Legal Solutions, we provide comprehensive business law services designed to help entrepreneurs and established companies navigate legal complexities while focusing on their core operations.</p>

                        <p>Whether you're launching a startup, growing an established business, or planning for succession, our team offers practical legal solutions tailored to your specific business goals and industry context.</p>
                    </div>

                    <aside class="sidebar">
                        <div class="card cta-card p-6 bg-slate-lightest rounded-lg shadow-md">
                            <h3 class="elegant-heading text-xl mb-3">Business Law Resources</h3>
                            <ul class="resource-links">
                                <li><a href="/resources/business-formation-guide.pdf">Business Formation Guide</a></li>
                                <li><a href="/resources/contract-essentials.pdf">Contract Essentials Checklist</a></li>
                                <li><a href="/resources/compliance-overview.pdf">Regulatory Compliance Overview</a></li>
                            </ul>
                            <a href="/contact.html" class="btn btn-primary w-full" aria-label="Schedule a Consultation">Schedule a Consultation</a>
                        </div>
                    </aside>
                </div>
            </div>

            <div class="continue-reading">
                <button class="continue-button" aria-label="Continue to Services section" data-target="#services">
=======
<section id="overview" class="page-section py-16 bg-white fade-in">
            <div class="container">
                <div class="content-grid">
                    <div class="main-content">
                        <h2 class="elegant-heading text-3xl mb-4 fade-in delay-1">Business Law at NorthernEdge</h2>
                        <p>Business law encompasses the legal frameworks that guide the formation, operation, and growth of businesses. At NorthernEdge Legal Solutions, we provide comprehensive business law services designed to help entrepreneurs and established companies navigate legal complexities while focusing on their core operations.</p>

                        <p>Whether you're launching a startup, growing an established business, or planning for succession, our team offers practical legal solutions tailored to your specific business goals and industry context.</p>
                    </div>

                    <aside class="sidebar">
                        <div class="card cta-card p-6 bg-slate-lightest rounded-lg shadow-md fade-in slide-up delay-1">
                            <h3 class="elegant-heading text-xl mb-3">Business Law Resources</h3>
                            <ul class="resource-links">
                                <li><a href="/resources/business-formation-guide.pdf">Business Formation Guide</a></li>
                                <li><a href="/resources/contract-essentials.pdf">Contract Essentials Checklist</a></li>
                                <li><a href="/resources/compliance-overview.pdf">Regulatory Compliance Overview</a></li>
                            </ul>
                            <a href="/contact.html" class="btn btn-primary w-full" aria-label="Schedule a Consultation">Schedule a Consultation</a>
                        </div>
                    </aside>
                </div>
            </div>

            <div class="continue-reading">
                <button class="continue-button fade-in" aria-label="Continue to Services section" data-target="#services">
>>>>>>> REPLACE
EOF

# Patch 3: Services Section Animations (Section, Title, first card)
echo "Applying Patch 3 (Services Section - partial)"
cat <<EOF | replace_with_git_merge_diff
${TARGET_HTML_FILE}
<<<<<<< SEARCH
<section id="services" class="page-section py-16 bg-neutral-lightest">
            <div class="container">
                <h2 class="section-title text-center elegant-heading text-3xl centered mb-8">Our Business Law Services</h2>
                <div class="services-grid">
                    <div class="card service-item p-6 rounded-lg shadow-md text-center">
                        <div class="service-icon">
                            <img src="/images/icons/business-formation-icon.svg" alt="Business Formation Icon">
                        </div>
                        <h3 class="elegant-heading text-xl mb-2">Business Formation & Structure</h3>
                        <p>Guidance on selecting and establishing the optimal business structure, including incorporation, partnership agreements, and bylaws tailored to your specific needs and goals.</p>
                    </div>
=======
<section id="services" class="page-section py-16 bg-neutral-lightest fade-in">
            <div class="container">
                <h2 class="section-title text-center elegant-heading text-3xl centered mb-8 fade-in delay-1">Our Business Law Services</h2>
                <div class="services-grid">
                    <div class="card service-item p-6 rounded-lg shadow-md text-center fade-in slide-up delay-1">
                        <div class="service-icon">
                            <img src="/images/icons/business-formation-icon.svg" alt="Business Formation Icon">
                        </div>
                        <h3 class="elegant-heading text-xl mb-2">Business Formation & Structure</h3>
                        <p>Guidance on selecting and establishing the optimal business structure, including incorporation, partnership agreements, and bylaws tailored to your specific needs and goals.</p>
                    </div>
>>>>>>> REPLACE
EOF

# Awk script to animate remaining service cards and other specified elements
echo "Applying animations to remaining service cards, approach cards, industry cards, and continue buttons via awk."
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
    } else if (match(line, /<[^ >]+/)) { # Match the tag itself e.g. <div
        attr_start_pos = RSTART + RLENGTH; # Position to insert class attribute
    }


    split(new_cls_str, classes_to_add, " ");
    for (i in classes_to_add) {
        cls = classes_to_add[i];
        # Ensure class is not already present
        if ((" " current_classes " ") !~ (" " cls " ")) {
            if (current_classes == "") {
                current_classes = cls;
            } else {
                current_classes = current_classes " " cls;
            }
        }
    }

    if (has_class_attr) {
        # Replace existing class attribute
        line = substr(line, 1, attr_start_pos + 6) current_classes substr(line, attr_start_pos + attr_len - 1);
    } else if (attr_start_pos > 0) {
        # Insert new class attribute
         line = substr(line, 1, attr_start_pos) " class=\"" current_classes "\"" substr(line, attr_start_pos + 1);
    }
    return line;
}

BEGIN {
    in_services_grid = 0; service_card_delay = 1;
    in_approach_grid = 0; approach_card_delay = 1;
    in_industries_grid = 0; industry_card_delay = 1;
    # Section flags for titles
    in_approach_section = 0;
    in_industries_section = 0;
}

# Section titles (Approach, Industries)
/id="approach"/ {in_approach_section=1;}
in_approach_section && /class="section-title.*elegant-heading/ && !(/fade-in/){ $0 = add_classes($0, "fade-in delay-1"); }
in_approach_section && /<\/section>/ {in_approach_section=0;}

/id="industries"/ {in_industries_section=1;}
in_industries_section && /class="section-title.*elegant-heading/ && !(/fade-in/){ $0 = add_classes($0, "fade-in delay-1"); }
in_industries_section && /<\/section>/ {in_industries_section=0;}


# Services Grid Cards
/class="services-grid"/ { in_services_grid = 1; print; next; }
in_services_grid && /class="card service-item/ {
    if (!($0 ~ "fade-in slide-up")) {
        $0 = add_classes($0, "fade-in slide-up delay-" service_card_delay);
        service_card_delay++;
        if(service_card_delay > 3) { service_card_delay = 2; } # Cycle delays 1-3, or 2-3 if first is delay-1
    }
}
# Exiting services grid (simplistic check, might need refinement for nested structures)
# This logic is tricky with just awk. A more robust parser would be better.
# For now, assume it ends before another grid starts or section ends.
in_services_grid && /<\/div>\s*<\/div>\s*<div class="continue-reading">/ { in_services_grid = 0; service_card_delay=1;} # End of services-grid content
in_services_grid && /<\/section>/ {in_services_grid = 0; service_card_delay=1;}


# Approach Grid Cards
/class="approach-grid"/ { in_approach_grid = 1; print; next; }
in_approach_grid && /class="card approach-card/ {
    $0 = add_classes($0, "fade-in slide-up delay-" approach_card_delay);
    approach_card_delay++;
    if(approach_card_delay > 3) { approach_card_delay = 1; }
}
in_approach_grid && /<\/div>\s*<\/div>\s*<div class="continue-reading">/ { in_approach_grid = 0; approach_card_delay=1;}
in_approach_grid && /<\/section>/ {in_approach_grid = 0; approach_card_delay=1;}


# Industries Grid Cards
/class="industries-grid"/ { in_industries_grid = 1; print; next; }
in_industries_grid && /class="card industry-card/ {
    $0 = add_classes($0, "fade-in slide-up delay-" industry_card_delay);
    industry_card_delay++;
    if(industry_card_delay > 3) { industry_card_delay = 1; }
}
in_industries_grid && /<\/div>\s*<\/div>\s*<\/section>/ { in_industries_grid = 0; industry_card_delay=1;} # End of industries-grid section
in_industries_grid && /<\/section>/ {in_industries_grid = 0; industry_card_delay=1;}

# Continue Reading buttons (if not already animated by patches)
# Target buttons within <div class="continue-reading">
/class="continue-reading"/ { in_continue_reading_div = 1; }
in_continue_reading_div && /class="continue-button"/ {
    if (!($0 ~ "fade-in")) {
        $0 = add_classes($0, "fade-in");
    }
}
in_continue_reading_div && /<\/div>/ { in_continue_reading_div = 0; }


{print}
' "${TARGET_HTML_FILE}" > temp_business_law.html && mv temp_business_law.html "${TARGET_HTML_FILE}"


# Patch 4: CTA Section
echo "Applying Patch 4 (CTA Section)"
cat <<EOF | replace_with_git_merge_diff
${TARGET_HTML_FILE}
<<<<<<< SEARCH
<section class="cta-section py-16 bg-primary-dark text-white">
            <div class="container">
                <div class="cta-content">
                    <h2 class="elegant-heading text-3xl centered mb-4">Ready to Strengthen Your Business's Legal Foundation?</h2>
                    <p>Our team is prepared to help you navigate legal challenges and seize opportunities for growth.</p>
                    <div class="cta-buttons">
                        <a href="/contact.html" class="btn btn-primary" aria-label="Schedule a Consultation">Schedule a Consultation</a>
                        <a href="/resources/business-formation-checklist.html" class="btn btn-secondary" aria-label="Download Business Formation Checklist">Download Business Formation Checklist</a>
                    </div>
                </div>
            </div>
        </section>
=======
<section class="cta-section py-16 bg-primary-dark text-white fade-in">
            <div class="container">
                <div class="cta-content">
                    <h2 class="elegant-heading text-3xl centered mb-4 fade-in delay-1">Ready to Strengthen Your Business's Legal Foundation?</h2>
                    <p class="fade-in delay-2">Our team is prepared to help you navigate legal challenges and seize opportunities for growth.</p>
                    <div class="cta-buttons">
                        <a href="/contact.html" class="btn btn-primary fade-in delay-3 pulse" aria-label="Schedule a Consultation">Schedule a Consultation</a>
                        <a href="/resources/business-formation-checklist.html" class="btn btn-secondary fade-in delay-3" aria-label="Download Business Formation Checklist">Download Business Formation Checklist</a>
                    </div>
                </div>
            </div>
        </section>
>>>>>>> REPLACE
EOF

echo "Animations applied to ${TARGET_HTML_FILE}."
echo "--- Verifying some animations in ${TARGET_HTML_FILE} ---"
grep 'page-header.*fade-in' "${TARGET_HTML_FILE}"
grep 'class="card service-item.*slide-up' "${TARGET_HTML_FILE}"
grep 'class="card approach-card.*slide-up' "${TARGET_HTML_FILE}"
grep 'class="card industry-card.*slide-up' "${TARGET_HTML_FILE}"
grep 'cta-section.*fade-in' "${TARGET_HTML_FILE}"
grep 'btn-primary.*pulse' "${TARGET_HTML_FILE}"

# cp "${TARGET_HTML_FILE}.anim_attempt.bak" "${TARGET_HTML_FILE}" # Restore if needed
echo "--- Finished animation pass for ${TARGET_HTML_FILE} ---"
