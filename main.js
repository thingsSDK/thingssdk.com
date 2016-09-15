$(function() {
  var $header = $("header"),
      $footer = $("footer"),
      $contributorContainer, headerOpacity, footerOpacity, distanceFromBottom;

  /********************/
  /********************/
  // Grab contributors
  /********************/
  /********************/
  // Grab contributor data from GitHub API: right now from thingsSDK CLI
  $.getJSON("https://api.github.com/repos/thingsSDK/thingssdk-cli/contributors", function(data) {
    // Only want the header and div to be in place if the AJAX request is successful
    // Otherwise fail silently
    $($footer).prepend("<h2>Contributors</h2>", "<div id='contributor-container' class='contributor-container'></div>");
    $contributorContainer = ("#contributor-container");

    // For each contributor, create a link/image element
    data.forEach(function(elem) {
        // Create element
        elem = "<a href='" + elem.html_url +
               "' class='contributor-link' target='_blank' ><img src='" + elem.avatar_url +
               "' alt='" + elem.login +
               "' title='" + elem.login +
               "' /></a>";

      // Append to contributor-container
      $($contributorContainer).append(elem);
    });
  });

  /********************/
  /********************/
  // Fade header
  /********************/
  /********************/
  function fadeHeaderFooter () {
    // Determine distance from bottom (there's no scrollBottom)
    distanceFromBottom = Math.floor($(document).height() - $(document).scrollTop() - $(window).height());

    // Arbitrary algorithms that seem to look nice
    // Have to use Math.max and 0.1 to fix iOS touchmove bug
    headerOpacity = Math.max(( 1 - ($(window).scrollTop() / 250) ), 0.1);
    footerOpacity = Math.max(( 1 - (distanceFromBottom / 350) ), 0.1);

    // Update opacity on scroll
    $($header).css({ opacity: headerOpacity });
    $($footer).css({ opacity: footerOpacity });
  }

  $(window).scroll(fadeHeaderFooter);
  $(window).bind('touchmove', fadeHeaderFooter);

});
