
# Expand env vars and start Prometheus
envsubst < prometheus.yml > prometheus.generated.yml
./prometheus --config.file=prometheus.generated.yml
