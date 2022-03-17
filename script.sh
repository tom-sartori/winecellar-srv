#!/bin/sh

#f1 = objectSource
#$2 = source
#$3 = objectTarger
#$4 = target


firstUpper=$2
firstUpper="$(tr '[:lower:]' '[:upper:]' <<< ${firstUpper:0:1})${firstUpper:1}"

secUpper=$4
secUpper="$(tr '[:lower:]' '[:upper:]' <<< ${secUpper:0:1})${secUpper:1}"



firstControllerPath="./app/controllers/$1/$2.controller.js"
secControllerPath="./app/controllers/$3/$4.controller.js"

firstModelPath="./app/models/$1/$2.model.js"
secModelPath="./app/models/$3/$4.model.js"

firstRoutePath="./app/routes/$1/$2.routes.js"
secRoutePath="./app/routes/$3/$4.routes.js"


cp $firstControllerPath $secControllerPath
cp $firstModelPath $secModelPath
cp $firstRoutePath $secRoutePath



gsed -i "s/$2/$4/g" $secControllerPath
gsed -i "s/$firstUpper/$secUpper/g" $secControllerPath

gsed -i "s/$2/$4/g" $secModelPath
gsed -i "s/$firstUpper/$secUpper/g" $secModelPath

gsed -i "s/$2/$4/g" $secRoutePath
gsed -i "s/$firstUpper/$secUpper/g" $secRoutePath
