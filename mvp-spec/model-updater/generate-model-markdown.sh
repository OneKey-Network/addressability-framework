#sh

BASEDIR=$(dirname "$0")
TMP_DIR="tmp-schemas"

# Because generate-schema-doc only supports relative paths
cd "$BASEDIR" || exit

# Move all the schemas in a temporary directory
# It allows to fetch schemas from different directory
# and simplifies the inner references between them.
if [ -d ${TMP_DIR} ]; then 
  rm -Rf ${TMP_DIR};
fi
mkdir ${TMP_DIR}
find "../json-schemas" -name "*.json" \
    -exec cp {} ${TMP_DIR} \;

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
