"use script";
var $header = $("header"),
  $footer = $("footer"),
  contributors = {},
  $contributorContainer, headerOpacity, footerOpacity, distanceFromBottom;

/**
 * Creates a script HTML Element and appends it to the page.
 * Ideal for JSONP requests.
 *
 * @param {string} url - URL of the JS script to include.
 */
function createScript(url) {
  var newScript = document.createElement("script");
  newScript.src = url;
  document.body.appendChild(newScript);
}

/**
 * Converts a thingsSDK repo name in to a contributors API URL
 *
 * @param {string} repo
 * @returns {string}
 */
function createContributorsURL(repo) {
  return "https://api.github.com/repos/thingsSDK/" + repo + "/contributors";
}

/**
 * Creates a script HTML Element with from a contributors API URL
 * which triggers `contributorsCallback` on completeion
 *
 * @param {string} contributors_url
 */
function getContributors(contributors_url) {
  createScript(contributors_url + "?callback=contributorsCallback");
}

/**
 * Creates the Contributors secotion on the website
 */
function createContributerSection() {
  $footer.prepend("<h2>Contributors</h2>", "<div id='contributor-container' class='contributor-container'></div>");
  $contributorContainer = $("#contributor-container");
}

/**
 * Converts a contributor JSON object in to an HTML element and appends it to
 * the `$contributorContainer`
 *
 * @param {object} contributor
 */
function createAndAppendContributor(contributor) {
  // Create element
  htmlElement = "<a href='" + contributor.html_url +
    "' class='contributor-link' target='_blank' ><img src='" + contributor.avatar_url +
    "' alt='" + contributor.login +
    "' title='" + contributor.login +
    "' /></a>";
  if ($contributorContainer) {
    $contributorContainer.append(htmlElement);
  }
}

/**
 * Converts, aggregates contribution totals and displays them on the page.
 *
 * @todo Maybe add some kind of filler for the footer on Github request failure?
 *
 * @param {object} response - response from the contributors API
 */
function contributorsCallback(response) {
  if (response.meta.status < 400) {
    // Create Contributors Section if it doesn't exist yet
    if (!$contributorContainer) {
      createContributerSection();
    }

    // Aggregate contributions
    response.data.forEach(sumContributions);

    // Sort by number of contributions
    var sortedContributors = Object.keys(contributors).map(function (login) {
      return Object.assign({ login: login }, contributors[login]);
    }).sort(function (contributor, otherContributor) {
      return otherContributor.contributions - contributor.contributions;
    });

    // Empty contributors
    $contributorContainer.html("");
    // Populate with updated contributors list
    sortedContributors.forEach(createAndAppendContributor);
  } else {
    console.log("Unable to pull contributors from Github");
  }
}

/**
 * Addeds or updates the total number of contributions from a `constributor` to the
 * `contributors` object.
 *
 * @param {object} contributor
 */
function sumContributions(contributor) {
  if (contributors[contributor.login]) {
    contributors[contributor.login].contributions = contributors[contributor.login].contributions + contributor.contributions;
  } else {
    contributors[contributor.login] = {
      contributions: contributor.contributions,
      html_url: contributor.html_url,
      avatar_url: contributor.avatar_url
    };
  }
}


function fadeHeaderFooter() {
  // Determine distance from bottom (there's no scrollBottom)
  distanceFromBottom = Math.floor($(document).height() - $(document).scrollTop() - $(window).height());

  // Arbitrary algorithms that seem to look nice
  // Have to use Math.max and 0.1 to fix iOS touchmove bug
  headerOpacity = Math.max((1 - ($(window).scrollTop() / 250)), 0.1);
  footerOpacity = Math.max((1 - (distanceFromBottom / 350)), 0.1);

  // Update opacity on scroll
  $header.css({ opacity: headerOpacity });
  $footer.css({ opacity: footerOpacity });
}

$(function () {
  // Grab contributors for all thingsSDK repos
  const repos = [
    "flasher.js",
    "thingssdk.com",
    "thingssdk-cli",
    "thingssdk-espruino-strategy",
    "thingssdk-deployer",
    "guides.thingssdk.com"
  ];

  repos
    .map(createContributorsURL)
    .forEach(getContributors);


  // Fade header
  $(window).scroll(fadeHeaderFooter);
  $(window).bind('touchmove', fadeHeaderFooter);

});
