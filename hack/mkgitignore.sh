#!/bin/bash

# npm prune --prod

sed -i '/!node_modules.*/d' .gitignore

packages=$(/bin/ls -1 node_modules | sed '/@types/d')

for pkg in $packages; do
    echo "!node_modules/$pkg" >> .gitignore
done

# npm i