<!DOCTYPE html>
<html class="dark">
<head>
    <meta charset="utf-8">
    <title>{{ name }}</title>
    <link href="/static/elpis.png" rel="icon" type="image/x-icon"></link>
</head>
<body style="margin: 0;">
    <div id="root"></div>
    <input id="env" value={{ env }} style="display: none;">
    <input id="projKey" value={{ projKey }} style="display:none;" />
</body>
<script>
try {
    window.env = document.getElementById('env').value
    window.projKey = document.getElementById('projKey').value
} catch (err) {
    console.warn('err:', err)
}
</script>
</html>