#!/bin/bash

BLOG_POST_FILES=(
    "blog/posts/Designer_Babies.html"
    "blog/posts/ai-regulation-implications.html"
    "blog/posts/template.html"
)

echo "--- Applying animations to Blog Post Pages ---"

for TARGET_HTML_FILE in "${BLOG_POST_FILES[@]}"; do
    if [ ! -f "$TARGET_HTML_FILE" ]; then
        echo "WARNING: ${TARGET_HTML_FILE} not found, skipping."
        continue
    fi
    echo "--- Processing ${TARGET_HTML_FILE} ---"
    # Restore from original backup for a clean run each time this script is modified/re-run
    if [ -f "${TARGET_HTML_FILE}.anim.bak" ]; then
        cp "${TARGET_HTML_FILE}.anim.bak" "${TARGET_HTML_FILE}"
    else
        # If no .anim.bak, make one from current state if this is the first run of this exact script version
        cp "${TARGET_HTML_FILE}" "${TARGET_HTML_FILE}.anim.bak_initial" # Should ideally use a fresh copy
    fi


    awk '
    # Helper function to add classes (ensure no duplicates)
    function add_classes(line, new_cls_str) {
        current_classes = ""; has_class_attr = 0; attr_start_pos = 0; attr_len = 0;
        if (match(line, /class="([^"]*)"/)) { current_classes = substr(line, RSTART + 7, RLENGTH - 8); has_class_attr = 1; attr_start_pos = RSTART; attr_len = RLENGTH; } else if (match(line, /<[^ >]+/)) { attr_start_pos = RSTART + RLENGTH; }
        split(new_cls_str, classes_to_add, " "); for (i in classes_to_add) { cls = classes_to_add[i]; if ((" " current_classes " ") !~ (" " cls " ")) { if (current_classes == "") { current_classes = cls; } else { current_classes = current_classes " " cls; } } }
        if (has_class_attr) { line = substr(line, 1, attr_start_pos + 6) current_classes substr(line, attr_start_pos + attr_len -1); } else if (attr_start_pos > 0) { line = substr(line, 1, attr_start_pos) " class=\"" current_classes "\"" substr(line, attr_start_pos + 1); } return line;
    }

    BEGIN {
        in_blog_header = 0;
        in_blog_content_div = 0;
        in_author_bio = 0;
        in_related_posts_section = 0;
        in_related_posts_grid = 0;
        related_card_delay = 0;
        first_h1_processed = 0; # Flag to ensure only the first h1 is animated this way
    }

    # Main Article container
    /<article class="blog-post/ { if(!($0 ~ /fade-in/)) { $0 = add_classes($0, "fade-in");} }

    # Blog Header (within article)
    /class="blog-header"/ { in_blog_header = 1; }
    in_blog_header && /<h1/ && !first_h1_processed {
        $0 = add_classes($0, "fade-in slide-down");
        first_h1_processed = 1;
    }
    in_blog_header && /class="blog-meta"/ { $0 = add_classes($0, "fade-in slide-down delay-1"); }
    in_blog_header && /<\/div>/ {
        # This is a simplified end condition. If blog-header has nested divs, this could be tricky.
        # Assuming the first </div> encountered while in_blog_header is its end.
        in_blog_header = 0;
    }

    # Featured Image
    /class="blog-featured-image"/ { if(!($0 ~ /fade-in/)) { $0 = add_classes($0, "fade-in delay-1");} }

    # Blog Content area - the main div
    /class="blog-content/ {
        if(!($0 ~ /fade-in/)) { $0 = add_classes($0, "fade-in delay-2"); }
        in_blog_content_div = 1;
    }
    # Reset in_blog_content_div when its specific closing div is found.
    # This requires careful matching if there are many nested divs.
    # For now, we assume it ends before other major sections like author-bio or related-posts.
    # A more robust way would be to count opening/closing divs for this specific block.
    # If author-bio or related-posts are children of blog-content, this logic needs adjustment.
    # For now, let a new major section reset it.
     (in_blog_content_div && (/class="author-bio/ || /class="related-posts"/ || /class="blog-navigation"/)) {
        in_blog_content_div = 0;
    }


    # Social Share (often inside blog-content or near it)
    /class="social-share"/ { if(!($0 ~ /fade-in/)) { $0 = add_classes($0, "fade-in delay-2");} }

    # Author Bio
    /class="author-bio/ {
        if(!($0 ~ /fade-in/)) { $0 = add_classes($0, "fade-in slide-up delay-1");}
        in_author_bio = 1;
    }
    # End of author-bio section
    in_author_bio && /<\/div>/ { # Assuming author-bio is not deeply nested
        # A simple heuristic: if the div closes an element that was likely the last part of author-bio.
        # This might need to be more specific, e.g. if author-bio itself has an id.
        # For now, we assume its structure is simple enough that any </div> inside might be its end.
        # This is risky. Let new section reset this.
    }
    (in_author_bio && (/class="blog-navigation"/ || /class="related-posts"/)) {
        in_author_bio = 0;
    }


    # Blog Navigation (Prev/Next)
    /class="blog-navigation"/ { if(!($0 ~ /fade-in/)) { $0 = add_classes($0, "fade-in");} }

    # Related Posts Section
    /class="related-posts"/ {
        if(!($0 ~ /fade-in/)) { $0 = add_classes($0, "fade-in"); }
        in_related_posts_section = 1;
        related_card_delay = 0;
    }
    in_related_posts_section && /<h3/ {
        if(!($0 ~ /fade-in/)) { $0 = add_classes($0, "fade-in delay-1");}
    }
    in_related_posts_section && /class="post-grid"/ {
        if(!($0 ~ /fade-in/)) { $0 = add_classes($0, "fade-in delay-1");}
        in_related_posts_grid = 1;
        related_card_delay = 0;
    }
    # Corrected syntax for pattern matching in if condition
    in_related_posts_grid && ( $0 ~ /<div class="related-post/ || $0 ~ /<article class="card blog-card/ ) {
        related_card_delay++;
        anim_class = "fade-in slide-up delay-" related_card_delay;
        $0 = add_classes($0, anim_class);
        if (related_card_delay >= 3) { related_card_delay = 0; }
    }
    # Corrected syntax for pattern matching in if condition
    # Heuristic end of grid. This assumes a fairly flat structure after the grid items.
    in_related_posts_grid && $0 ~ /<\/div>/ && prev_line_is_related_card_end_or_grid {
        # This logic is complex and error-prone with simple awk.
        # A more robust way is needed if the grid structure is complex.
        # For now, rely on the section end.
    }
    in_related_posts_section && /<\/section>/ {
        in_related_posts_section = 0;
        in_related_posts_grid = 0;
    }

    prev_line = $0;
    delete prev_line_is_related_card_end_or_grid; # Reset flag
    if (in_related_posts_grid && ($0 ~ /<\/article>/ || $0 ~ /<\/div>/)) {
        prev_line_is_related_card_end_or_grid = 1;
    }

    { print }
    ' "${TARGET_HTML_FILE}" > "${TARGET_HTML_FILE}.tmp" && mv "${TARGET_HTML_FILE}.tmp" "${TARGET_HTML_FILE}"

    echo "Animations applied to ${TARGET_HTML_FILE}."
    # Basic verification
    echo "Verifying animations for ${TARGET_HTML_FILE}:"
    grep --color=always -E 'article class="blog-post[^"]*fade-in' "${TARGET_HTML_FILE}"
    grep --color=always -E -A1 'class="blog-header"' "${TARGET_HTML_FILE}" # Show header and line after (H1)
    grep --color=always -E 'class="blog-content[^"]*fade-in' "${TARGET_HTML_FILE}"
    grep --color=always -E 'class="related-posts[^"]*fade-in' "${TARGET_HTML_FILE}" || echo "No related-posts section found or animated in ${TARGET_HTML_FILE}"
    grep --color=always -E 'class="[^"]*card[^"]*blog-card[^"]*slide-up|class="related-post[^"]*slide-up' "${TARGET_HTML_FILE}" || echo "No blog cards or related posts found/animated in ${TARGET_HTML_FILE}"
    echo "--- End verification for ${TARGET_HTML_FILE} ---"

done

echo "--- Animation pass complete for blog post pages ---"
