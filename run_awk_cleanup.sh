#!/bin/bash
TARGET_HTML_FILE="business-law.html"
echo "Applying animation cleanup via awk to ${TARGET_HTML_FILE}"
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
            if (current_classes == "") { current_classes = cls; }
            else { current_classes = current_classes " " cls; }
        }
    }

    if (has_class_attr) {
        line = substr(line, 1, attr_start_pos + 6) current_classes substr(line, attr_start_pos + attr_len - 1);
    } else if (attr_start_pos > 0) {
         line = substr(line, 1, attr_start_pos) " class=\"" current_classes "\"" substr(line, attr_start_pos + 1);
    }
    return line;
}

BEGIN {
    in_services_grid = 0;
    in_approach_grid = 0;
}

# Services Grid Cards
/class="services-grid"/ { in_services_grid = 1; }
in_services_grid && /class="service-item/ {
    if ($0 ~ "fade-in" && !($0 ~ "slide-up")) {
        $0 = add_classes($0, "slide-up");
    }
}
in_services_grid && /class="continue-reading"/ { in_services_grid = 0; }
in_services_grid && /<\/section>/ {in_services_grid = 0;}


# Approach Grid Cards
/class="approach-grid"/ { in_approach_grid = 1; }
in_approach_grid && /class="approach-card/ {
    if ($0 ~ "fade-in" && !($0 ~ "slide-up")) {
      $0 = add_classes($0, "slide-up");
    }
}
in_approach_grid && /class="continue-reading"/ { in_approach_grid = 0;}
in_approach_grid && /<\/section>/ {in_approach_grid = 0;}

{print}
' "${TARGET_HTML_FILE}" > temp_business_law_cleanup.html && mv temp_business_law_cleanup.html "${TARGET_HTML_FILE}"

echo "Awk animation cleanup script finished for ${TARGET_HTML_FILE}."
