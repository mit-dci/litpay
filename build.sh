#!/bin/bash
docker build -f Dockerfile.watcher . -t litpay-watcher
docker build -f Dockerfile.webapp . -t litpay-webapp

