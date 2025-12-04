# DigitalOcean Droplet Rescue / Setup Guide

**Use Case:** Setting up a fresh droplet or regaining access when local SSH is failing. **Method:** Using the DigitalOcean Web Console (Root Access).

## Prerequisites

1. **Log in to DigitalOcean Dashboard.**
2. **Select Droplet:** Click on your droplet (e.g., `wade-usa`).
3. **Launch Console:** Go to `Access` -> `Launch Droplet Console`.
4. **Login as Root:** If asked, log in as `root`. (If you don't know the password, use the "Reset Root Password" button in the Access menu first).

## Step 1: Update System & Create User

*Run these commands inside the Web Console.*

```bash
# 1. Update system lists and upgrade packages
apt update && apt upgrade -y

# 2. Create the new user (replace 'wade' with your username)
adduser wade
# (Follow the prompts to set a password. You can leave name/phone fields blank.)

# 3. Grant administrative (sudo) privileges
usermod -aG sudo wade
```

## Step 2: Create Swap File (Critical for 2GB RAM)

*Prevent database crashes by adding virtual memory.*

```bash
# 1. Allocate 4GB of space
fallocate -l 4G /swapfile

# 2. Set permissions (only root can read)
chmod 600 /swapfile

# 3. Mark and enable swap
mkswap /swapfile
swapon /swapfile

# 4. Make it permanent
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# 5. Verify it worked (Look for 'Swap' line)
free -h
```

## Step 3: Setup SSH Keys (The Manual "Bridge")

*Since `ssh-copy-id` fails without a password, we paste the key manually.*

**A. On your LOCAL Machine:**

1. Open your terminal.
2. Run: `cat ~/.ssh/id_rsa.pub` (or `id_rsa.pub`).
3. **Copy** the entire output string (starts with `ssh-...`).

**B. On the Web Console (Server):**

```bash
# 1. Switch to the new user
su - wade

# 2. Create the SSH folder
mkdir -p ~/.ssh

# 3. Open a file editor
nano ~/.ssh/authorized_keys
```

1. **Paste** your copied public key into the editor.
2. **Save:** Press `Ctrl+O`, then `Enter`.
3. **Exit:** Press `Ctrl+X`.

```bash
# 7. Secure the file permissions (CRITICAL)
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# 8. Exit back to root
exit
```

## Step 4: Firewall Setup

*Lock the doors, but leave the windows open for the web.*

```bash
# 1. Set rules
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp

# 2. Enable Firewall
ufw enable
# (Type 'y' to confirm)
```

## Step 5: The Safety Check (DO NOT SKIP)

**STOP HERE.** Do not disable passwords yet.

1. Leave the Web Console open.
2. Open your **Local Terminal**.
3. Try to connect: `ssh wade@<YOUR_IP_ADDRESS>`

- **If you get in:** Proceed to Step 6.
- **If you get "Permission Denied":** Go back to Step 3 and fix the key. **Do not proceed** or you will lock yourself out.

## Step 6: Final Lockdown

*Only do this after Step 5 is successful.*

**In the Web Console:**

```bash
# 1. Edit SSH Config
nano /etc/ssh/sshd_config
```

**Find and change these lines:**

- `PermitRootLogin no`
- `PasswordAuthentication no`
- `PubkeyAuthentication yes`

**Save and Restart:**

1. Save: `Ctrl+O`, `Enter`.

2. Exit: `Ctrl+X`.

3. Restart SSH:

   ```bash
   systemctl restart ssh
   ```

**Setup Complete.** You can now close the Web Console and work exclusively from your local terminal.

LEAVING SSH: exit