module.exports = {
  apps : [{
    name   : "pacman",
    script : "./server.js",
    env: {"PORT": 8080, "BASE":"https://brucelecaptain.com/pacman/", "HOMEURL":"https://brucelecaptain.com"}
  }]
}
