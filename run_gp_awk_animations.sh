#!/bin/bash
TARGET_HTML_FILE="general-practice.html"
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
    /id="services"/ { in_services_section = 1; } # Start of the relevant section
    in_services_section && /class="services-grid"/ { in_services_grid = 1; service_card_delay = 1; } # Start of grid, reset counter

    in_services_grid && /class="card service-item/ {
        # Check if it already has slide-up to avoid re-adding it if script runs multiple times
        # However, for a clean run, this check might not be strictly needed.
        # The add_classes function already prevents duplicate class names.
        $0 = add_classes($0, "slide-up delay-" service_card_delay); # fade-in is already on the items
        service_card_delay++;
        if(service_card_delay > 3) { service_card_delay = 1; } # Cycle delays 1-3
    }

    # More robustly exit states
    in_services_grid && /<\/div>/ { # A closing div could be the end of services-grid
        # A simple check: if the direct parent of this was services-grid.
        # This requires more complex parsing than awk is good for.
        # For now, rely on the section ending.
    }
    in_services_section && /<\/section>/ { # End of the "services" section
        in_services_section = 0;
        in_services_grid = 0;
    }

    prev_line = $0; # Not actively used in this simplified version but kept from original
    {print}
' "${TARGET_HTML_FILE}" > temp_gp_awk.html && mv temp_gp_awk.html "${TARGET_HTML_FILE}"

echo "Awk animation script for service cards in ${TARGET_HTML_FILE} finished."
