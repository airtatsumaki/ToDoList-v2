jQuery("[type=checkbox]").click(function(){
  // console.log(jQuery(this));
  const item = jQuery(this).next().text();
  if(jQuery(this).prop("checked")){
    console.log(`${item} is checked`);
    jQuery(this).attr("checked", true);
  } else {
    console.log(`${item} is Unchecked`);
    jQuery(this).attr("checked", false);
  }
});