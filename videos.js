let page = 1;
let size = 10;
let videosList = document.querySelector(".videosList");
let videosList_2 = document.querySelector(".videosList_2");
let btnList = document.querySelectorAll(".buttonBox button");
//加载完一个再加载下一个
let isLoading = false;
let addUrl =
    [
        'https://m1.apifoxmock.com/m1/7510026-7245733-default/getAllVideos',
        'https://m1.apifoxmock.com/m1/7510026-7245733-default/getYingShiVideos',
        'https://m1.apifoxmock.com/m1/7510026-7245733-default/getGaoXiaoVideos',
        'https://m1.apifoxmock.com/m1/7510026-7245733-default/getDongManVideos',
        'https://m1.apifoxmock.com/m1/7510026-7245733-default/getJunShiVideos',
        'https://m1.apifoxmock.com/m1/7510026-7245733-default/getMeiShiVideos',
    ];

// 悬浮播放
function videoPlay() {
    let videos = document.querySelectorAll(".videoBox video")
    videos.forEach(function (v) {
        v.addEventListener('mouseenter', function () {
            v.play();
        })
        v.addEventListener('mouseleave', function () {
            v.load();
        })
    })
}
// axios库调用
function axLoad(a, p, s, vl) {
    axios({
        url: a,
        method: 'get',
        params: {
            page: p,
            size: s,
        }
    }).then(function (res) {
        let data = res.data.data.videos;
        data.forEach(function (v) {
            let div = document.createElement('div');
            div.className = 'videoBox'
            div.innerHTML = `
                        <div><video src="${v.playUrl}" width="100%" height="160px" poster="${v.posterPic}" loop></video></div>
                        <img class="userPic" src="${v.userPic}" alt="">
                        <div class="text">
                            <h5 class="title">${v.title}</h5>
                            <span class="userName">${v.userName}</span>
                        </div>
                    `
            vl.appendChild(div);
        })
        videoPlay();
        isLoading = false;
    }).catch(function (error) {
        alert(error);
    })
}

// 开始加载的视频
axLoad(addUrl[0], page, size, videosList);
axLoad(addUrl[4], page, size, videosList_2);

// 按钮切换加载的视频类型
let index = 0;
btnList.forEach(function (b, i) {
    b.addEventListener('click', function () {
        if (index !== i) {
            if(isLoading)   return;
            isLoading = true;
            videosList.innerHTML = '';
            btnList[index].className = 'org';
            index = i;
            axLoad(addUrl[i], page, size, videosList);
        }
    })

    b.addEventListener('mouseenter', function () {
        b.className = 'chg';
    })
    b.addEventListener('mouseleave', function () {
        if (i !== index)
            b.className = 'org';
    })
})

var p = page;
let zk_btn = document.querySelector('.right .see-more');
zk_btn.addEventListener('click', function () {
    if(isLoading)   return;
    isLoading = true;
    axLoad(addUrl[index], ++p, size, videosList);
})

var p = page;
window.addEventListener('scroll', function () {
    if (isLoading)  return;
    //页面总高度                        body->（scrollHeight：元素内容的总高度；offsetHeight：元素布局占用的总高度）
    var pageHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight);
    //视口高度                          clientHeight：元素可视区域的高度
    var viewHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
    //滚动的高度（距离）                 scrollTop（元素） / pageYOffset（窗口）：滚动条滚动的距离
    var scrollHeight = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (pageHeight - viewHeight - scrollHeight <= 0) {
        isLoading = true;
        axLoad(addUrl[4], ++p, size, videosList_2);
    }
})