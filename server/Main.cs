using System.Security.AccessControl;
using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.IO;

bool Contains(DirectoryInfo first, DirectoryInfo second) {
    while (second.Parent != null) {
        if (second.FullName == first.FullName) {
            return true;
        } else {
            second = second.Parent;
        }
    }

    return false;
}

try {
    var root = new DirectoryInfo(Path.Combine(Environment.CurrentDirectory, "public"));
    var prefix = "http://*:80/";
    Console.WriteLine("Use prefix: " + prefix);

    var httpListener = new HttpListener();
    httpListener.Prefixes.Add(prefix);
    httpListener.Start();

    while (true) {
        var context = await httpListener.GetContextAsync();
        var request = context.Request;
        var response = context.Response;

        var requestPath = request.Url!.AbsolutePath.Substring(1);

        if (requestPath == "client" && request.IsWebSocketRequest) {
            new Client(await context.AcceptWebSocketAsync("gameClient"));
            continue;
        }

        var requestLocalPath = Path.Combine(root.FullName, requestPath);

        var requestedFile = new FileInfo(Directory.Exists(requestLocalPath) ? Path.Combine(requestLocalPath, "index.html") : requestLocalPath);
        Console.WriteLine("Request for: " + requestedFile.FullName);

        if (!requestedFile.Exists || !Contains(root, requestedFile.Directory!)) {
            response.StatusCode = 404;
            response.Close();
            continue;
        }

        var buffer = File.ReadAllBytes(requestedFile.FullName);
        response.ContentLength64 = buffer.LongLength;
        response.OutputStream.Write(buffer);
        response.Close();
    }
} catch (Exception e) {
    Console.WriteLine(e);
}