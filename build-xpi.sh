#!/bin/bash
set -e

# Define output name
OUTPUT="marklink.xpi"

# Remove old build
rm -f "$OUTPUT"

# Zip the contents of src/ and any other needed files
cd src
zip -r "../$OUTPUT" ./*
cd ..

echo "Created $OUTPUT"
