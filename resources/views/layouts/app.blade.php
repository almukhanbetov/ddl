<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="author" content="Untree.co">
    <link rel="shortcut icon" href="favicon.png">
    <meta name="description" content="" />
    <meta name="keywords" content="bootstrap, bootstrap4" />
    <!-- Bootstrap CSS -->
    <title>Главная</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body>
    @include('includes.nav')
    @include('includes.hero')
    @yield('content')
    @include('includes.footer')

</body>

</html>
