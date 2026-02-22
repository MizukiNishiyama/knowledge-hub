output "instance_name" {
  value = google_compute_instance.vm.name
}

output "instance_zone" {
  value = google_compute_instance.vm.zone
}

output "instance_external_ip" {
  value = try(google_compute_instance.vm.network_interface[0].access_config[0].nat_ip, null)
}

output "ssh_command" {
  value = "gcloud compute ssh ${google_compute_instance.vm.name} --zone=${google_compute_instance.vm.zone}"
}

output "password_ssh_user" {
  value = var.login_user
}

output "password_ssh_password" {
  value     = random_password.vm_login.result
  sensitive = true
}
