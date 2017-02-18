$(document).on('click', 'button.save_comment', (e) => {
    e.preventDefault();

    let id = $(e.target).attr('data-id');  
    let newComment = {
        name: $(`#name-${id}`).val(),
        body: $(`#body-${id}`).val(),
    };
    $.ajax({
        method: "POST",
        url: "/articles/" + id,
        data: newComment
    }).done( (data) => {
        window.location.href = '/articles';
    });
});

// $('#nav_tabs').on('click', 'li a', (e) => {
//     var $this = $(this);
//     if(!$this.hasClass('active')) {
//         $('.navbar li.active').removeClass('active');
//         $this.addClass('active');
//     }
// })

// $('.container').on('click', '#delete', () =>{

// });

// $(document).on('click', 'button.delete-comment', (e) => {
//     let id = $(e.target).attr('data-id');
//     console.log(id);
//     $.ajax({
//         method: "DELETE",
//         url: '/delete/comment/' + id
//     }).done( (data) => {
//         window.location.href = '/articles';
//     });

// });