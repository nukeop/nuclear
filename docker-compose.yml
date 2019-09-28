version: '3.7'
services:

  install:
    build:
      context: .
      dockerfile: ./Dockerfile.dev
    volumes:
    - .:/nuclear
    working_dir: /nuclear
    command: bash -xc "
      lerna bootstrap"

  dev:
    build:
      context: .
      dockerfile: ./Dockerfile.dev
    depends_on:
      - install
    volumes:
      - /tmp/.X11-unix:/tmp/.X11-unix
      - .:/nuclear
    working_dir: /nuclear
    command: bash -xc "
      lerna bootstrap;
      lerna exec npm rebuild node-sass;
      lerna run start "
    devices:
      - "/dev/snd"
    environment:
      - DISPLAY
      - HOME
    network_mode: host
    ipc: host
