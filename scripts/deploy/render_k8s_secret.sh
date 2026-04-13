#!/usr/bin/env bash
set -euo pipefail

: "${NAMESPACE:=default}"
: "${SECRET_NAME:=governance-secrets}"
: "${DATABASE_URL:?Set DATABASE_URL}"
: "${NEO4J_URI:?Set NEO4J_URI}"
: "${NEO4J_USER:?Set NEO4J_USER}"
: "${NEO4J_PASSWORD:?Set NEO4J_PASSWORD}"

kubectl -n "$NAMESPACE" create secret generic "$SECRET_NAME" \
  --from-literal=database_url="$DATABASE_URL" \
  --from-literal=neo4j_uri="$NEO4J_URI" \
  --from-literal=neo4j_user="$NEO4J_USER" \
  --from-literal=neo4j_password="$NEO4J_PASSWORD" \
  --dry-run=client -o yaml | kubectl apply -f -

echo "Secret ${SECRET_NAME} applied to namespace ${NAMESPACE}."
