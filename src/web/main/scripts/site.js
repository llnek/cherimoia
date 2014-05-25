
$(document).ready(function() {

  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);


  function pde(e) {
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
  }

  if (isSafari) {
    $('html').addClass('is-safari');
  } else {
    $('html').removeClass('is-safari');
  };

  $('.navbar-toggle').on('click', function(){
    if (!$('.navbar-collapse').hasClass("in")) {
      $('.navbar').addClass('darken-menu');
    } else if ($('.navbar-collapse').hasClass("in")) {
      $('.navbar').removeClass('darken-menu');
    }
  });

  $('.nav a').on('click', function () {
    $('#main-nav').removeClass('in').addClass('collapse');
  });


  $('.navbar-nav li a').click(function(evt){
    var place = $(this).attr('href');
    var off = $(place).offset().top;
    $('html, body').animate({
      scrollTop: off
    }, 1200, 'easeInOutCubic');
    pde(evt);
  });


  // minimize and darken the menu bar
  $('body').waypoint(function(direction) {
    $('.navbar').toggleClass('minified dark-menu');
  }, { offset: '-200px' });


  // ----- show "Back to Top" button
  $(document).scroll(function () {
    var position = $(document).scrollTop();
    var headerHeight = $('#intro').outerHeight();
    if (position >= headerHeight - 100){
      $('.scrolltotop').addClass('show-to-top');
    } else {
      $('.scrolltotop').removeClass('show-to-top');
    }
  });

  // scroll on top
  $('.scrolltotop, .navbar-brand').click(function(e) {
    $('html, body').animate({scrollTop: '0'}, 1200, 'easeInOutCubic');
    pde(e);
  });


  // ----- contact form
  $("#submit_btn").click(function(e) {
    pde(e);

    $('#submit_btn').text('').append('<i class="fa fa-spinner fa-spin"></i>');

    var user_message = $('textarea[name=message]').val();
    var user_name = $('input[name=name]').val();
    var user_email = $('input[name=email]').val();
    var user_human = $('input[name=human]').val();
    var proceed = true;

    if (user_name=="") {
      $('input[name=name]').css('border-color','red');
      $('#submit_btn').remove('i').text('Submit');
      proceed = false;
    }

    if (user_email=="") {
      $('input[name=email]').css('border-color','red');
      $('#submit_btn').remove('i').text('Submit');
      proceed = false;
    }

    if ( user_human == "" ) {
      $('input[name=human]').css('border-color','red');
      $('#submit_btn').remove('i').text('Submit');
      proceed = false;
    }

    if (user_message=="") {
      $('textarea[name=message]').css('border-color','red');
      $('#submit_btn').remove('i').text('Submit');
      proceed = false;
    }

    if (proceed) {

      post_data = {'userName':user_name, 'userEmail':user_email, 'userHuman':user_human, 'userMessage':user_message};

      $.post('/contact', post_data, function(response) {

        if (response.type === 'error') {
          output = '<div class="error">'+response.text+'</div>';
          $('#submit_btn').remove('i').text('Submit');
        } else {
          output = '<div class="success">'+response.text+'</div>';

          $('#submit_btn').remove('i').text('Message sent!');
          $('#submit_btn').attr("disabled", true);

          $('#contact_form textarea').val('');
          $('#contact_form input').val('');
        }

        $("#feedback").hide().html(output).slideDown();

      },
      'json');
    }

  });

  $("#contact_form input, #contact_form textarea").keyup(function() {
    $("#contact_form input, #contact_form textarea").css('border-color','');
    $("#feedback").slideUp();
  });

  // form placeholder fix for IE < 10
  $('[placeholder]').focus(function() {
    var input = $(this);
    if (input.val() == input.attr('placeholder')) {
      input.val('');
      input.removeClass('placeholder');
    }
  }).blur(function() {
    var input = $(this);
    if (input.val() == '' || input.val() == input.attr('placeholder')) {
      input.addClass('placeholder');
      input.val(input.attr('placeholder'));
    }
  }).blur().parents('form').submit(function() {
    $(this).find('[placeholder]').each(function() {
    var input = $(this);
    if (input.val() == input.attr('placeholder')) {
      input.val('');
    }
    })
  });



});


