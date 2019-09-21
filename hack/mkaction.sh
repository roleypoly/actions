#!/bin/sh
set -eu

ACTION_NAME=${1:-}

test -z "$ACTION_NAME" && {
  echo "no action name specified";
  exit 1
}

stat "./$ACTION_NAME" >/dev/null 2>/dev/null && {
  echo "$ACTION_NAME already exists."
  exit 1
}

mkdir "./$ACTION_NAME"
printf "name: %s\nruns:\n  using: 'node12'\n  main: '../lib/%s/%s.js'\n" "$ACTION_NAME" "$ACTION_NAME" "$ACTION_NAME" | tee "$ACTION_NAME/action.yml"

mkdir "./src/$ACTION_NAME"
printf "export const run = () => console.log('hello world!');\n\n run()" | tee "src/$ACTION_NAME/$ACTION_NAME.ts"

npm run prettier
npm run build