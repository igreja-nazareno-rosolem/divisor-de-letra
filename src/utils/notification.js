export function showNotification() {
  var notificationEl = document.querySelector("p.copy-success-message");

  if (notificationEl && notificationEl.classList && typeof notificationEl.classList.add === 'function') {
    notificationEl.classList.add("notify");
    setTimeout(function () {
      if (notificationEl && notificationEl.classList && typeof notificationEl.classList.remove === 'function') {
        notificationEl.classList.remove("notify");
      }
    }, 1000);
  }
}