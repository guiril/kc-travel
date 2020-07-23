# 高雄旅遊資訊

六角學院【JavaScript 入門篇 - 學徒的試煉】最終作業

[標示文件](https://hexschool.github.io/JavaScript_HomeWork/#artboard3)

[旅遊景點來源：高雄市政府資料開放平台](https://data.kcg.gov.tw/dataset/attractions-information)

### 功能介紹

* 使用 AJAX 串接 API 獲得景點資料。
* 選擇行政區域過濾景點。

### 實作

* 透過 `#districtList`, `.popular-area-btn` 取得目前選擇的地區。
* 取得目前地區所有景點，預設渲染第一頁資料。
* 分頁功能：
  * 計算目前的資料需要幾頁。
  * 計算目前要渲染的資料起始索引值和結束索引值。
  * 最後一頁的資料數為餘數。

### 更新紀錄

* 2019/12/4
  * `$ eslint --init`，使用 JavaScript Standard Style
  * 使用 ECMAScript 2015 (ES6) 語法
  * 刪除 Google Maps API

* 2019/12/6
  * 新增頁碼狀態
