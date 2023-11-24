// //
// //  browser event id
// //
const _tab_created                  = 1
const _tab_activated                = 2
const _tab_removed                  = 3
const _web_req                      = 4

//
//  chrome.tabs (https://developer.chrome.com/docs/extensions/reference/tabs/)
//
chrome.tabs.onCreated.addListener(
    function(tab) {
        const event_id = _tab_created;
        const tab_id = tab.id;

        console.log(JSON.stringify({ event_id, tab_id}));
        
        fetch("http://localhost:19090/events/",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ event_id, tab_id})
            }
        );
    }
);

chrome.tabs.onActivated.addListener(
    function(activeInfo) {
        const event_id = _tab_activated;
        const tab_id = activeInfo.tabId;

        console.log(JSON.stringify({ event_id, tab_id}));

        fetch("http://localhost:19090/events/",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ event_id, tab_id})
            }
        );
    }
);

chrome.tabs.onRemoved.addListener(
    function(tabId, removeInfo) {
        const event_id = _tab_removed;
        const tab_id = tabId;

        console.log(JSON.stringify({ event_id, tab_id}));

        fetch("http://localhost:19090/events/",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ event_id, tab_id})
            }
        );        
    }
);


//
//  chrome.webRequest (https://developer.chrome.com/docs/extensions/reference/webRequest/)
//
chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        // 파일 업로드등은 POST, PUT 인 경우에만 발생하므로 GET 은 무시하자.
        if (details.method != "POST" && details.method != "PUT")
        {
            return {cancel: false};
        }

        // 로컬호스트로의 요청은 제외
        const dst_url = new URL(details.url);
        if (dst_url.hostname === 'localhost' || dst_url.hostname === '127.0.0.1'){
            return {cancel: false};
        }

        // details.tabId 가 유효하지 -1 인 보여지지 않는 tab 이므로 제외
        if (details.tabId <= 0)
        {
            return {cancel: false};
        }

        // 여기에 파일 업로드 패턴들을 좀 자세히 만들어서 필터링을 해야
        // monster 쪽으로 가는 요청이 줄어듬

        // console.log(
        //     '[webRequest.onBeforeSendHeaders]',
        //     'tabid=', details.tabId,            
        //     //'method=', details.method, 
        //     'url=', details.url
        //     //'header=', details.requestHeaders
        //     );
        const event_id = _web_req;
        const tab_id = details.tabId;
        const url = details.url;

        console.log(JSON.stringify({ event_id, tab_id, url }));
        
        fetch("http://localhost:19090/events/",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ event_id, tab_id, url })
            }
        );            
    }, 
    { urls: ["<all_urls>"] }, 
    ["requestHeaders"]
    );

// //
// //  chrome.webNavigation (https://developer.chrome.com/docs/extensions/reference/webNavigation/)
// //
// chrome.webNavigation.onCompleted.addListener(
//     function (details) {
//         if (details.fromCache){
//             return;
//         }

//         console.log(
//             '[webNavigation.onCompleted]',
//             'tabid =', details.tabId,             
//             'client_id =', details.processId,            
//             'url =', details.url
//             );

//         url = details.url;
//         tabId = details.tabId;
//         client_id = details.processId;

//         fetch("http://localhost:19090/webnavigation/oncompleted", 
//             {
//                 method: "POST",
//                 headers: {"Content-Type": "application/json"},
//                 body: JSON.stringify({client_id, tabId, url})
//             }
//         );
//     },
//     //{ urls: ["<all_urls>"] }
//     {url:[{schemes: ["http", "https"]}]}
// );





























// // 로컬 파일 업로드를 식별하는 함수
// function isLocalFileUpload(details) {
//     // POST 요청인지 확인
//     if (details.method !== "POST") {
//         return false;
//     }

//     // 요청 URL이 "file://"로 시작하는지 확인
//     if (details.url.startsWith("file:///")) {
//         return true;
//     }

//     // 요청 헤더를 확인하여 파일 업로드를 식별할 수도 있습니다.
//     for (const header of details.requestHeaders) {
//         if (header.name.toLowerCase() === "content-type") {
//             const contentType = header.value.toLowerCase();
//             if (contentType.includes("multipart/form-data") || contentType.includes("application/octet-stream")) {
//                 return true;
//             }
//         }
//     }

//     // 요청 본문(body)을 검사하여 파일 업로드를 식별할 수도 있습니다.
//     if (details.requestBody && details.requestBody.formData) {
//         for (const key in details.requestBody.formData) {
//             const formDataValues = details.requestBody.formData[key];
//             for (const value of formDataValues) {
//                 // 파일 업로드와 관련된 조건을 추가로 검사합니다.
//                 if (isFileUploadData(value)) {
//                     return true;
//                 }
//             }
//         }
//     }

//     // 다른 조건을 추가하여 로컬 파일 업로드를 미세하게 식별할 수 있습니다.

//     return false;
// }

// // 파일 업로드 데이터를 식별하는 함수
// function isFileUploadData(data) {
//     // 예를 들어, 파일 업로드와 관련된 특정 조건을 여기에 추가합니다.
//     // 이 함수를 사용하여 파일 업로드 관련 데이터를 검사합니다.
//     // 예: 파일 이름, 확장자, 크기 등을 검사하여 파일 업로드를 확인할 수 있습니다.
//     // 파일 업로드로 간주되는 조건을 추가합니다.
//     if (data && data.match(/\.pdf$/i)) {
//         return true;
//     }
//     // 다른 조건을 추가하여 파일 업로드를 식별할 수 있습니다.
//     return false;
// }