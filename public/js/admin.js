const deleteProduct = btn => {
  prodId = btn.parentNode.querySelector("[name=productId]").value;
  csrf = btn.parentNode.querySelector("[name=_csrf]").value;
  console.log("Product Id: " + prodId);
  console.log("CSRF Token: " + csrf);
  fetch("/admin/product/" + prodId, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf
    }
  })
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
};
//
