/*??
// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.
 ??*/
(function(undef){ "use strict"; var global = this, _ = global._ , $ = global.jQuery;
var skaro = global.SkaroJS;

// form placeholder fix for IE < 10
function maybefixIE() {

  $('[placeholder]').focus(function() {
    var input = $(this);
    if (input.val() === input.attr('placeholder')) {
      input.val('');
      input.removeClass('placeholder');
    }
  }).blur(function() {
    var input = $(this);
    if (input.val() == '' || input.val() === input.attr('placeholder')) {
      input.addClass('placeholder');
      input.val(input.attr('placeholder'));
    }
  }).blur().parents('form').submit(function() {
    $(this).find('[placeholder]').each(function() {
      var input = $(this);
      if (input.val() === input.attr('placeholder')) {
        input.val('');
      }
    })
  });
}

function maybebadcontactffld(fldn, fldv) {
  if (fldv == "") {
    $('input[name=' + fldn + ']').css('border-color','red');
    $('#submit_btn').remove('i').text('Submit');
    return true;
  } else {
    return false;
  }
}

function onsubmitcontactmsg(evt) {
  skaro.pde(evt);
  $('#submit_btn').text('').append('<i class="fa fa-spinner fa-spin"></i>');

  var user_message = $('textarea[name=message]').val();
  var user_name = $('input[name=name]').val();
  var user_email = $('input[name=email]').val();
  var user_human = $('input[name=human]').val();
  var ok = true;

  if (maybebadcontactffld('message', user_message) ) { ok=false; }
  if (maybebadcontactffld('email', user_email)) { ok=false; }
  if (maybebadcontactffld('name', user_name)) { ok=false; }
  if (maybebadcontactffld('human', user_human)) { ok=false; }

  if (ok) {
    var onresp= function(res) {
      var output;
      if (res.status === true) {
        output = '<div class="success">'+ res.msg + '</div>';
        $('#submit_btn').remove('i').text('Message sent!');
        $('#submit_btn').attr("disabled", true);
        $('#contact_form textarea').val('');
        $('#contact_form input').val('');
      } else {
        output = '<div class="error">' + res.msg + '</div>';
        $('#submit_btn').remove('i').text('Submit');
      }
      $("#feedback").hide().html(output).slideDown();
    };
    $.post('/contact.php', { 'userName':user_name,
                         'userEmail':user_email,
                         'userHuman':user_human,
                         'userMessage':user_message
                    },
                    onresp, 'json');
  }
}


function boot() {

  var em = $('html');
  if (skaro.isSafari() ) {
    em.addClass('is-safari');
  } else {
    em.removeClass('is-safari');
  };

  $('.navbar-toggle').on('click', function(){
    var em2= $('.navbar-collapse');
    var em = $('.navbar');
    if ( ! em2.hasClass("in")) {
      em.addClass('darken-menu');
    }
    else if ( em2.hasClass("in")) {
      em.removeClass('darken-menu');
    }
  });

  $('.nav a').on('click', function () {
    $('#main-nav').removeClass('in').addClass('collapse');
  });

  $('.navbar-nav li a').on('click', function(evt) {
    var place = $(this).attr('href');
    var off = $(place).offset().top;
    $('html, body').animate({ scrollTop: off }, 1200, 'easeInOutCubic');
    skaro.pde(evt);
  });

  // minimize and darken the menu bar
  $('body').waypoint( function (dir) {
    $('.navbar').toggleClass('minified dark-menu');
  }, { offset: '-200px' });

  // show "back to top" button
  $(document).scroll( function () {
    var headerHt = $('#intro').outerHeight();
    var pos = $(document).scrollTop();
    var em= $('.scrolltotop');
    if (pos >= headerHt - 100){
      em.addClass('show-to-top');
    } else {
      em.removeClass('show-to-top');
    }
  });

  // scroll on top
  $('.scrolltotop, .navbar-brand').on('click', function(e) {
    $('html, body').animate({scrollTop: '0'}, 1200, 'easeInOutCubic');
    skaro.pde(e);
  });

  // ----- contact form
  $("#submit_btn").on('click', onsubmitcontactmsg);

  var em2= $("#contact_form input, #contact_form textarea");
  em2.keyup( function() {
    em2.css('border-color','');
    $("#feedback").slideUp();
  });

  maybefixIE();
}

$(document).ready(boot);

}).call(this);


