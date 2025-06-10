#!/bin/bash
# Stabilize civil-litigation.html by removing links to known missing JS files

TARGET_HTML_FILE="civil-litigation.html"
echo "--- Attempting to clean up script links in ${TARGET_HTML_FILE} ---"
cp "${TARGET_HTML_FILE}" "${TARGET_HTML_FILE}.script_cleanup.bak"

MISSING_JS_FILES=(
    "/js/enhanced-navigation.js"
    "/js/scroll-navigation.js"
    "/js/visual-integration.js"
    # Add any other JS files confirmed missing and specific to this page's old structure
)

# Use Perl for more robust line-by-line processing and removal
# Remove <link rel="preload" ...> for missing JS
# Remove <script src="..."></script> for missing JS

# Create a temporary file for perl script
echo "Reading ${TARGET_HTML_FILE} for modification..."
TEMP_PERL_SCRIPT="temp_clean_civil_scripts.pl"

cat << 'EOF' > $TEMP_PERL_SCRIPT
#!/usr/bin/perl
use strict;
use warnings;

my $file_path = $ARGV[0];
my @missing_js = map { quotemeta($_) } @ARGV[1 .. $#ARGV]; # Get missing JS files from arguments, quote meta
my $missing_js_pattern = join("|", @missing_js);

# Read the whole file
my $content = do {
    local $/ = undef;
    open my $fh, "<", $file_path or die "Cannot open $file_path: $!";
    <$fh>;
};

# Remove <link rel="preload" ...> for specific missing JS files
$content =~ s{<link\s+rel="preload"\s+href="($missing_js_pattern)"[^>]*>\s*}{}sg;

# Remove <script src="..."></script> for specific missing JS files
# Also match relative paths like "js/file.js" in addition to "/js/file.js"
$content =~ s{<script\s+src="(?:/)?($missing_js_pattern)"[^>]*></script>\s*}{}sg;

# Overwrite the original file
open my $fh_out, ">", $file_path or die "Cannot write to $file_path: $!";
print $fh_out $content;
close $fh_out;

print "Cleaned missing JS links from $file_path\n";
EOF

chmod +x $TEMP_PERL_SCRIPT

# Prepare arguments for perl script (filename first, then list of missing JS)
PERL_ARGS=("${TARGET_HTML_FILE}")
for js_file in "${MISSING_JS_FILES[@]}"; do
    PERL_ARGS+=("$js_file")
done

# Execute the perl script
./$TEMP_PERL_SCRIPT "${PERL_ARGS[@]}"

rm $TEMP_PERL_SCRIPT

echo "--- Verification: Grep for missing JS files in ${TARGET_HTML_FILE} (should find nothing) ---"
for js_file in "${MISSING_JS_FILES[@]}"; do
    # Strip leading / for grep pattern if js_file starts with /
    js_pattern_grep=${js_file#\/} # This removes leading /
    # Further strip js/ prefix for a more general grep
    js_pattern_grep=${js_pattern_grep#js\/}


    if grep -E "(\"|')${js_pattern_grep}(\"|')" "${TARGET_HTML_FILE}"; then
        echo "ERROR: Found reference to $js_file (checked as ${js_pattern_grep}) in ${TARGET_HTML_FILE} after cleanup attempt."
    else
        echo "OK: Reference to $js_file (checked as ${js_pattern_grep}) seems removed from ${TARGET_HTML_FILE}."
    fi
done

# cp "${TARGET_HTML_FILE}.script_cleanup.bak" "${TARGET_HTML_FILE}" # Restore if needed
