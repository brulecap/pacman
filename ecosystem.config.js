module.exports = {
  apps : [{
    name   : "pacman",
    script : "./server.js",
    env: {"PORT": 8080, "BASE":"http://www.brucelecaptain.com/pacman/"}
  }]
}
