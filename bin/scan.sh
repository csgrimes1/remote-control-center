#!/usr/bin/env bash

arp \
  | grep -v 'docker.$' \
  | grep -v 'Iface$' \
  | grep -v '^gateway' \
  | cut -f1 -d' '
