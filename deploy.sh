#!/bin/bash

if [ ! $# == 1 ]; then
  echo "Usage: $0 {staging,production}"
  exit
fi

target="$1"

if [ $target == "production" ] ; then
  echo "Deploying to http://tennant-creek.theglobalmail.org"
  grunt build
  s3cmd sync -P dist/ s3://tennant-creek.theglobalmail.org
fi

grunt clean:dist