function uploadPhoto() {
  document.getElementById('submit').addEventListener('click', () => {
  let postId = 'new Photo'
  let imgInput = document.getElementById('img')
  let file = imgInput.files[0]
  let blob = file.slice(0, file.size, 'image/jpeg')
  let newfile = new File([blob], `${postId}_post.jpeg`, { type: 'image/jpeg' })
  let formData = new FormData()
  formData.append('imgFile', newfile)
  console.log('CLICKED***************')

  fetch('/uploadPhoto', {

    method: "POST",
    body: formData
  })
  .then((res) => res.text())
  .then((x) => console.log(x, '!!!!!!!!!HERE!!!!!!'))
  })
}

module.exports = uploadPhoto
