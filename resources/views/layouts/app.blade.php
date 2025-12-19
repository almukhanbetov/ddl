<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="author" content="Untree.co">
    <link rel="shortcut icon" href="favicon.png">
    <meta name="description" content="" />
    <meta name="keywords" content="bootstrap, bootstrap4" />
    <link rel="stylesheet" href="{{ asset('ddl/css/bootstrap.min.css') }}">
    <link rel="stylesheet" href="{{ asset('ddl/css/style.css') }}">
    <link rel="stylesheet" href="{{ asset('ddl/css/tiny-slider.css') }}">
    <title>Главная</title>
</head>

<body>
    @include('includes.nav')
    @include('includes.hero')
    @yield('content')
    @include('includes.footer')



    <script src="{{ asset('ddl/js/bootstrap.js') }}"></script>
    <script src="{{ asset('ddl/js/custom.js') }}"></script>
</body>

</html>
