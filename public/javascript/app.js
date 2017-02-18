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