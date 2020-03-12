# 我的記帳本
這是一個線上記帳本, 讓使用者記錄支出之外還能由類別, 時間及金額大小來做篩選，透過帳號管理自己的記帳紀錄，可自行新增、修改及刪除。

## 說明
### 登入前
- 登入首頁進行帳號密碼登入。
- 可採用Facebook帳號登入。
- 若尚未註冊，可到註冊網頁申請帳號。
### 登入後
- 首頁顯示所有支出清單列表。
- 提供支出紀錄的類別/時間/金額大小篩選功能。
- 使用者可新增一筆支出，輸入相關資訊。
- 使用者可編輯支出，編輯完成後回到清單列表。
- 使用者可刪除任一項支出資訊。


### 安裝流程
- Clone or download 此專案至本機電腦
- git clone https://github.com/lothecode/AC3_A16MoneyBook.git
- 安裝 npm 套件，根據package.json內紀錄之套件進行安裝。
- 執行npm run seeder導入種子資料, npm run seeder
- 待terminal將資料新增至資料庫後啟動專案，並監聽伺服器, npm run start
- 開啟瀏覽器，輸入http://localhost:3000 ，即可使用線上記帳本網站。

### 測試帳號如下:
> name : 孫小毛, email : user1@example.com, password : 12345678  
> name : 唐老鴨 ,email : user2@example.com, password : 12345678


### 環境說明環境配置
- Express
- MongoDB
- Robo 3T

### 環境套件
- Nodemon
- method-override
- express-handlebars
- body-parser
- mongoose
- bcryptjs
- express-session
- passport
- passport-local
- passport-facebook
- dotenv
- connect-flash
