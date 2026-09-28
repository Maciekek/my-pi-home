module.exports = {
  apps : [
      {
        name: "run-pi",
        script: "./run-pi.sh",
        watch: true,
        env: {
          "NODE_ENV": "production",
        }
      },
      {
        name: "run-pi-wifi-metrics",
        script: "./run-wifi-metrics.sh",
        watch: true,
        env: {
          "NODE_ENV": "production",
        }
      }
  ]
}
