$root = "C:\Users\NINGMEI\CodeBuddy\20260423020021"
$port = 8090
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:${port}/")
$listener.Start()
Write-Host "Server running at http://localhost:${port}/"

while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $url = $ctx.Request.Url.AbsolutePath
    $filePath = Join-Path $root $url.TrimStart('/')
    if ($url -eq '/') { $filePath = Join-Path $root 'index.html' }
    
    if (Test-Path $filePath -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($filePath)
        $contentType = switch ($ext) {
            '.html' { 'text/html; charset=utf-8' }
            '.js'   { 'application/javascript; charset=utf-8' }
            '.css'  { 'text/css; charset=utf-8' }
            '.json' { 'application/json; charset=utf-8' }
            '.png'  { 'image/png' }
            '.jpg'  { 'image/jpeg' }
            '.svg'  { 'image/svg+xml' }
            '.ico'  { 'image/x-icon' }
            default { 'application/octet-stream' }
        }
        $buffer = [System.IO.File]::ReadAllBytes($filePath)
        $ctx.Response.ContentType = $contentType
        $ctx.Response.ContentLength64 = $buffer.Length
        $ctx.Response.AddHeader("Access-Control-Allow-Origin", "*")
        $ctx.Response.OutputStream.Write($buffer, 0, $buffer.Length)
        $ctx.Response.OutputStream.Close()
        Write-Host "200 $url"
    } else {
        $ctx.Response.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes("Not Found: $url")
        $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
        $ctx.Response.OutputStream.Close()
        Write-Host "404 $url"
    }
}
