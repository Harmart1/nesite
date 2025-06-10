#!/bin/bash

echo "--- Starting Chatbot Integration ---"
INTEGRATION_LOG="chatbot_integration.log"
>"${INTEGRATION_LOG}"

# --- 1. Define Chatbot HTML Structure (from chatbot_markup.html or directly) ---
CHATBOT_HTML_SNIPPET_FILE="chatbot_markup.html" # This was the output file in the subtask report

if [ -f "$CHATBOT_HTML_SNIPPET_FILE" ]; then
    CHATBOT_HTML_SNIPPET=$(cat "$CHATBOT_HTML_SNIPPET_FILE")
    echo "Read chatbot HTML from ${CHATBOT_HTML_SNIPPET_FILE}"
else
    echo "WARNING: ${CHATBOT_HTML_SNIPPET_FILE} not found. Using embedded HTML structure." | tee -a "${INTEGRATION_LOG}"
    # Fallback to embedded HTML (ensure this matches the one defined previously)
CHATBOT_HTML_SNIPPET='<!-- Chatbot Container -->
<div id="chatbot-container" class="chatbot-closed"> <!-- Initially closed -->
    <!-- Floating Action Button to open chat -->
    <button id="chatbot-fab" class="chatbot-fab" aria-label="Open Chat" type="button">
        <i class="fas fa-comments" aria-hidden="true"></i>
        <span class="sr-only">Open Chat</span>
    </button>

    <!-- Chat Window -->
    <div id="chatbot-window" class="chatbot-window" role="dialog" aria-modal="true" aria-labelledby="chatbot-header-title" style="display: none;">
        <div class="chatbot-header">
            <h3 id="chatbot-header-title" class="chatbot-title">How can we help?</h3>
            <button id="chatbot-close-btn" class="chatbot-close-btn" aria-label="Close Chat" type="button">
                <i class="fas fa-times" aria-hidden="true"></i>
                <span class="sr-only">Close Chat</span>
            </button>
        </div>
        <div id="chatbot-messages" class="chatbot-messages" role="log" aria-live="polite">
            <!-- Messages will be populated by JavaScript -->
        </div>
        <div id="chatbot-questions-area" class="chatbot-questions-area">
            <!-- Predefined question buttons will be populated by JavaScript -->
        </div>
        <div class="chatbot-footer">
            <p class="text-xs text-muted">NorthernEdge Assistant</p>
        </div>
    </div>
</div>'
fi

# --- 2. Define list of HTML files ---
HTML_FILES_TO_MODIFY=(
    "index.html" "about.html" "practice-areas.html"
    "civil-litigation.html" "business-law.html" "technology-law.html" "general-practice.html"
    "resources.html" "contact.html"
    "blog/index.html"
    "blog/posts/Designer_Babies.html"
    "blog/posts/ai-regulation-implications.html"
    "blog/posts/template.html" # This is a blog post template
    "privacy-policy.html" "terms-of-use.html" "cookie-policy.html" # Added cookie-policy
    "sitemap.html" "404.html" "search.html" "thank-you.html" # Added thank-you
    "team/tim-harmar.html"
    # Add other specific HTML files as needed, e.g. team pages if they exist
)

# --- 3. Process each HTML file ---
for HTML_FILE in "${HTML_FILES_TO_MODIFY[@]}"; do
    if [ ! -f "$HTML_FILE" ]; then
        echo "WARNING: ${HTML_FILE} not found, skipping." | tee -a "${INTEGRATION_LOG}"
        continue
    fi
    echo "Processing ${HTML_FILE}..."
    # Create a backup copy
    cp "${HTML_FILE}" "${HTML_FILE}.chatbot_bak"

    # --- 3a. Inject CSS Link into <head> ---
    if ! grep -q '<link rel="stylesheet" href="/css/chatbot.css">' "${HTML_FILE}"; then
        # Using awk to insert before </head>
        awk '
        /<\/head>/ {
            print "    <link rel=\"stylesheet\" href=\"/css/chatbot.css\">";
        }
        { print }
        ' "${HTML_FILE}" > "${HTML_FILE}.tmp" && mv "${HTML_FILE}.tmp" "${HTML_FILE}"
        echo "Added chatbot.css link to ${HTML_FILE}" | tee -a "${INTEGRATION_LOG}"
    else
        echo "Chatbot.css link already present in ${HTML_FILE}" | tee -a "${INTEGRATION_LOG}"
    fi

    # --- 3b. Inject Chatbot HTML Snippet before </body> ---
    if ! grep -q 'id="chatbot-container"' "${HTML_FILE}"; then
        echo "$CHATBOT_HTML_SNIPPET" > chatbot_snippet_temp.html
        awk '
        NR==FNR { chatbot_html = chatbot_html $0 ORS; next }
        /<\/body>/ {
            # Remove trailing newline from chatbot_html before printing
            sub(/\n$/, "", chatbot_html);
            print chatbot_html;
        }
        { print }
        ' chatbot_snippet_temp.html "${HTML_FILE}" > "${HTML_FILE}.tmp" && mv "${HTML_FILE}.tmp" "${HTML_FILE}"
        rm chatbot_snippet_temp.html
        echo "Added chatbot HTML snippet to ${HTML_FILE}" | tee -a "${INTEGRATION_LOG}"
    else
        echo "Chatbot HTML snippet already present in ${HTML_FILE}" | tee -a "${INTEGRATION_LOG}"
    fi

    # --- 3c. Inject JS Link ---
    # Try to insert before a known last script, or just before </body> if that fails
    # Common last scripts: cookie-consent.js, or sometimes main.js if it's the only one.
    # A more robust way might be to find the last <script> tag before </body>
    # or a specific comment block like "<!-- Standard Footer Scripts -->"

    KNOWN_FOOTER_SCRIPTS_COMMENT="<!-- Core JavaScript files deferred for performance -->"
    COOKIE_CONSENT_SCRIPT_COMMENT="<!-- Cookie Consent Script -->"
    CHATBOT_JS_LINE='    <script src="/js/chatbot.js" defer></script>'

    if ! grep -q '<script src="/js/chatbot.js" defer></script>' "${HTML_FILE}"; then
        # Attempt 1: Insert before Cookie Consent Script comment
        if grep -q "$COOKIE_CONSENT_SCRIPT_COMMENT" "${HTML_FILE}"; then
            awk -v js_link="$CHATBOT_JS_LINE" -v comment_marker="$COOKIE_CONSENT_SCRIPT_COMMENT" '
            $0 ~ comment_marker { print js_link; }
            { print }
            ' "${HTML_FILE}" > "${HTML_FILE}.tmp" && mv "${HTML_FILE}.tmp" "${HTML_FILE}"
            echo "Added chatbot.js link before Cookie Consent comment in ${HTML_FILE}" | tee -a "${INTEGRATION_LOG}"
        # Attempt 2: If no cookie script comment, try before </body> if a known footer scripts block exists
        elif grep -q "$KNOWN_FOOTER_SCRIPTS_COMMENT" "${HTML_FILE}"; then
             awk -v js_link="$CHATBOT_JS_LINE" '
             /<\/body>/ { print js_link; } # Fallback: just before body end
             { print }
             ' "${HTML_FILE}" > "${HTML_FILE}.tmp" && mv "${HTML_FILE}.tmp" "${HTML_FILE}"
             echo "Added chatbot.js link before </body> (after finding standard script block comment) in ${HTML_FILE}" | tee -a "${INTEGRATION_LOG}"
        # Attempt 3: Fallback - just before </body>
        else
            awk -v js_link="$CHATBOT_JS_LINE" '
            /<\/body>/ { print js_link; }
            { print }
            ' "${HTML_FILE}" > "${HTML_FILE}.tmp" && mv "${HTML_FILE}.tmp" "${HTML_FILE}"
            echo "Added chatbot.js link before </body> (fallback) in ${HTML_FILE}" | tee -a "${INTEGRATION_LOG}"
        fi
    else
        echo "Chatbot.js link already present in ${HTML_FILE}" | tee -a "${INTEGRATION_LOG}"
    fi
done

echo "--- Chatbot Integration Complete ---"
echo "Review ${INTEGRATION_LOG} for details."

# Verification for one file
echo "--- Verifying index.html ---"
if [ -f "index.html" ]; then
    grep --color=always '<link rel="stylesheet" href="/css/chatbot.css">' index.html
    grep --color=always 'id="chatbot-container"' index.html
    grep --color=always '<script src="/js/chatbot.js" defer></script>' index.html
else
    echo "index.html not found for verification."
fi
echo "--- End of index.html verification ---"
