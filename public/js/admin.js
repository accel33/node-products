const deleteProduct = btn => {
  prodId = btn.parentNode.querySelector("[name=productId]").value;
  csrf = btn.parentNode.querySelector("[name=_csrf]").value;
  console.log("Product Id: " + prodId);
  console.log("CSRF Token: " + csrf);
};
//
