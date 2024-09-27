// 獲取按鈕並添加事件監聽器以切換下拉菜單
document.getElementById("myBtn").onclick = function(event) {
  event.stopPropagation(); // 防止點擊事件傳播
  document.getElementById("myDropdown").classList.toggle("show");
};

// 如果用戶點擊下拉菜單外部，則關閉它
window.onclick = function(event) {
  var dropdowns = document.getElementsByClassName("dropdown-content");
  var shouldClose = true;

  // 檢查點擊是否在 .dropdown-username 區域內
  if (event.target.closest('.dropdown-username')) {
    shouldClose = false;
  }

  // 檢查點擊是否在按鈕上（我們已經處理了按鈕點擊，所以這裡不需要關閉）
  if (event.target.matches('.dropbtn') || event.target.closest('.dropbtn')) {
    shouldClose = false;
  }

  // 如果應該關閉，則關閉所有打開的下拉菜單
  if (shouldClose) {
    for (let i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
};