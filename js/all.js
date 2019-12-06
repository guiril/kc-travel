(function () {
  const getEl = (el) => {
    return document.querySelector(el)
  }

  let allData
  let dataArray = []

  let currentPage = 1
  const pageSize = 6 // 每頁有 6 筆資料
  let dataLength // 資料總筆數
  let totalPage // 總頁數

  const selectArea = getEl('#districtList')
  const titleEl = getEl('.subtitle')
  const listEl = getEl('.card-list')
  const popularArea = getEl('.popular-area')
  const paginationEl = getEl('.pagination')

  // 將遠端資料存入 allData
  const getData = () => {
    const xhr = new XMLHttpRequest() // 建立 XMLHttpReques 物件
    xhr.open('get', 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97', true) // get JSON 資料
    xhr.send(null) // 不回傳任何值

    xhr.onload = function () { // 資料回傳後執行
      const data = JSON.parse(xhr.responseText) // 把 JSON 字串轉換成物件
      allData = data.result.records
    }
  }

  getData()

  // 更新景點列表
  const updateList = (pageNumber = 1) => {
    const lastPageSize = dataLength % pageSize // 最後一頁的資料筆數
    const indexStart = (pageNumber - 1) * pageSize // 每頁第一筆資料的索引
    let indexEnd = (pageNumber * pageSize) - 1 // 每頁最後一筆的資料索引

    let listStr = ''

    if (dataLength === 0) {
      titleEl.textContent = '目前尚無資料'
      listEl.innerHTML = ''
      return
    } else {
      titleEl.textContent = dataArray[0].Zone // 標題顯示地區
    }

    // 如果是最後一頁，最後一筆資料的索引
    if (pageNumber === totalPage && lastPageSize !== 0) {
      indexEnd = indexStart + lastPageSize
    }

    // 渲染資料列表
    for (let i = indexStart; i <= indexEnd; i++) {
      listStr += `
        <li>
          <div class="card-pic" style="background-image: url(${dataArray[i].Picture1});">
            <h3>${dataArray[i].Name}</h3>
            <span>${dataArray[i].Zone}</span>
          </div>
          <ul class="card-txt">
            <li title="${dataArray[i].Opentime}"><img src="images/icons_clock.png">${dataArray[i].Opentime}</li>
            <li><img src="images/icons_pin.png">${dataArray[i].Add}</li>
            <li><img src="images/icons_phone.png">${dataArray[i].Tel}</li>
            <li><img src="images/icons_tag.png">${dataArray[i].Ticketinfo}</li>
          </ul>
        </li>`
    }

    listEl.innerHTML = listStr
    currentPage = pageNumber
  }

  // 渲染頁碼
  const renderPagination = (page) => {
    let pageStr = ''

    dataLength = dataArray.length
    totalPage = Math.ceil(dataLength / pageSize) // 無條件進位計算頁數

    if (dataLength === 0) {
      paginationEl.innerHTML = ''
    } else {
      for (let i = 1; i <= totalPage; i++) {
        if (i === page) {
          pageStr += `<a href="#" class="page-numbers active" data-page=${i}>${i}</a>`
        } else {
          pageStr += `<a href="#" class="page-numbers" data-page=${i}>${i}</a>`
        }
      }
      if (currentPage === 1) {
        paginationEl.innerHTML = `
        <a href="#" class="disabled" data-page="prev">< prev</a>
        ${pageStr}
        <a href="#" data-page="next">next ></a>`
      } else if (currentPage === totalPage) {
        paginationEl.innerHTML = `
        <a href="#" data-page="prev">< prev</a>
        ${pageStr}
        <a href="#" class="disabled" data-page="next">next ></a>`
      }
    }
  }

  // 目前選擇的地區
  const getValue = (e) => {
    e.preventDefault()
    const district = e.target.value
    dataArray = []

    if (district) {
      for (let i = 0; i < allData.length; i++) {
        if (district === allData[i].Zone) {
          dataArray.push(allData[i])
        }
      }
      renderPagination(currentPage)
      updateList()
    }
  }

  const getPageNumber = (e) => {
    e.preventDefault()

    let page

    if (e.target.nodeName === 'A') { // 點擊到 a 元素取得目前點擊的頁碼
      page = e.target.dataset.page
      if (page === 'prev' || page === 'next') { // 點擊到 prev 或 next 時
        if (page === 'prev' && currentPage !== 1) {
          currentPage = currentPage - 1
        } else if (page === 'next' && currentPage !== totalPage) {
          currentPage = currentPage + 1
        }
      } else {
        currentPage = Number(page)
      }
      renderPagination(currentPage)
      updateList(currentPage)
    }
  }

  $('.go-top a').click(function (e) {
    e.preventDefault()
    $('html, body').animate({
      scrollTop: 0
    }, 800)
  })

  selectArea.addEventListener('change', getValue, false)
  popularArea.addEventListener('click', getValue, false)
  paginationEl.addEventListener('click', getPageNumber, false)
})()
