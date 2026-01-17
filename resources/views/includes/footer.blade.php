  <!-- Start Footer Section -->
  <footer class="footer-section">
      <div class="container relative">

          <div class="sofa-img">
              <img src="{{ asset('ddl/images/sofa.png') }}" alt="Image" class="img-fluid">
          </div>

          <div class="row">
              <div class="col-lg-8">
                  <div class="subscription-form">
                      <h3 class="d-flex align-items-center"><span class="me-1"><img
                                  src="{{ asset('ddl/images/envelope-outline.svg') }}" alt="Image"
                                  class="img-fluid"></span><span>Обратная связь</span></h3>

                      <form action="#" class="row g-3">
                          <div class="col-auto">
                              <input type="text" class="form-control" placeholder="Введите имя">
                          </div>
                          <div class="col-auto">
                              <input type="email" class="form-control" placeholder="Введите ваш E-mail">
                          </div>
                          <div class="col-auto">
                              <button class="btn btn-primary text-white">
                                  <span class="fa fa-paper-plane"></span>
                              </button>
                          </div>
                      </form>

                  </div>
              </div>
          </div>

          <div class="row g-5 mb-5">
              <div class="col-lg-4">
                  <div class="mb-4 footer-logo-wrap"><a href="#" class="footer-logo">DDL_DECOR<span>.</span></a>
                  </div>
                  <p class="mb-4">
                      Мы специализируемся на аренде мебели и оформлении мероприятий любого масштаба: от камерных ужинов
                      до масштабных торжеств.
                      Наша цель — подчеркнуть стиль вашего события и сделать его запоминающимся.
                  </p>

                  <ul class="list-unstyled custom-social">
                      <li><a href="#"><span class="fa fa-brands fa-facebook-f"></span></a></li>
                      <li><a href="#"><span class="fa fa-brands fa-twitter"></span></a></li>
                      <li><a href="https://www.instagram.com/ddl_decor?igsh=MW5jYTAybmtydm54MA%3D%3D&utm_source=qr"><span
                                  class="fa fa-brands fa-instagram"></span></a></li>
                      <li><a href="#"><span class="fa fa-brands fa-linkedin"></span></a></li>
                  </ul>
              </div>

              <div class="col-lg-8">
                  <div class="row links-wrap">
                      <div class="col-6 col-sm-6 col-md-3">
                          <ul class="list-unstyled">
                              <li><a href="{{ route('pages.index') }}">Главная</a></li>
                              <li><a href="{{ route('pages.shop') }}">Каталог</a></li>
                              <li><a href="{{ route('pages.about') }}">О нас</a></li>
                              <li><a href="{{ route('pages.contacts') }}">Контакты1</a></li>
                          </ul>
                      </div>

                      <div class="col-6 col-sm-6 col-md-3">
                          <ul class="list-unstyled">
                              <li><a href="#">Поддержка</a></li>
                              <li><a href="#">База знаний</a></li>
                              <li><a href="#">Чат</a></li>
                          </ul>
                      </div>

                      <div class="col-6 col-sm-6 col-md-3">
                          <ul class="list-unstyled">
                              <li><a href="#">Стул Напалеон</a></li>
                              <li><a href="#">Круглый стол</a></li>
                              <li><a href="#">Квадратный стол</a></li>
                              <li><a href="#">Кресло мешок</a></li>
                          </ul>
                      </div>

                      <div class="col-6 col-sm-6 col-md-3">
                          <ul class="list-unstyled">
                              <li><a href="#">Nordic Chair</a></li>
                              <li><a href="#">Kruzo Aero</a></li>
                              <li><a href="#">Ergonomic Chair</a></li>
                          </ul>
                      </div>
                  </div>
              </div>

          </div>

          <div class="border-top copyright">
              <div class="row pt-4">
                  <div class="col-lg-6">
                      <p class="mb-2 text-center text-lg-start">Copyright &copy;
                          <script>
                              document.write(new Date().getFullYear());
                          </script>. All Rights Reserved. &mdash; Designed with love by <a
                              hreff="https://compnet.kz">Complex Services</a>
                      </p>
                  </div>

                  <div class="col-lg-6 text-center text-lg-end">
                      <ul class="list-unstyled d-inline-flex ms-auto">
                          <li class="me-4"><a href="#">&amp;</a></li>
                          <li><a href="#"></a></li>
                      </ul>
                  </div>

              </div>
          </div>

      </div>
  </footer>
  <!-- End Footer Section -->
