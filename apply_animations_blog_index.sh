#!/bin/bash

TARGET_HTML_FILE="blog/index.html"

echo "--- Applying animations to ${TARGET_HTML_FILE} ---"
cp "${TARGET_HTML_FILE}" "${TARGET_HTML_FILE}.anim.bak"

# Patch 1: Page Header Animations
echo "Applying Patch 1 (Page Header)"
cat <<EOF | replace_with_git_merge_diff
${TARGET_HTML_FILE}
<<<<<<< SEARCH
<section class="page-header py-16 bg-neutral-lightest">
            <div class="container">
                <h1 class="elegant-heading text-4xl md:text-5xl">Legal Insights</h1>
                <p class="lead">Analysis and perspectives on legal developments affecting your business.</p>
=======
<section class="page-header py-16 bg-neutral-lightest fade-in">
            <div class="container">
                <h1 class="elegant-heading text-4xl md:text-5xl fade-in slide-down">Legal Insights</h1>
                <p class="lead fade-in slide-down delay-1">Analysis and perspectives on legal developments affecting your business.</p>
>>>>>>> REPLACE
EOF

# Patch 2: Blog Index Container & Filters Animations
echo "Applying Patch 2 (Blog Index Container & Filters)"
cat <<EOF | replace_with_git_merge_diff
${TARGET_HTML_FILE}
<<<<<<< SEARCH
<div class="container">
            <div class="blog-index py-16">
                <div class="blog-filters mb-8 pb-4 border-b">
                    <h2 class="elegant-heading text-2xl mb-3">Categories:</h2>
                    <div class="blog-categories">
=======
<div class="container">
            <div class="blog-index py-16 fade-in">
                <div class="blog-filters mb-8 pb-4 border-b fade-in delay-1">
                    <h2 class="elegant-heading text-2xl mb-3 fade-in delay-2">Categories:</h2>
                    <div class="blog-categories">
>>>>>>> REPLACE
EOF

# Awk script to animate blog cards
echo "Applying animations to blog cards via awk."
awk '
    function add_classes(line, new_cls_str) {
        current_classes = ""; has_class_attr = 0; attr_start_pos = 0; attr_len = 0;
        if (match(line, /class="([^"]*)"/)) { current_classes = substr(line, RSTART + 7, RLENGTH - 8); has_class_attr = 1; attr_start_pos = RSTART; attr_len = RLENGTH; } else if (match(line, /<[^ >]+/)) { attr_start_pos = RSTART + RLENGTH; }
        split(new_cls_str, classes_to_add, " "); for (i in classes_to_add) { cls = classes_to_add[i]; if ((" " current_classes " ") !~ (" " cls " ")) { if (current_classes == "") { current_classes = cls; } else { current_classes = current_classes " " cls; } } }
        if (has_class_attr) { line = substr(line, 1, attr_start_pos + 6) current_classes substr(line, attr_start_pos + attr_len -1); } else if (attr_start_pos > 0) { line = substr(line, 1, attr_start_pos) " class=\"" current_classes "\"" substr(line, attr_start_pos + 1); } return line;
    }
    BEGIN {
        in_blog_grid = 0;
        blog_card_delay = 0; # Start delay from 0, will increment to 1 for first card
        # Regex for the blog grid div
        grid_regex = "class=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8\"";
    }

    # Detect the blog grid container
    $0 ~ grid_regex {
        in_blog_grid = 1;
        # Add animation to the grid container itself, only if not already present
        if ($0 !~ /fade-in.*delay-2/) { # Assuming delay-2 is specific enough
             $0 = add_classes($0, "fade-in delay-2");
        }
        print;
        next;
    }

    # Process cards within the blog grid
    in_blog_grid && /<article class="card blog-card/ {
        blog_card_delay++;
        anim_class = "fade-in slide-up delay-" blog_card_delay;
        $0 = add_classes($0, anim_class);
        if(blog_card_delay >= 3) { blog_card_delay = 0; } # Cycle delays 1-3
    }

    # Attempt to detect end of the grid. This is heuristic.
    # If the grid is the last element in its parent, this might work.
    # A more robust method would count opening/closing divs if nesting is consistent.
    in_blog_grid && /<\/div>/ {
        # Peek ahead or check if this is the specific closing div for the grid.
        # For simplicity, we assume the grid is not deeply nested within other similar divs.
        # This specific check might be too simple if structure is complex.
        # A common pattern is that the grid is followed by pagination or another section.
        # If the *next* line is pagination or end of section, we can turn off the flag.
        # This requires holding the line:
        # hold = $0; getline; if ($0 ~ /class="blog-pagination"/) { in_blog_grid = 0; } print hold; print; next;
        # For now, we will rely on a more explicit end or re-evaluate if it processes too far.
        # A simple check: if the grid was the direct child of a div that now closes.
        # This awk script does not have full DOM parsing.
    }

    # If a new section starts, assume previous grid ended.
    # This helps if the grid is not the last element before pagination.
    in_blog_grid && /<section class=|<div class="blog-pagination"|<nav class="blog-pagination"/ {
        in_blog_grid = 0;
    }

    { print $0; }

' "${TARGET_HTML_FILE}" > temp_blog_index.html && mv temp_blog_index.html "${TARGET_HTML_FILE}"


# Patch 3: Pagination Animation
echo "Applying Patch 3 (Pagination)"
cat <<EOF | replace_with_git_merge_diff
${TARGET_HTML_FILE}
<<<<<<< SEARCH
<div class="blog-pagination mt-12 pt-8 border-t flex justify-center items-center space-x-2">
=======
<div class="blog-pagination mt-12 pt-8 border-t flex justify-center items-center space-x-2 fade-in delay-2">
>>>>>>> REPLACE
EOF

echo "Animations applied to ${TARGET_HTML_FILE}."
echo "--- Verifying some animations in ${TARGET_HTML_FILE} ---"
grep --color=always 'page-header.*fade-in' "${TARGET_HTML_FILE}"
grep --color=always 'blog-filters.*fade-in' "${TARGET_HTML_FILE}"
grep --color=always 'class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8.*fade-in.*delay-2"' "${TARGET_HTML_FILE}" # Grid container
grep --color=always 'blog-card.*slide-up' "${TARGET_HTML_FILE}"
grep --color=always 'blog-pagination.*fade-in' "${TARGET_HTML_FILE}"

# cp "${TARGET_HTML_FILE}.anim.bak" "${TARGET_HTML_FILE}" # Restore if needed
echo "--- Finished animation pass for ${TARGET_HTML_FILE} ---"
