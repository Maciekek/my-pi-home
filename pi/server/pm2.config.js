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
        name: "run-pi-contact-sensor",
        script: "./run-contact-sensor.sh",
        watch: true,
        env: {
          "NODE_ENV": "production",
        }
      }
  ]
}
