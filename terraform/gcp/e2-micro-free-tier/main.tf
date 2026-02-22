provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

resource "random_password" "vm_login" {
  length           = var.login_password_length
  special          = true
  override_special = "!@#$%^&*()-_=+"
}

locals {
  startup_script = <<-EOT
    #!/bin/bash
    set -euo pipefail

    USERNAME="${var.login_user}"
    PASSWORD="${random_password.vm_login.result}"

    if ! id -u "$USERNAME" >/dev/null 2>&1; then
      useradd -m -s /bin/bash "$USERNAME"
    fi

    usermod -aG sudo "$USERNAME" || true
    echo "$USERNAME:$PASSWORD" | chpasswd

    SSHD_CONFIG="/etc/ssh/sshd_config"
    if grep -Eq '^[# ]*PasswordAuthentication' "$SSHD_CONFIG"; then
      sed -i -E 's/^[# ]*PasswordAuthentication.*/PasswordAuthentication yes/' "$SSHD_CONFIG"
    else
      echo 'PasswordAuthentication yes' >> "$SSHD_CONFIG"
    fi

    if grep -Eq '^[# ]*KbdInteractiveAuthentication' "$SSHD_CONFIG"; then
      sed -i -E 's/^[# ]*KbdInteractiveAuthentication.*/KbdInteractiveAuthentication yes/' "$SSHD_CONFIG"
    else
      echo 'KbdInteractiveAuthentication yes' >> "$SSHD_CONFIG"
    fi

    if grep -Eq '^[# ]*ChallengeResponseAuthentication' "$SSHD_CONFIG"; then
      sed -i -E 's/^[# ]*ChallengeResponseAuthentication.*/ChallengeResponseAuthentication yes/' "$SSHD_CONFIG"
    else
      echo 'ChallengeResponseAuthentication yes' >> "$SSHD_CONFIG"
    fi

    if grep -Eq '^[# ]*UsePAM' "$SSHD_CONFIG"; then
      sed -i -E 's/^[# ]*UsePAM.*/UsePAM yes/' "$SSHD_CONFIG"
    else
      echo 'UsePAM yes' >> "$SSHD_CONFIG"
    fi

    systemctl restart ssh || systemctl restart sshd
  EOT

  base_metadata = {
    "enable-oslogin" = "FALSE"
    "startup-script" = local.startup_script
  }

  ssh_key_metadata = var.ssh_public_key == "" ? {} : {
    "ssh-keys" = "${var.ssh_user}:${var.ssh_public_key}"
  }
}

resource "google_compute_instance" "vm" {
  name         = var.vm_name
  machine_type = var.machine_type
  zone         = var.zone

  tags = var.create_ssh_firewall ? ["ssh"] : []

  boot_disk {
    initialize_params {
      image = var.boot_image
      type  = "pd-standard"
      size  = var.boot_disk_size_gb
    }
    auto_delete = true
  }

  network_interface {
    network    = var.network
    subnetwork = var.subnetwork

    # Ephemeral external IP. Do not reserve static IP to avoid extra cost.
    access_config {}
  }

  metadata = merge(local.base_metadata, local.ssh_key_metadata)

  allow_stopping_for_update = true
  deletion_protection       = false
}

resource "google_compute_firewall" "allow_ssh" {
  count = var.create_ssh_firewall ? 1 : 0

  name    = "${var.vm_name}-allow-ssh"
  network = var.network

  direction     = "INGRESS"
  source_ranges = [var.ssh_source_cidr]
  target_tags   = ["ssh"]

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }
}
