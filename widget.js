var bubbleControl = function () {
  if (window._widgetTitle) {
    var name = window._widgetTitle;
  } else {
    var name = "Chat";
  }

  if (window._widgetColor) {
    var color = window._widgetColor;
  } else {
    var color = "#1976d2";
  }

  if (window._widgetWidth) {
    var width = window._widgetWidth;
  } else {
    var width = "170px";
  }

  var botURL = window._botURL;

  var botChatContainer =
    '<div id="_chatBubble" tabindex="0" role="button" aria-label="Open chat" style="background: ' +
    color +
    ' !important"> \
    <div class="_bubble-label" style="width: ' +
    width +
    ' !important"> \
    <span class="bot-title"> ' +
    name +
    ' </span> \
     </div> \
    </div> \
    <div id="chatWindow" class="_disable"> \
    <div id="chatWindow-header"  style="background: ' +
    color +
    ' !important"> \
    <span class="bot-title"> ' +
    ' </span> \
    <span class="chatWindow-close caret" role="button" aria-label="Close chat" id="_chatBubbleClose" tabindex="0"></span> \
    </div> \
    </div>';

  function _openChatWindow() {
    var bubble = document.getElementById("_chatBubble"),
      mainCnt = document.getElementById("chatWindow");
    bubble.style.display = "none";
    if (!document.getElementById("_botChatFrame")) {
      var botChatFrame = document.createElement("iframe");
      botChatFrame.setAttribute("id", "_botChatFrame");
      botChatFrame.setAttribute("src", botURL);
      botChatFrame.setAttribute("scrolling", "yes");
      botChatFrame.setAttribute("frameborder", "0");
      botChatFrame.style.width = "380px";
      botChatFrame.style.height = "92%";
      botChatFrame.style.overflow = "hidden";
      botChatFrame.style.padding = "0px";
      botChatFrame.style.border = "none";
      mainCnt.appendChild(botChatFrame);
    }
    mainCnt.style.display = "block";
  }

  function _closeChatWindow() {
    var bubble = document.getElementById("_chatBubble"),
      mainCnt = document.getElementById("chatWindow");
    bubble.style.display = "block";
    mainCnt.style.display = "none";
  }

  function _createElements(_chtml, callback) {
    var cBody = document.getElementsByTagName("body")[0];
    var botChatObj = document.createElement("div");

    botChatObj.innerHTML = _chtml;
    cBody.appendChild(botChatObj);
    if (callback) {
      callback();
    }
  }

  function _bindElements() {
    var _cBubble = document.getElementById("_chatBubble");
    _cBubble.onclick = function () {
      _openChatWindow();
    };
    _cBubble.onkeyup = function keyPress(e) {
      wkey = e.which ? e.which : window.event.keyCode;
      if (wkey == 13) _openChatWindow();
      if (wkey == 32) _openChatWindow();
    };
    var _cHeader = document.getElementById("chatWindow-header");
    _cHeader.onclick = function () {
      _closeChatWindow();
    };
    document.onkeyup = function keyPress(e) {
      wkey = e.which ? e.which : window.event.keyCode;
      if (wkey == 27) _closeChatWindow();
    };
    _chatBubbleClose.onkeyup = function keyPress(e) {
      wkey = e.which ? e.which : window.event.keyCode;
      if (wkey == 13) _closeChatWindow();
      if (wkey == 32) _closeChatWindow();
    };
    var _cBubble2 = document.getElementsByClassName("open-sesschat")[0];
    _cBubble2.onclick = function () {
      _openChatWindow();
    };
    _cBubble2.onkeyup = function keyPress(e) {
      wkey = e.which ? e.which : window.event.keyCode;
      if (wkey == 13) _openChatWindow();
    };
  }

  _createElements(botChatContainer, function () {
    _bindElements();
  });

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return false;
  }

  var popupOpen = getQueryVariable("popupOpen");
  if (popupOpen == true) _openChatWindow();
};

window.onload = bubbleControl;
