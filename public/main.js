var colorName = ["Titan Spinner Gold", "Titan Spinner Silver", "Titan Spinner Blue"];
var color = 0;

var price = 38.99;
var quantity = [0,0,0];

var _total = 0;
var _items = [
  {
  "name": colorName[color],
  "quantity": quantity,
  "price": price,
  "currency": "USD"
  }
];

var viewcontentfb = false;

$(document).ready(function() {

  $(window).scroll(function(e) {
    if(!viewcontentfb && window.pageYOffset > $(".sale").offset().top - 500) {
      console.log("View Content");
      viewcontentfb = true;
      fbq('track', 'ViewContent');
    }
  });

  $(".menu-toggle").click(function() {
    $(".menu").toggleClass("active");
  });
  $(".menu li").click(function() {
    $("html, body").animate({scrollTop: $( $(this).attr("target") ).offset().top - 60}, 500);
    $(".menu").removeClass("active");
  });
  $(".action").click(function() {
    $("html, body").animate({scrollTop: $( '.sale' ).offset().top - 60}, 500);
  });
  $(".color div").click(function() {
    $(".color div").removeClass("active");
    $(this).addClass("active");
    color = $(this).index(".color div");
    $(".buy .image>div").removeClass("active");
    $(".buy .image>div:eq("+color+")").addClass("active");
  });
  $(".highlight").click(function() {
    $(".bill-overlay").addClass("active");
    updateCart();
  });
  $(".bill .close").click(function() {
    $(".bill-overlay").removeClass("active");
  });

  $.get("/saletime", function(data) {
    var amount = parseInt(data);

    var time = (new Date()).getTime();
    setInterval(function() {
      var now = (new Date()).getTime();
      var left = amount - (now - time);
      $(".countdown .day").html( fullNumber( Math.floor(left/24/60/60/1000) ));
      $(".countdown .hour").html( fullNumber( Math.floor(left/60/60/1000) % 24 ));
      $(".countdown .minute").html( fullNumber( Math.floor(left/60/1000) % 60 ));
      $(".countdown .second").html( fullNumber( Math.floor(left/1000) % 60 ));
    }, 100);
  });

  $("input[type='number']").change(function() {
    if($(this).val() < 0 || $(this).val().trim() == "") $(this).val(0);
  });

});




function fullNumber(x) {
  if(x<10) return "0" + x;
  else
    return x;
}

paypal.Button.render({

    env: 'production', // Optional: specify 'sandbox' environment

    client: {
        sandbox:    'AeeQuc30epxndsZcys556s8BUccDPn7iphKvcVdJGRxEufT_J27f21i5YMLWZjiBEfNC23G5sA_fwvDr',
        production: 'AcnCWAY1tL8UX-IiKSJzGpmAZRuDH-O54vyrU_iF__Ct83GpkR6MDQ2J18mSHQLj5HQkn9TG6_okh-cl'
    },

    payment: function() {

        var env    = this.props.env;
        var client = this.props.client;

        ga('send', 'event', 'Purchase ' + colorName[color], quantity);
        fbq('track', 'InitiateCheckout');
        console.log('InitiateCheckout');

        return paypal.rest.payment.create(env, client, {
            transactions: [
              {
                amount: {
                  total: _total,
                  currency: 'USD'
                },
                item_list: {
                  items: _items
                }
              }
            ]
        });
    },

    commit: true, // Optional: show a 'Pay Now' button in the checkout flow

    onAuthorize: function(data, actions) {

        // Optional: display a confirmation page here

        return actions.payment.execute().then(function() {
            fbq('track', 'Purchase', {
              value: _total,
              currency: 'USD'
            });
            window.location.href = "/thankyou/";
        });

    },

    style: {
      size: 'medium'
    },

    onError: function(err) {
        ga('send', 'event', 'error: ' + err, quantity);
    }

}, '#paypal-button');




function updateCart() {
  quantity[0] = parseInt( $(".qty.gold").val() );
  quantity[1] = parseInt( $(".qty.silver").val() );
  quantity[2] = parseInt( $(".qty.blue").val() );

  if(quantity[0] + quantity[1] + quantity[2] == 0) {
    $(".qty.gold").val(1);
    quantity[0] = 1;
  }

  _items = [];
  _total = 0;
  for(var i=0; i<quantity.length; i++)
    if(quantity[i] > 0) {
      _items.push(
        {
        "name": colorName[i],
        "quantity": quantity[i],
        "price": price,
        "currency": "USD"
        }
      );
      _total += price * quantity[i];
    }

  if(_total < 50) {
    _items.push(
      {
      "name": "Shipping",
      "price": 5,
      "quantity": 1,
      "currency": "USD"
      }
    );
    _total += 5;
  }
  else {
    _items.push(
      {
      "name": "Free Shipping",
      "price": 0,
      "quantity": 1,
      "currency": "USD"
      }
    );
  }

  $(".items").empty();
  for(var i=0; i<_items.length; i++) {
    var item = $(".items-temp li").clone();
    $(".items").append(item);
    item.find(".bill-title").html( _items[i].name );
    item.find(".bill-qty").html( _items[i].quantity );
    item.find(".bill-subtotal").html( _items[i].quantity * _items[i].price );

    if( _items[i].name.indexOf("Shipping") != -1 )
      item.find(".bill-qty").remove();
  }
  $(".bill-total").html(_total);

  console.log("Add To Cart");
  ga('send', 'event', 'Add To Cart', 1);
  fbq('track', 'AddToCart', {
  value: _total,
  currency: 'USD'
  });

}
