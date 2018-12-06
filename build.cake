#addin nuget:?package=Cake.Yaml&version=2.1.0
#addin nuget:?package=YamlDotNet&version=4.2.1
#addin nuget:?package=Cake.Git

var DefaultTarget = Argument("target", "Default");

Task("Default")
    .Does(() =>
{
    var lastCommit = GitLogTip(".");

    Information(@"Last commit {0}
        Short message: {1}
        Author:        {2}
        Authored:      {3:yyyy-MM-dd HH:mm:ss}
        Committer:     {4}
        Committed:     {5:yyyy-MM-dd HH:mm:ss}",
        lastCommit.Sha,
        lastCommit.MessageShort,
        lastCommit.Author.Name,
        lastCommit.Author.When,
        lastCommit.Committer.Name,
        lastCommit.Committer.When
    );

    var diff = GitDiff(".", "HEAD^");
    foreach (var file in diff)
    {
        Information(file);
    }
});

RunTarget(DefaultTarget);