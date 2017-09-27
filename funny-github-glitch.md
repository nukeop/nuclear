Yes, this wasn't really contributed by Samy Kamkar.

If you set somebody's username and email in git config as the same values another Github user has, which in some cases might be public knowledge, you can then commit as that user. If that user additionally happened to have starred your repo, it will actually **show on his profile page and count towards his yearly contributions**.

Github uses a mechanism that doesn't provide reliable authentication to do authentication.

More details on why this is possible here: [https://help.github.com/articles/why-are-my-contributions-not-showing-up-on-my-profile/][645a5c70]

  [645a5c70]: https://help.github.com/articles/why-are-my-contributions-not-showing-up-on-my-profile/ "https://help.github.com/articles/why-are-my-contributions-not-showing-up-on-my-profile/"
