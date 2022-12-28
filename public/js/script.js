// jQuery("[type=checkbox]").click(function(){
//   console.log(jQuery(this));
//   const item = jQuery(this).next().text();
//   let itemDone;
//   if(jQuery(this).prop("checked")){
//     console.log(`${item} is done`);
//     itemDone = 1;
//     jQuery(this).attr("checked", true);
//   } else {
//     console.log(`${item} is not done`);
//     itemDone = 0;
//     jQuery(this).attr("checked", false);
//   }

//   jQuery.ajax({
//     type: 'POST',
//     url: "/updateStatus",
//     data: {
//       task: item,
//       done: itemDone
//     }
//   });
// });

// jQuery('.bin').click(function(){
//   const item = jQuery(this).parent().siblings(".theItem").text();
//   console.log(`${item} should be deleted`);

//   jQuery.ajax({
//     type: 'POST',
//     url: "/deleteItem",
//     data: {
//       task: item,
//     }
//   });
// });