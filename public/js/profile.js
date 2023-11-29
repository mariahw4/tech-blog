const newFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#post-name').value.trim();
  const post_content = document.querySelector('#post-content').value.trim();
  // const postUserName = document.querySelector('#post-username').value.trim();
  console.log('Name:', name);
  console.log('Post content:', post_content);

  if (name && post_content) {
    const response = await fetch(`/api/posts`, {
      method: 'POST',
      body: JSON.stringify({ name, post_content }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log('redirecting to profile page');
      document.location.replace('/profile');
    } else {
      alert('Failed to create post');
    }
  }
};

const delButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');

    const response = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to delete post');
    }
  }
};
// Toggle edit form
document.querySelectorAll('.btn-edit').forEach((button) => {
  button.addEventListener('click', (event) => {
    const postId = event.target.getAttribute('data-id');
    const editForm = document.querySelector(
      `.edit-post-form[data-id="${postId}"]`
    );
    if (editForm) {
      editForm.style.display = editForm.style.display === 'none' ? '' : 'none';
    }
  });
});

// Handle edit form submission
document.querySelectorAll('.edit-post-form').forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const postId = form.getAttribute('data-id');
    const name = form
      .querySelector('input[name="post-name-edit"]')
      .value.trim();
    const post_content = form
      .querySelector('textarea[name="post-content-edit"]')
      .value.trim();

    // Create a FormData object to send both data and file
    // const formData = new FormData();
    // formData.append('name', name);
    // formData.append('post-content', post_content);

    if (name && post_content) {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        body: JSON.stringify({ name, post_content }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        location.reload();
      } else {
        alert('Failed to update post');
      }
    } else {
      alert('Please fill out both fields');
    }
  });
});
document
  .querySelector('.new-post-form')
  .addEventListener('submit', newFormHandler);

// Use event delegation for dynamically generated elements
document.body.addEventListener('click', (event) => {
  if (event.target.matches('.btn-danger')) {
    delButtonHandler(event);
  }
});
// document
//   .querySelector('.post-list')
//   .addEventListener('click', delButtonHandler);
