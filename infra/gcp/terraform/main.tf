terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_compute_network" "synapse" {
  name                    = "synapse-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "primary" {
  name          = "synapse-subnet"
  ip_cidr_range = var.subnet_cidr
  network       = google_compute_network.synapse.id
  region        = var.region
}

resource "google_container_cluster" "governance" {
  name     = "synapse-gke"
  location = var.region
  network  = google_compute_network.synapse.name
  subnetwork = google_compute_subnetwork.primary.name

  remove_default_node_pool = true
  initial_node_count       = 1
}

resource "google_container_node_pool" "primary" {
  name       = "primary-pool"
  location   = var.region
  cluster    = google_container_cluster.governance.name
  node_count = 2

  node_config {
    machine_type = "e2-standard-2"
    oauth_scopes = ["https://www.googleapis.com/auth/cloud-platform"]
  }
}
