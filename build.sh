#!/usr/bin/env bash
set -e
source .env

TESTINGAPP_PATH="$(echo $TESTINGAPP_PATH | tr -d '\r')"
KRAVAPP_PATH="$(echo $KRAVAPP_PATH | tr -d '\r')"
LOEYSINGSREGISTERAPP_PATH="$(echo $LOEYSINGSREGISTERAPP_PATH | tr -d '\r')"
RESULTATREGISTERAPP_PATH="$(echo $RESULTATREGISTERAPP_PATH | tr -d '\r')"

BASE="$(pwd )"

echo "LOEYSINGSREGISTER_PATH: $LOEYSINGSREGISTERAPP_PATH"
echo "TESTINGAPP_PATH: $TESTINGAPP_PATH"
echo "KRAVAPP_PATH: $KRAVAPP_PATH"
echo "RESULTATREGISTERAPP_PATH: $RESULTATREGISTERAPP_PATH"
# shellcheck disable=SC2086
echo $LOEYSINGSREGISTERAPP_PATH

echo "$BASE"

buildFrontend() {
    echo "Building Frontend"
    pwd
    mvn install -DskipTests
     mvn jib:dockerBuild
    echo "Frontend built successfully"
}

buildReact() {
    echo "Building React"
    pwd
    cd $BASE/frontend
    npm ci
    npm run build
    cd ..
    echo "React built successfully"
}



buildTesting() {
    echo "Building Testing App"
    cd $TESTINGAPP_PATH
    pwd
    mvn install -DskipTests
    echo "Testing App built successfully"
    echo "Build local testing-image"
    mvn jib:dockerBuild
}

buildKrav() {
    echo "Building Krav"
    cd $KRAVAPP_PATH
    pwd
    mvn install -DskipTests
    echo "Krav built successfully"
    echo "Build local krav-image"
    mvn jib:dockerBuild
}

buildLoeysingsregister() {
    echo "Building Loeysingsregister"
    cd $LOEYSINGSREGISTERAPP_PATH
    pwd
    mvn install -DskipTests
    echo "Loeysingsregister built successfully"
    echo "Build local loeysingsregister-image"
    mvn jib:dockerBuild
}

buildResultatregister() {
    echo "Building Resultatregister"
    cd $RESULTATREGISTERAPP_PATH
    pwd
    mvn install -DskipTests
    echo "Resultatregister built successfully"
    echo "Build local resultatregister-image"
    mvn jib:dockerBuild
}

#buildKrav
#buildLoeysingsregister
#buildTesting
#buildReact
#buildFrontend
buildResultatregister