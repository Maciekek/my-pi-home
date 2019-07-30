module.exports = {
  apps : [
      {
        name: "run-pi",
        script: "./run-pi.sh",
        watch: true,
        env: {
          "NODE_ENV": "production",
        }
      }
  ]
}
