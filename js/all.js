var allData;
var dataArray = [];

var map;
var markers = [];

var currentPage;
var totalPage;

var select = document.querySelector('#districtList');
var title = document.querySelector('h2');
var list = document.querySelector('.cardList');
var popular = document.querySelector('.popularArea');
var page = document.querySelector('.pagination');
var addMap = document.querySelector('#map');


// 將遠端資料存入allData
function getData() {
  let xhr = new XMLHttpRequest();
  xhr.open('get', 'https://ouiis.github.io/kc_travel/json/data.json', true);
  xhr.send(null);

  xhr.onload = function () {
    let get = JSON.parse(xhr.responseText);
    allData = get.result.records;
  }
};

// 建立地圖
function initMap() {
  map = new google.maps.Map(addMap, {
    center: { lat: 22.624815, lng: 120.301097 },
    zoom: 11
  });
};

// 地圖標記
function mapMarker(lat, lng, title) {
  var marker = new google.maps.Marker({
    position: { lat: lat, lng: lng },
    title: title,
    map: map
  })
  // 將目前標記存入markers
  markers.push(marker);
};

// 更新景點資訊
function updateList(pageNumber) {
  let arraySize = dataArray.length;

  let pageSize = 6; // 每頁有6筆資料
  let rangeStart = (pageNumber - 1) * pageSize;
  let rangeEnd = pageNumber * pageSize;
  let lastPageSize = arraySize % pageSize;

  let htmlStr = '';
  let htmlPage = '';

  // 清空目前標記
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  };
  markers = [];

  // 顯示頁碼
  if (arraySize == 0) {
    title.textContent = '目前尚無資料';
    list.innerHTML = '';
    page.innerHTML = '';
    return;
  } else {
    title.textContent = dataArray[0].Zone; // 標題顯示地區
    totalPage = Math.ceil(arraySize / pageSize); // 無條件進位計算頁數
    for (let i = 1; i <= totalPage; i++) {
      if (i == pageNumber) {
        htmlPage += `<a href="#" class="page-numbers current" data-pagination=${i}>${i}</a>`;
      } else {
        htmlPage += `<a href="#" class="page-numbers" data-pagination=${i}>${i}</a>`;
      }
    };
    page.innerHTML = `<a href="#" class="prev-button"><i class="fas fa-chevron-left" data-pagination="prev"></i></a>${htmlPage}<a href="#" class="last-button"><i class="fas fa-chevron-right" data-pagination="next"></i></a>`;
  };

  // 最後一筆資料的索引
  if (pageNumber == totalPage) {
    if (lastPageSize != 0) {
      rangeEnd = rangeStart + lastPageSize;
    };
  };

  // 顯示資料
  for (let i = rangeStart; i < rangeEnd; i++) {
    htmlStr += `<li><div class="pic" style="background-image: url(${dataArray[i].Picture1});"><h3>${dataArray[i].Name}</h3><span>${dataArray[i].Zone}</span></div><div class="txt"><p class="opentime"><span></span>${dataArray[i].Opentime}</p><p class="address"><span></span>${dataArray[i].Add}</p><p class="tel"><span></span>${dataArray[i].Tel}</p><p class="ticket"><span></span>${dataArray[i].Ticketinfo}</p></div></li>`;
    mapMarker(parseFloat(dataArray[i].Py), parseFloat(dataArray[i].Px), dataArray[i].Name);
  };

  list.innerHTML = htmlStr;
  currentPage = pageNumber;
};

function getValue(e) {
  e.preventDefault();
  let district = e.target.value;
  dataArray = [];

  if (e.target.nodeName == 'INPUT' || e.target.nodeName == 'SELECT') {
    for (let i = 0; i < allData.length; i++) {
      if (district == allData[i].Zone) {
        dataArray.push(allData[i]);
      };
    };
  } else {
    return;
  };

  updateList(1);
};

function getPageNumber(e) {
  e.preventDefault();

  if (e.target.nodeName == 'A' || e.target.nodeName == 'I') {
    let pagination = e.target.dataset.pagination;

    if (pagination == 'prev' || pagination == 'next') {
      if (pagination == 'prev') {
        if (currentPage == 1) {
          return;
        };
        pagination = currentPage - 1;
      }
      if (pagination == 'next') {
        if (currentPage == totalPage) {
          return;
        }
        pagination = currentPage + 1;
      }
    };

    updateList(pagination);
  }
};

$('.goTop a').click(function (e) {
  e.preventDefault();
  $('html, body').animate({
    scrollTop: 0
  }, 800);
})

getData();
select.addEventListener('change', getValue, false);
popular.addEventListener('click', getValue, false);
page.addEventListener('click', getPageNumber, true);
