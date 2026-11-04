#!/bin/sh
# Installed as a root-owned script on the VPS; changes require manual review.
set -eu

if [ "$#" -ne 1 ] || ! printf '%s\n' "$1" | grep -Eq '^[0-9a-f]{40}-[0-9]+-[0-9]+$'; then
  echo 'Invalid release identifier' >&2
  exit 1
fi

release="/srv/svuis-deploy/releases/$1"
current=/var/www/svuis-current
if [ -L "$release" ] || [ ! -d "$release" ] || [ ! -f "$release/index.html" ] || [ ! -L "$current" ]; then
  echo 'Release or current deployment is invalid' >&2
  exit 1
fi

exec 9>/run/lock/svuis-dashboard-deploy.lock
flock -x 9
previous=$(readlink -f "$current")
test -d "$previous"
tmp="/var/www/.svuis-current-$$"
trap 'rm -f "$tmp"' EXIT HUP INT TERM
ln -s "$release" "$tmp"
mv -Tf "$tmp" "$current"

if [ "$(curl -fsS --max-time 15 --resolve svuis.duckdns.org:443:127.0.0.1 https://svuis.duckdns.org/__deploy_version || true)" != "$1" ]; then
  echo 'Deployment check failed; restoring previous release' >&2
  ln -s "$previous" "$tmp"
  mv -Tf "$tmp" "$current"
  exit 1
fi
echo 'Dashboard deployment verified'
