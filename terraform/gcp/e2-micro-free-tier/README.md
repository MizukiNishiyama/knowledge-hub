# GCP e2-micro (low-cost / Always Free conscious) with Terraform

This directory provisions one Compute Engine VM tuned to stay inside GCP Always Free conditions as much as possible:

- machine type fixed to `e2-micro`
- region/zone constrained to `us-west1`, `us-central1`, or `us-east1`
- boot disk uses `pd-standard` with max `30 GB`
- ephemeral external IP (no reserved static address)

## 1) Prerequisites

- Terraform >= 1.5
- GCP project with billing enabled
- APIs enabled:
  - `compute.googleapis.com`
- Auth configured for Terraform (ADC):

```bash
gcloud auth application-default login
gcloud config set project <YOUR_PROJECT_ID>
```

## 2) Configure

```bash
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` and set at least:

- `project_id`
- `login_user`

## 3) Deploy

```bash
terraform init
terraform fmt -recursive
terraform validate
terraform plan
terraform apply
```

## 4) Connect

```bash
gcloud compute ssh tf-e2-micro --zone=us-central1-a
```

Or use `output.ssh_command` value.

Password SSH info:

```bash
terraform output password_ssh_user
terraform output -raw password_ssh_password
ssh <password_ssh_user>@<instance_external_ip>
```

## 5) Destroy (to avoid unexpected costs)

```bash
terraform destroy
```

## Cost notes

Always Free applies only within specific limits and regions and may change over time.
If you use Terraform CLI 1.5.x, keep provider on google 6.x. google provider 7.x may require a newer Terraform CLI.
Charges can occur if you exceed free quotas (disk size, network egress, non-free regions/images, additional resources, etc.).

Security note: password authentication is weaker than SSH key + source IP restriction. Keep a strong password and rotate frequently.
