#!/bin/bash
# Setup Gradle signing for release builds in CI
# Called by GitHub Actions workflow before assembleRelease/bundleRelease
set -e

KEYSTORE_FILE="app/phoneide-release.keystore"

# Decode keystore from GitHub secret
if [ -n "$ANDROID_KEYSTORE" ]; then
  echo "$ANDROID_KEYSTORE" | base64 -d > "$KEYSTORE_FILE"
  echo "✅ Keystore decoded"
else
  echo "⚠️  No ANDROID_KEYSTORE secret found — release builds will fail"
  exit 1
fi

# Write Gradle signing config
cat > "keystore.properties" << EOF
storeFile=phoneide-release.keystore
storePassword=${ANDROID_STORE_PASSWORD}
keyAlias=${ANDROID_KEY_ALIAS:-phoneide}
keyPassword=${ANDROID_KEY_PASSWORD}
EOF

echo "✅ Gradle signing configured"
