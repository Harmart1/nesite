#!/bin/bash
TARGET_HTML_FILE="blog/index.html"
echo "Applying animations to blog grid and cards in ${TARGET_HTML_FILE} via awk."

awk '
    function add_classes(line, new_cls_str) {
        current_classes = ""; has_class_attr = 0; attr_start_pos = 0; attr_len = 0;
        if (match(line, /class="([^"]*)"/)) { current_classes = substr(line, RSTART + 7, RLENGTH - 8); has_class_attr = 1; attr_start_pos = RSTART; attr_len = RLENGTH; } else if (match(line, /<[^ >]+/)) { attr_start_pos = RSTART + RLENGTH; }
        split(new_cls_str, classes_to_add, " "); for (i in classes_to_add) { cls = classes_to_add[i]; if ((" " current_classes " ") !~ (" " cls " ")) { if (current_classes == "") { current_classes = cls; } else { current_classes = current_classes " " cls; } } }
        if (has_class_attr) { line = substr(line, 1, attr_start_pos + 6) current_classes substr(line, attr_start_pos + attr_len -1); } else if (attr_start_pos > 0) { line = substr(line, 1, attr_start_pos) " class=\"" current_classes "\"" substr(line, attr_start_pos + 1); } return line;
    }
    BEGIN {
        in_blog_grid = 0;
        blog_card_delay = 0;
        grid_regex = "class=\"blog-grid\""; # Adjusted regex
    }

    $0 ~ grid_regex {
        in_blog_grid = 1;
        if ($0 !~ /fade-in.*delay-2/) { # Check if not already animated by a previous run
             $0 = add_classes($0, "fade-in delay-2");
        }
        print;
        next;
    }

    in_blog_grid && /<article class="card blog-card/ {
        blog_card_delay++;
        anim_class = "fade-in slide-up delay-" blog_card_delay;
        $0 = add_classes($0, anim_class);
        if(blog_card_delay >= 3) { blog_card_delay = 0; } # Cycle delays 1-3 (resets to 0, then increments to 1)
    }

    # Exit condition: if we encounter pagination or a new section, assume grid ended.
    in_blog_grid && ( $0 ~ /class="blog-pagination"/ || $0 ~ /<footer class="site-footer"/ ) {
        in_blog_grid = 0;
    }

    { print $0; }

' "${TARGET_HTML_FILE}" > temp_blog_index_awk.html && mv temp_blog_index_awk.html "${TARGET_HTML_FILE}"

echo "Awk animation script for blog grid and cards in ${TARGET_HTML_FILE} finished."
