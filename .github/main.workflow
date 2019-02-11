workflow "Build and test on push" {
  on = "push"
  resolves = ["GitHub Action for npm-4"]
}

action "GitHub Action for npm" {
  uses = "actions/npm@4633da3702a5366129dca9d8cc3191476fc3433c"
  args = "install"
}

action "Filters for GitHub Actions" {
  uses = "actions/bin/filter@ec328c7554cbb19d9277fc671cf01ec7c661cd9a"
}

action "GitHub Action for npm-1" {
  uses = "actions/npm@4633da3702a5366129dca9d8cc3191476fc3433c"
  needs = ["GitHub Action for npm"]
  args = "test"
}

action "GitHub Action for npm-2" {
  uses = "actions/npm@4633da3702a5366129dca9d8cc3191476fc3433c"
  needs = ["GitHub Action for npm-1"]
  args = "run build:dist"
}

action "GitHub Action for npm-3" {
  uses = "actions/npm@4633da3702a5366129dca9d8cc3191476fc3433c"
  needs = ["GitHub Action for npm-2"]
  args = "run build:electron"
}

action "GitHub Action for npm-4" {
  uses = "actions/npm@4633da3702a5366129dca9d8cc3191476fc3433c"
  needs = ["GitHub Action for npm-3"]
  args = "run build:all"
}
