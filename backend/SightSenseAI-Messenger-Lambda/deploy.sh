#!/bin/bash

if [ -f messenger-lambda-deploy.zip ]; then
  echo "Removing existing zip..."
  rm messenger-lambda-deploy.zip
fi

echo "Creating messenger-lambda-deploy.zip..."

zip -r messenger-lambda-deploy.zip ./

echo "Deployment package created successfully!"
