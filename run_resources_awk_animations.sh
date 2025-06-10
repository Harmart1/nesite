#!/bin/bash
TARGET_HTML_FILE="resources.html"
echo "Applying animations to remaining legal-link-cards in ${TARGET_HTML_FILE} via awk."
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
        legal_card_delay = 1; # Start delay from 1, first card was handled by patch with delay-1
    }

    /class="legal-links-section/ { in_legal_links_section = 1; }
    in_legal_links_section && /class="legal-links-grid"/ { in_legal_links_grid = 1; legal_card_delay = 1; } # Reset for each grid

    in_legal_links_grid && /class="legal-link-card/ { # Target just "legal-link-card"
        # Skip if already animated by patch (which handles the first card with delay-1)
        if (!($0 ~ "delay-1")) {
            legal_card_delay++; # Increment for second card onwards
            if (legal_card_delay > 3) { legal_card_delay = 1;} # Cycle delays 1-3 (or use 4, 5, 6 if preferred)
            anim_class = "fade-in slide-up delay-" legal_card_delay;
            $0 = add_classes($0, anim_class);
        }
    }
    # More robust exit conditions
    in_legal_links_grid && /<\/div>\s*<\/section>/ {
        in_legal_links_grid = 0;
        in_legal_links_section = 0;
    }
    in_legal_links_section && /<\/section>/ {
        in_legal_links_section = 0;
        in_legal_links_grid = 0;
    }

    prev_line = $0;
    {print}
' "${TARGET_HTML_FILE}" > temp_resources_awk.html && mv temp_resources_awk.html "${TARGET_HTML_FILE}"

echo "Awk animation script for legal-link-cards in ${TARGET_HTML_FILE} finished."
