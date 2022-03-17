#sh

BASEDIR=$(dirname "$0")

# Because generate-schema-doc only supports relative paths
cd "$BASEDIR" || exit

generate-schema-doc \
  --config custom_template_path="./json-schema-templates/base.md" \
  --config show_breadcrumbs=false \
  --config show_toc=false \
  --config show_array_restrictions=false \
  --config badge_as_image=true \
  --config show_heading_numbers=false \
  ${TMP_DIR} \
  "../model/"

rm -Rf ${TMP_DIR};
