using System.Security.AccessControl;
using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.IO;

bool Contains(DirectoryInfo first, DirectoryInfo second) {
    while (second.Parent != null) {
        if (second.Parent.FullName == first.FullName) {
            return true;
        } else {
            second = second.Parent;
        }
    }

    return false;
}

try {
    var root = new DirectoryInfo(".\\public");
    var prefix = "http://*:80/";
    Console.WriteLine("Use prefix: " + prefix);

    var httpListener = new HttpListener();
    httpListener.Prefixes.Add(prefix);
    httpListener.Start();

    while (true) {
        var context = await httpListener.GetContextAsync();
        var request = context.Request;
        var response = context.Response;

        var requestedFile = new FileInfo(Path.Combine(root.FullName, request.Url!.AbsolutePath));
        Console.WriteLine("Request for: " + requestedFile.FullName);
        // TODO: Path ist immer falsch und zeigt immer auf Datei in D:\.

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