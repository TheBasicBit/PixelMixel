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

var root = new DirectoryInfo("public");
var prefix = "http://*:80/";
Console.WriteLine("Use prefix: " + prefix);

var httpListener = new HttpListener();
httpListener.Prefixes.Add(prefix);
httpListener.Start();

while (true) {
    var context = await httpListener.GetContextAsync();
    var request = context.Request;
    var response = context.Response;

    //if (Contains(root, )) {

    //}

    var buffer = Encoding.UTF8.GetBytes("Hello " + request.RemoteEndPoint.Address + "!");
    response.ContentLength64 = buffer.LongLength;
    response.OutputStream.Write(buffer);
    response.Close();
}
