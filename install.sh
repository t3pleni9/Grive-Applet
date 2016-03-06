#! /bin/bash

export TRGDIR="$HOME/.local/share/cinnamon/applets/";

command -v grive >/dev/null 2>&1 || { echo >&2 "Grive required, but not installed.  Aborting."; exit 1; }
export DIRECTORY="grive-sync@t3pleni9.com"
if [ ! -d "$TRGDIR" ]; then
  echo >&2 "Applet directory not found. Aborting.";
  exit 1;
fi

if [ -d "$DIRECTORY" ]; then
  echo >&2 "Installing applet to $TRGDIR$DIRECTORY";
  cp -r $DIRECTORY $TRGDIR
else
  echo >&2 "Applet folder '$DIRECTORY' not found. Aborting.";
  exit 1;
fi

