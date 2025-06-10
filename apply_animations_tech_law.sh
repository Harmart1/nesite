#!/bin/bash

TARGET_HTML_FILE="technology-law.html"

echo "--- Applying animations to ${TARGET_HTML_FILE} ---"
cp "${TARGET_HTML_FILE}" "${TARGET_HTML_FILE}.anim.bak"

awk '
# Helper function to add classes (ensure no duplicates)
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

# Page Header
/class="page-header/ {
    is_main_header_section = 1;
    if ($0 !~ /fade-in/) { $0 = add_classes($0, "fade-in"); }
}
is_main_header_section && /<h1/ { $0 = add_classes($0, "fade-in slide-down"); }
is_main_header_section && /<p class="lead"/ { $0 = add_classes($0, "fade-in slide-down delay-1"); }
is_main_header_section && /<\/section>/ { is_main_header_section = 0; }


# Main Content Sections (page-section)
# This targets sections like "Overview", "Key Technology Law Services", etc.
in_main_content && /class="page-section/ {
    # Add fade-in to the section itself if not already present
    if (!first_section_in_main_processed) { # Apply to first page-section in main
         if ($0 !~ /fade-in/) { $0 = add_classes($0, "fade-in"); }
         first_section_in_main_processed = 1;
    } else { # For subsequent page-sections
         if ($0 !~ /fade-in/) { $0 = add_classes($0, "fade-in"); }
    }
    in_a_page_section = 1;
    current_section_card_count = 0; # Reset for cards within this section
    # Reset other specific card counters if they are section-dependent
    tech_service_card_count = 0;
}
# Headings within page-sections
in_a_page_section && /<h2 class="elegant-heading/ { $0 = add_classes($0, "fade-in delay-1"); }
in_a_page_section && /<h2 class="section-title / { $0 = add_classes($0, "fade-in delay-1"); }


# Specific card types if their parent grid is identifiable
# For "Key Technology Law Services"
/class="services-grid tech-services-grid"/ { in_tech_services_grid = 1; tech_service_card_count = 0; }
in_tech_services_grid && /<div class="card service-item/ {
    tech_service_card_count++;
    anim_classes = "fade-in slide-up";
    if (tech_service_card_count == 1) anim_classes = anim_classes " delay-1";
    else if (tech_service_card_count == 2) anim_classes = anim_classes " delay-2";
    else if (tech_service_card_count == 3) anim_classes = anim_classes " delay-3";
    else if (tech_service_card_count == 4) anim_classes = anim_classes " delay-1"; # Cycle delays
    else if (tech_service_card_count == 5) anim_classes = anim_classes " delay-2";
    else if (tech_service_card_count == 6) anim_classes = anim_classes " delay-3";
    $0 = add_classes($0, anim_classes);
}
in_tech_services_grid && /<\/div>\s*<\/div>$/ { # End of a grid structure, assuming it is the services-grid
    if (prev_line ~ /class="card service-item/) { # If the previous line was a card
         in_tech_services_grid = 0; # More robustly turn off when grid ends
    }
}


# Generic Cards within various other grids (e.g., content-grid for overview)
# This is a fallback if specific grid logic above does not catch something.
# It might be too general, apply with caution or make more specific.
# For technology-law.html, the sidebar CTA is more specific.
# (prev_line ~ /class="[^"]*-grid"/ || prev_line ~ /class="content-grid"/) && /<div class="card / && !in_tech_services_grid {
#    $0 = add_classes($0, "fade-in slide-up delay-1");
# }

# Sidebar CTA Card (in Overview section)
/id="overview"/ { in_overview_section_for_sidebar = 1; }
in_overview_section_for_sidebar && /class="sidebar / { in_sidebar = 1; }
in_sidebar && /class="card cta-card/ { $0 = add_classes($0, "fade-in slide-up delay-1"); }
in_sidebar && /<\/aside>/ { in_sidebar = 0; }
in_overview_section_for_sidebar && /<\/section>/ { in_overview_section_for_sidebar = 0; }


# Continue Reading Buttons
/class="continue-button"/ { $0 = add_classes($0, "fade-in"); }

# Other Practice Areas Nav Section (service-nav-card)
/class="services-nav/ { in_services_nav_section = 1;
    if ($0 !~ /fade-in/) { $0 = add_classes($0, "fade-in"); }
    service_nav_card_count = 0;
}
in_services_nav_section && /class="card service-nav-card/ {
    service_nav_card_count++;
    anim_class = "fade-in slide-up";
    if(service_nav_card_count == 1) { anim_class = anim_class " delay-1"; }
    else if(service_nav_card_count == 2) { anim_class = anim_class " delay-2"; }
    else if(service_nav_card_count == 3) { anim_class = anim_class " delay-3"; }
    # Reset if more than 3, though only 3 are expected here
    else { anim_class = anim_class " delay-1"; service_nav_card_count = 1;}
    $0 = add_classes($0, anim_class);
}
in_services_nav_section && /<\/section>/ { in_services_nav_section = 0; }


# Final CTA Section (often class="cta-section")
/class="cta-section/ { cta_section_page = 1;
    if ($0 !~ /fade-in/) { $0 = add_classes($0, "fade-in"); }
}
cta_section_page && /<h2 class="elegant-heading / { $0 = add_classes($0, "fade-in delay-1"); }
cta_section_page && /<p>/ {
    # Apply to paragraph(s) immediately following the h2 in CTA
    if (NR == prev_h2_line_cta_page + 1 || NR == prev_h2_line_cta_page + 2) {
         $0 = add_classes($0, "fade-in delay-2");
    }
}
cta_section_page && /class="cta-buttons"/ { in_cta_buttons_page_specific = 1; }
in_cta_buttons_page_specific && /class="btn btn-primary"/ { $0 = add_classes($0, "fade-in delay-3 pulse"); }
in_cta_buttons_page_specific && /class="btn btn-secondary"/ { $0 = add_classes($0, "fade-in delay-3"); }
in_cta_buttons_page_specific && /<\/div>/ { if (in_cta_buttons_page_specific) { in_cta_buttons_page_specific = 0; } } # Assuming this div closes cta-buttons
cta_section_page && /<\/section>/ { cta_section_page = 0; }

# Track main content area
/<main/ { in_main_content = 1; first_section_in_main_processed = 0; }
/<\/main>/ { in_main_content = 0; }

# Track h2 in CTA for paragraph targeting
cta_section_page && /<h2 class="elegant-heading / { prev_h2_line_cta_page = NR; }

# End of section processing
in_a_page_section && /<\/section>/ { in_a_page_section = 0; }

prev_line = $0;
{ print }
' "${TARGET_HTML_FILE}" > "${TARGET_HTML_FILE}.tmp" && mv "${TARGET_HTML_FILE}.tmp" "${TARGET_HTML_FILE}"

echo "Animations applied to ${TARGET_HTML_FILE}."
echo "--- Verifying some animations in ${TARGET_HTML_FILE} ---"
grep 'page-header.*fade-in' "${TARGET_HTML_FILE}"
grep 'class="card service-item.*slide-up' "${TARGET_HTML_FILE}" || echo "No 'card service-item' (tech services) found/animated in ${TARGET_HTML_FILE}"
grep 'class="card service-nav-card.*slide-up' "${TARGET_HTML_FILE}" || echo "No 'service-nav-card' found/animated in ${TARGET_HTML_FILE}"
grep 'cta-section.*fade-in' "${TARGET_HTML_FILE}"
grep 'btn-primary.*pulse' "${TARGET_HTML_FILE}"

# cp "${TARGET_HTML_FILE}.anim.bak" "${TARGET_HTML_FILE}" # Restore if needed
echo "--- Finished animation pass for ${TARGET_HTML_FILE} ---"
