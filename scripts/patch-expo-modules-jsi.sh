#!/bin/sh
# Swift 6.2 (Xcode 26+) compatibility patches for expo-modules-jsi.
# Remove this script once expo-modules-jsi ships the fix upstream.
set -e

JSI_DIR="node_modules/expo-modules-jsi/apple/Sources/ExpoModulesJSI"
if [ ! -d "$JSI_DIR" ]; then
  exit 0
fi

# Swift 6.2 requires weak references to be `var`, not `let`.
find "$JSI_DIR" -name "*.swift" -exec sed -i '' 's/weak let runtime/weak var runtime/g' {} +

# Sendable classes cannot have mutable stored properties unless marked unsafe.
for file in \
  "$JSI_DIR/Contexts/HostFunctionContext.swift" \
  "$JSI_DIR/Contexts/HostObjectContext.swift" \
  "$JSI_DIR/Runtime/JavaScriptPropNameID.swift" \
  "$JSI_DIR/Runtime/Values/JavaScriptValue.swift"
do
  if [ -f "$file" ]; then
    sed -i '' 's/weak var runtime/nonisolated(unsafe) weak var runtime/g' "$file"
  fi
done
