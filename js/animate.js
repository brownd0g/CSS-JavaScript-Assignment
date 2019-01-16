// COSC260
// ASSIGNMENT 2
// ANDREW BROWN

$(function() {
    setInterval("updateImage()", 5000);
})

function updateImage() {
    
  // select the active image
  var $active = $('#img_animation img.active');

  // select the next element
  var $next = $active.next();

  // selecting 'next' on the last element results in a zero length object,
  // so set next to the first element, looping around
  if ($next.length === 0){
    $next = $('#img_animation img:first');
  }

  // Fade out current image, remove the 'active' class
  $active.fadeTo(1000, 0.0, function(){
    $active.removeClass('active');
  });
 
  // Fade in next image and add the 'active' class
  $next.fadeTo(1000, 1.0, function(){
    $next.addClass('active');
  });
}