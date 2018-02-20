var iframeError;

$(function() {
  $('form').submit(function(event) {
    event.preventDefault();
    var url = document.getElementById('url').value;
    if (url.indexOf('https://') !== 0) {
      error('you must provide an HTTPS URL');
    } else {
      error(false);
      document.getElementById('error').style.visibility = 'hidden';
      var iframe = $('#iframe');
      iframe.prop('src', document.getElementById('url').value);
      error('<img src="https://cdn.glitch.com/f919105f-03fb-4e49-9855-732bbdf9a0f1%2Fajax-loader.gif?1501949674647" alt="loading…">')
      iframeError = setTimeout(function() {
        iframe.prop('src', '');
        error("sorry, can't load that page :(");
      }, 5000)
      iframe.on('load', function() {
        error(false)
        clearTimeout(iframeError)
      });
    }
  });

  function error(message) {
    if (message) {
      document.getElementById('error').innerHTML = message;
      document.getElementById('error').style.visibility = 'visible';
    } else {
      document.getElementById('error').style.visibility = 'hidden';
    }
  }
});