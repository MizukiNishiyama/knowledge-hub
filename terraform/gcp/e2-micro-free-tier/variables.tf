variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "Region used by provider (free tier eligible: us-west1, us-central1, us-east1)"
  type        = string
  default     = "us-central1"

  validation {
    condition     = contains(["us-west1", "us-central1", "us-east1"], var.region)
    error_message = "Always Free e2-micro eligible regions are us-west1/us-central1/us-east1."
  }
}

variable "zone" {
  description = "Zone for VM (e.g. us-central1-a)"
  type        = string
  default     = "us-central1-a"

  validation {
    condition     = can(regex("^us-(west1|central1|east1)-[a-z]$", var.zone))
    error_message = "Use a zone inside us-west1/us-central1/us-east1, e.g. us-central1-a."
  }
}

variable "vm_name" {
  description = "VM instance name"
  type        = string
  default     = "tf-e2-micro"
}

variable "machine_type" {
  description = "Keep e2-micro to stay in Always Free target"
  type        = string
  default     = "e2-micro"

  validation {
    condition     = var.machine_type == "e2-micro"
    error_message = "This module is intentionally constrained to e2-micro for low cost/free tier use."
  }
}

variable "boot_disk_size_gb" {
  description = "Boot disk size in GB. Keep <= 30 GB pd-standard to fit Always Free pool."
  type        = number
  default     = 30

  validation {
    condition     = var.boot_disk_size_gb > 0 && var.boot_disk_size_gb <= 30
    error_message = "Set boot_disk_size_gb between 1 and 30 to stay in Always Free HDD pool."
  }
}

variable "boot_image" {
  description = "Image family self link or image URL"
  type        = string
  default     = "projects/debian-cloud/global/images/family/debian-12"
}

variable "network" {
  description = "VPC network self link or name"
  type        = string
  default     = "default"
}

variable "subnetwork" {
  description = "Optional subnetwork self link or name"
  type        = string
  default     = null
}

variable "ssh_user" {
  description = "Username for metadata SSH key (used only when ssh_public_key is set)"
  type        = string
  default     = "terraform"
}

variable "ssh_public_key" {
  description = "Optional public key content (e.g. ssh-ed25519 AAAA... user@host)"
  type        = string
  default     = ""
}

variable "create_ssh_firewall" {
  description = "Create TCP/22 firewall rule"
  type        = bool
  default     = true
}

variable "ssh_source_cidr" {
  description = "CIDR allowed for SSH."
  type        = string
  default     = "0.0.0.0/0"
}

variable "login_user" {
  description = "Local Linux username for password SSH login"
  type        = string
  default     = "vmadmin"
}

variable "login_password_length" {
  description = "Generated login password length"
  type        = number
  default     = 24

  validation {
    condition     = var.login_password_length >= 16 && var.login_password_length <= 64
    error_message = "login_password_length must be between 16 and 64."
  }
}
