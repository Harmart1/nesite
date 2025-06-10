#!/bin/bash

echo "--- Starting Chatbot Testing & Refinement (CSS/HTML pass) ---"
REFINEMENT_LOG="chatbot_refinement.log"
>"${REFINEMENT_LOG}"

# --- 1. Adjust Chatbot CSS for z-index and initial state ---
CHATBOT_CSS_FILE="css/chatbot.css"

if [ ! -f "$CHATBOT_CSS_FILE" ]; then
    echo "ERROR: ${CHATBOT_CSS_FILE} not found. Aborting CSS modification." | tee -a "${REFINEMENT_LOG}"
    exit 1
fi
cp "${CHATBOT_CSS_FILE}" "${CHATBOT_CSS_FILE}.refinement.bak2" # New backup for this attempt

awk '
BEGIN {
    in_container_rule = 0;
    found_container_z_index_to_replace = 0;

    in_window_rule = 0;
    window_rule_content_to_keep = "";
    window_rule_processed = 0;
}

# Section for #chatbot-container
/^#chatbot-container \{/ {
    print;
    print "    z-index: 1050; /* Ensure above site header */";
    in_container_rule = 1;
    found_container_z_index_to_replace = 0; # Reset flag for each container rule instance (if any)
    next;
}
in_container_rule && /^\s*z-index:/ {
    if (!found_container_z_index_to_replace) { # Only skip the first old z-index found after our new one
        found_container_z_index_to_replace = 1;
        next;
    }
    # If there were multiple z-indexes somehow, others would print unless logic is more complex
}
in_container_rule && /^\}/ {
    in_container_rule = 0;
    print;
    next;
}
in_container_rule { print; next; } # Print other lines within the container rule


# Section for .chatbot-window
/^\.chatbot-window \{/ {
    print; # Print the selector line, e.g., .chatbot-window {
    in_window_rule = 1;
    window_rule_content_to_keep = ""; # Reset for each .chatbot-window rule instance
    next;
}
in_window_rule && /^\}/ {
    # Print any captured content for .chatbot-window (like transitions)
    if (window_rule_content_to_keep != "") {
        printf "%s", window_rule_content_to_keep;
    }
    print "    display: none; /* Base state: hidden, controlled by parent class */";
    print; # Print the closing brace } for .chatbot-window
    in_window_rule = 0;

    if (!window_rule_processed) { # Add new rules only once after the first .chatbot-window rule
        window_rule_processed = 1;
        print "";
        print "/* Chatbot window visibility controlled by parent container class */";
        print "#chatbot-container.chatbot-closed .chatbot-window {";
        print "    display: none;";
        print "    opacity: 0;";
        print "    transform: translateY(20px) scale(0.95);";
        print "    visibility: hidden;";
        print "}";
        print "";
        print "#chatbot-container.chatbot-open .chatbot-window {";
        print "    display: flex; /* Or block if preferred structure */";
        print "    opacity: 1;";
        print "    transform: translateY(0) scale(1);";
        print "    visibility: visible;";
        print "    transition: opacity var(--transition-normal, 0.3s ease), transform var(--transition-normal, 0.3s ease);";
        print "}";
    }
    next;
}
in_window_rule {
    # Properties to remove from the base .chatbot-window rule
    if ($0 ~ /^\s*opacity: 0;/ || \
        $0 ~ /^\s*transform: translateY\(20px\) scale\(0\.95\);/ || \
        $0 ~ /^\s*visibility: hidden;/) {
        next; # Skip these lines
    }
    # Keep other lines (like transition, or anything else)
    window_rule_content_to_keep = window_rule_content_to_keep $0 ORS;
    next;
}

# Default print for all other lines not handled by a 'next'
{ print }

END {
    # Fallback if .chatbot-window was entirely missing (should not happen if CSS was created correctly)
    if (!window_rule_processed) {
        print "";
        print "/* Chatbot window visibility controlled by parent container class (Fallback Append) */";
        print "#chatbot-container.chatbot-closed .chatbot-window {";
        print "    display: none;";
        print "    opacity: 0;";
        print "    transform: translateY(20px) scale(0.95);";
        print "    visibility: hidden;";
        print "}";
        print "";
        print "#chatbot-container.chatbot-open .chatbot-window {";
        print "    display: flex; /* Or block if preferred structure */";
        print "    opacity: 1;";
        print "    transform: translateY(0) scale(1);";
        print "    visibility: visible;";
        print "    transition: opacity var(--transition-normal, 0.3s ease), transform var(--transition-normal, 0.3s ease);";
        print "}";
    }
}
' "${CHATBOT_CSS_FILE}" > "${CHATBOT_CSS_FILE}.tmp" && mv "${CHATBOT_CSS_FILE}.tmp" "${CHATBOT_CSS_FILE}"
echo "Updated ${CHATBOT_CSS_FILE} for z-index and initial state display logic (Attempt 2)." | tee -a "${REFINEMENT_LOG}"


# --- 2. Remove inline style="display: none;" from chatbot HTML snippet in all files ---
# This part was successful, so it can be skipped if desired, but running again is harmless.
HTML_FILES_TO_MODIFY=(
    "index.html" "about.html" "practice-areas.html"
    "civil-litigation.html" "business-law.html" "technology-law.html" "general-practice.html"
    "resources.html" "contact.html"
    "blog/index.html"
    "blog/posts/Designer_Babies.html"
    "blog/posts/ai-regulation-implications.html"
    "blog/posts/template.html" # Blog post template
    "privacy-policy.html" "terms-of-use.html" "cookie-policy.html"
    "sitemap.html" "404.html" "search.html" "thank-you.html"
    "team/tim-harmar.html"
)

echo "Starting HTML inline style removal pass (Attempt 2, should be mostly no-ops)..." | tee -a "${REFINEMENT_LOG}"
for HTML_FILE in "${HTML_FILES_TO_MODIFY[@]}"; do
    if [ ! -f "$HTML_FILE" ]; then
        echo "WARNING: ${HTML_FILE} not found for HTML style removal, skipping." | tee -a "${REFINEMENT_LOG}"
        continue
    fi

    NEEDS_EDIT=$(grep -q 'id="chatbot-window"[^>]*style="display: none;"' "${HTML_FILE}" && echo "yes")

    if [ "$NEEDS_EDIT" = "yes" ]; then
        perl -i -pe 's/(id="chatbot-window"[^>]*?)\s*style="display:\s*none;"([^>]*)/$1$2/g' "${HTML_FILE}"
        echo "Removed inline 'display: none;' from chatbot window in ${HTML_FILE}" | tee -a "${REFINEMENT_LOG}"
    else
        echo "Inline 'display: none;' not found or already removed in ${HTML_FILE}" | tee -a "${REFINEMENT_LOG}"
    fi
done
echo "HTML inline style removal pass complete (Attempt 2)." | tee -a "${REFINEMENT_LOG}"


echo "--- Verifying changes (Attempt 2) ---"
echo "--- Relevant #chatbot-container CSS in ${CHATBOT_CSS_FILE} ---"
awk '/^#chatbot-container \{/,/^\}/' "${CHATBOT_CSS_FILE}"
echo "--- Relevant .chatbot-window CSS in ${CHATBOT_CSS_FILE} (should have display:none; and NOT opacity/transform/visibility directly) ---"
awk '/^\.chatbot-window \{/,/^\}/' "${CHATBOT_CSS_FILE}" # This will show the rule itself
echo "--- Rules for #chatbot-container.chatbot-closed .chatbot-window ---"
awk '/^#chatbot-container\.chatbot-closed \.chatbot-window \{/,/^\}/' "${CHATBOT_CSS_FILE}"
echo "--- Rules for #chatbot-container.chatbot-open .chatbot-window ---"
awk '/^#chatbot-container\.chatbot-open \.chatbot-window \{/,/^\}/' "${CHATBOT_CSS_FILE}"

echo "--- Checking index.html for removed inline style ---"
if [ -f "index.html" ]; then
    if grep -q 'id="chatbot-window"[^>]*style="display: none;"' "index.html"; then
        echo "ERROR: Inline style 'display: none;' still found in index.html:"
        grep --color=always 'id="chatbot-window"[^>]*style="display: none;"' index.html
    else
        echo "OK: Inline style 'display: none;' correctly removed from index.html."
        grep --color=always 'id="chatbot-window"' index.html
    fi
else
    echo "index.html not found for verification."
fi
