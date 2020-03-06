module.exports = {
  authenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('warning_msg', '請先登入才能使用')
    res.redirect('/users/login')
  }
}

//在這裡，我們的目的是要檢查使用者是否已經在登入狀態。我們新增了一個名為 auth 的 middleware，並在裡面撰寫了一個名叫 authenticated 的方法。這個方法的功能就是去檢查 req 物件裡 isAuthenticated 的值。如果 isAuthenticated 是 TRUE，則我們執行下一個 middleware。如果是 FALSE，那就回到 login 頁面。