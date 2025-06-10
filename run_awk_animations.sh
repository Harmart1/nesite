#!/bin/bash
TARGET_HTML_FILE="business-law.html"
echo "Applying animations via awk to ${TARGET_HTML_FILE}"
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
in_approach_section && /class="section-title.*text-center"/ && !(/fade-in/){ $0 = add_classes($0, "fade-in delay-1"); }
in_approach_section && /<\/section>/ {in_approach_section=0;}

/id="industries"/ {in_industries_section=1;}
in_industries_section && /class="section-title.*text-center"/ && !(/fade-in/){ $0 = add_classes($0, "fade-in delay-1"); }
in_industries_section && /<\/section>/ {in_industries_section=0;}


# Services Grid Cards
/class="services-grid"/ { in_services_grid = 1; print; next; }
in_services_grid && /class="service-item/ { # Changed from "card service-item" to just "service-item" based on actual HTML
    if (!($0 ~ "fade-in") && !($0 ~ "slide-up")) { # Check if not already animated by patch or previous run
        $0 = add_classes($0, "fade-in slide-up delay-" service_card_delay);
    } else if (!($0 ~ "delay-")) { # If basic fade-in slide-up exists but no delay (likely from patch on first item)
         $0 = add_classes($0, "delay-" service_card_delay);
    }
    service_card_delay++;
    if(service_card_delay > 3) { service_card_delay = 2; } # Cycle delays
}
in_services_grid && /class="continue-reading"/ { in_services_grid = 0; service_card_delay=1;} # End of services-grid content before continue
in_services_grid && /<\/section>/ {in_services_grid = 0; service_card_delay=1;}


# Approach Grid Cards
/class="approach-grid"/ { in_approach_grid = 1; print; next; }
in_approach_grid && /class="approach-card/ {
    if (!($0 ~ "fade-in") && !($0 ~ "slide-up")) {
      $0 = add_classes($0, "fade-in slide-up delay-" approach_card_delay);
    } else if (!($0 ~ "delay-")) {
       $0 = add_classes($0, "delay-" approach_card_delay);
    }
    approach_card_delay++;
    if(approach_card_delay > 3) { approach_card_delay = 1; }
}
in_approach_grid && /class="continue-reading"/ { in_approach_grid = 0; approach_card_delay=1;}
in_approach_grid && /<\/section>/ {in_approach_grid = 0; approach_card_delay=1;}


# Industries Grid Cards
/class="industries-grid"/ { in_industries_grid = 1; print; next; }
in_industries_grid && /class="industry-card/ {
    if (!($0 ~ "fade-in") && !($0 ~ "slide-up")) {
      $0 = add_classes($0, "fade-in slide-up delay-" industry_card_delay);
    } else if (!($0 ~ "delay-")) {
       $0 = add_classes($0, "delay-" industry_card_delay);
    }
    industry_card_delay++;
    if(industry_card_delay > 3) { industry_card_delay = 1; }
}
in_industries_grid && /<\/div>\s*<\/section>/ { in_industries_grid = 0; industry_card_delay=1;} # End of industries-grid section
in_industries_grid && /<\/section>/ {in_industries_grid = 0; industry_card_delay=1;}

# Continue Reading buttons (if not already animated by patches)
/class="continue-reading"/ { in_continue_reading_div = 1; }
in_continue_reading_div && /class="continue-button"/ {
    if (!($0 ~ "fade-in")) {
        $0 = add_classes($0, "fade-in");
    }
}
in_continue_reading_div && /<\/div>/ { in_continue_reading_div = 0; }


{print}
' "${TARGET_HTML_FILE}" > temp_business_law.html && mv temp_business_law.html "${TARGET_HTML_FILE}"

echo "Awk animation script finished for ${TARGET_HTML_FILE}."
