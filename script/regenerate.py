#!/usr/bin/env python

import os
import re
import toml
import subprocess

file = "new-keypair.json"

shell = ['solana-keygen', 'new', '-s','--force', '--no-bip39-passphrase', '-o', file]
result1 = subprocess.run(shell, capture_output=True, text=True)
print(result1.stdout)

cpshell = ['cp', '-f', file, '../target/deploy/solana_nft_anchor-keypair.json']
subprocess.run(cpshell, capture_output=True, text=True)

solanashell = ['solana','address', '-k', file]
result2 = subprocess.run(solanashell, capture_output=True, text=True)

addr = result2.stdout.replace("\n", "")
print("addr:", addr)

declare_id_regex = r"^(([\w]+::)*)declare_id!\(\"(\w*)\"\)"

rsfile = "../programs/solana-nft-anchor/src/lib.rs"
with open(rsfile, 'r') as file:
    libdata = file.read()
    subst = f'declare_id!("{addr}")'
    libresult = re.sub(declare_id_regex, subst, libdata, 0, re.MULTILINE)

with open(rsfile, 'w') as output_file:
    output_file.write(libresult)

tomlfile = "../Anchor.toml"
with open(tomlfile, 'r') as file:
   tomldata = toml.load(file)

tomldata['programs']['localnet']['solana_nft_anchor'] = addr

with open(tomlfile, 'w') as file:
    toml.dump(tomldata, file)
