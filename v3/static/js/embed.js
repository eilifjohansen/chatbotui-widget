if (!botcolor) {
  var botcolor = "#1976d2";
}

// SVG Icons
sendbot =
  '<svg id="sendButtonIcon" style="margin-top: -2.5px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="undefined ns-fill-0" fill="' +
  botcolor +
  '" width="25" height="25"> <path d="M3.4 20.4l17.45-7.48a1 1 0 0 0 0-1.84L3.4 3.6a.993.993 0 0 0-1.39.91L2 9.12c0 .5.37.93.87.99L17 12L2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z"/></svg>';
closebot =
  '<svg id="closeIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="undefined ns-fill-0" fill="#ffffff" width="25" height="25"> <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"/></svg>';
refreshbot =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="undefined ns-fill-0" fill="#ffffff" width="25" height="25"> <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>';
minimizebot =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 11.5 24 17" class="undefined ns-fill-0" fill="#ffffff" width="40" height="25"> <path d="M6 19h12v2H6v-2z"/></svg>';

function loadjscssfile(filename, filetype) {
  if (filetype == "js") {
    //if filename is a external JavaScript file
    var fileref = document.createElement("script");
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", filename);
  } else if (filetype == "css") {
    //if filename is an external CSS file
    var fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename);
  }
  if (typeof fileref != "undefined")
    document.getElementsByTagName("head")[0].appendChild(fileref);
}

loadjscssfile(
  "https://widget.chatbotui.com/v2/static/js/materialize.min.js",
  "js"
); //dynamically load and add this .js file
loadjscssfile("https://widget.chatbotui.com/v2/static/css/style.css", "css"); //dynamically load and add this .css file

setTimeout(() => {
  document.body.insertAdjacentHTML(
    "beforeEnd",
    '<div class="widget" tabindex="-1" id="widget"><div class="chat_header" style="background: ' +
      botcolor +
      '"><span class="chat_header_title">' +
      botname +
      '</span><span class="dropdown-trigger" href="#" data-target="dropdown1"><a href="#" id="minimize" style="padding-right: 5px; style="color: #fff" >' +
      minimizebot +
      '</a><a href="#" id="restart" style="padding-right: 2.5px; color: #fff" >' +
      refreshbot +
      '</a > <a href="#" id="close" style="color: #fff" >' +
      closebot +
      '</a > </span> <ul id="dropdown1" class="dropdown-content"> </ul> </div> <div class="chats" id="chats"> <div class="clearfix"></div> </div><div id="chat-footer"><div class="keypad"> <textarea id="userInput" placeholder="Type a message..." class="usrInput" ></textarea> <div id="sendButton" tabindex="0">' +
      sendbot +
      '</div> </div></div></div><div class="profile_div" id="profile_div" role="button" tabindex="0"><img class="imgProfile" alt="open chat" src = "' +
      botphoto +
      '" /></div >'
  );

  document.addEventListener("DOMContentLoaded", function () {
    var elemsTap = document.querySelector(".tap-target");
    var instancesTap = M.TapTarget.init(elemsTap, {});
    instancesTap.open();
    setTimeout(function () {
      instancesTap.close();
    }, 4000);
  });

  var widget = document.getElementById("profile_div");
  widget.onkeyup = function keyPress(e) {
    wkey = e.which ? e.which : window.event.keyCode;
    if (wkey == 13) hello();
    if (wkey == 32) hello();

    function hello() {
      toggleVisibility(".profile_div");
      toggleVisibility(".widget");
      document.querySelector(".widget").focus();
    }
  };

  //initialization
  ready(function () {
    //Bot pop-up intro
    document.querySelector("div").classList.remove("tap-target-origin");

    //drop down menu for close, restart conversation & clear the chats.
    // $(".dropdown-trigger").dropdown();

    //initiate the modal for displaying the charts, if you dont have charts, then you comment the below line
    // $(".modal").modal();

    //enable this if u have configured the bot to start the conversation.
    // showBotTyping();
    // $("#userInput").prop('disabled', true);

    //global variables
    action_name = "action_greet_user";
    user_id = "jitesh97";

    //if you want the bot to start the conversation
    action_trigger();
  });

  // ========================== restart conversation ========================
  function restartConversation() {
    document.getElementById("userInput").disabled = true;
    //destroy the existing chart
    if (document.querySelector(".collapsible"))
      document.querySelector(".collapsible").remove();

    if (typeof chatChart !== "undefined") {
      chatChart.destroy();
    }

    if (document.querySelector(".chart-container"))
      document.querySelector(".chart-container").remove();

    if (typeof modalChart !== "undefined") {
      modalChart.destroy();
    }
    document.querySelector(".chats").innerHTML = "";
    document.querySelector(".usrInput").value = "";
    send("/restart");
  }

  // ========================== let the bot start the conversation ========================
  function action_trigger() {
    // send an event to the bot, so that bot can start the conversation by greeting the user

    fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: action_name,
        policy: "MappingPolicy",
        confidence: "0.98",
      }),
    })
      .then(function (r) {
        console.log("Response from Rasa");
        console.log("Status: ", r.status);
        return r.json();
      })
      .then(function (botResponse) {
        console.log("Response: ", botResponse);

        setBotResponse(botResponse);

        if (botResponse.hasOwnProperty("messages")) {
          setBotResponse(botResponse.messages);
        }
        document.querySelector("#userInput").disabled = false;
      })
      .catch(function (error) {
        setBotResponse("");
        console.log("Error from bot end: ", error);
        document.querySelector("#userInput").disabled = false;
      });
  }

  //=====================================	user enter or sends the message =====================
  document.querySelector(".usrInput").addEventListener("keyup", onSendMessage);
  document
    .querySelector(".usrInput")
    .addEventListener("keypress", onSendMessage);
  function onSendMessage(e) {
    var keyCode = e.keyCode || e.which;

    var text = document.querySelector(".usrInput").value;
    if (keyCode === 13) {
      if (text == "" || text.trim() == "") {
        e.preventDefault();
        return false;
      } else {
        //destroy the existing chart, if yu are not using charts, then comment the below lines
        if (document.querySelector(".collapsible"))
          document.querySelector(".collapsible").remove();

        if (typeof chatChart !== "undefined") {
          chatChart.destroy();
        }

        if (document.querySelector(".chart-container"))
          document.querySelector(".chart-container").remove();

        if (typeof modalChart !== "undefined") {
          modalChart.destroy();
        }

        if (document.querySelector("#paginated_cards"))
          document.querySelector("#paginated_cards").remove();
        if (document.querySelector(".suggestions"))
          document.querySelector(".suggestions").remove();
        if (document.querySelector(".quickReplies"))
          document.querySelector(".quickReplies").remove();

        document.querySelector(".usrInput").blur();
        setUserResponse(text);
        send(text);
        e.preventDefault();
        return false;
      }
    }
  }

  var sendButton = document.getElementById("sendButton");
  sendButton.onkeyup = function keyPress(e) {
    wkey = e.which ? e.which : window.event.keyCode;
    if (wkey == 13) pressSend();
    if (wkey == 32) pressSend();

    function pressSend() {
      var text = document.querySelector(".usrInput").value;
      if (text == "" || text.trim() == "") {
        e.preventDefault();
        return false;
      } else {
        //destroy the existing chart

        /* chatChart.destroy();
      $(".chart-container").remove();
      if (typeof modalChart !== "undefined") {
        modalChart.destroy();
      }*/

        if (document.querySelector("#paginated_cards"))
          document.querySelector("#paginated_cards").remove();
        if (document.querySelector(".suggestions"))
          document.querySelector(".suggestions").remove();
        if (document.querySelector(".quickReplies"))
          document.querySelector(".quickReplies").remove();

        document.querySelector(".usrInput").blur();
        setUserResponse(text);
        send(text);
        e.preventDefault();
        return false;
      }
    }
  };

  //Send message function to send message the conversation.
  addEventListenerById("click", "sendButtonIcon", function (e) {
    var text = document.querySelector(".usrInput").value;
    if (text == "" || text.trim() == "") {
      e.preventDefault();
      return false;
    } else {
      //destroy the existing chart

      /* chatChart.destroy();
      $(".chart-container").remove();
      if (typeof modalChart !== "undefined") {
        modalChart.destroy();
      }*/

      if (document.querySelector("#paginated_cards"))
        document.querySelector("#paginated_cards").remove();
      if (document.querySelector(".suggestions"))
        document.querySelector(".suggestions").remove();
      if (document.querySelector(".quickReplies"))
        document.querySelector(".quickReplies").remove();

      document.querySelector(".usrInput").blur();
      setUserResponse(text);
      send(text);
      e.preventDefault();
      return false;
    }
  });

  //==================================== Set user response =====================================
  /*    
  Removed from User response
  '<img class="userAvatar" src=' +
      "./static/img/userAvatar.jpg" +
      '>
  */
  function setUserResponse(message) {
    var UserResponse = document.createElement("p");
    UserResponse.classList.add("userMsg");
    UserResponse.style.background = botcolor;
    UserResponse.innerText = message;

    document.querySelector(".chats").appendChild(UserResponse);
    document.querySelector(".chats").innerHTML +=
      '<div class="clearfix"></div>';
    // fadeElIn("")

    document.querySelector(".usrInput").value = "";
    scrollToBottomOfResults();
    showBotTyping();
    if (document.querySelector(".suggestions"))
      document.querySelector(".suggestions").remove();
  }

  //=========== Scroll to the bottom of the chats after new message has been added to chat ======
  function scrollToBottomOfResults() {
    var terminalResultsDiv = document.getElementById("chats");
    terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
  }

  //============== send the user message to rasa server =============================================
  function send(message) {
    fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: message, sender: user_id }),
    })
      .then(function (r) {
        console.log("Response from Rasa");
        console.log("Status: ", r.status);
        return r.json();
      })
      .then(function (botResponse) {
        console.log("Response: ", botResponse);
        // if user wants to restart the chat and clear the existing chat contents
        if (message.toLowerCase() == "/restart") {
          document.querySelector("#userInput").disabled = false;

          //if you want the bot to start the conversation after restart
          action_trigger();
          return;
        }
        setBotResponse(botResponse);
      })
      .catch(function (error) {
        if (message.toLowerCase() == "/restart") {
          // $("#userInput").prop('disabled', false);
          //if you want the bot to start the conversation after the restart action.
          // action_trigger();
          // return;
        }

        // if there is no response from rasa server
        console.log("Error from bot end: ", error);
        setBotResponse("");
      });
  }

  //=================== set bot response in the chats ===========================================
  function setBotResponse(response) {
    //display bot response after 500 milliseconds
    setTimeout(function () {
      hideBotTyping();
      if (response.length < 1) {
        //if there is no response from Rasa, send  fallback message to the user
        var fallbackMsg = "I am facing some issues, please try again later!!!";

        var BotResponse =
          '<img class="botAvatar" src="' +
          botphoto +
          '"/><p class="botMsg">' +
          fallbackMsg +
          '</p><div class="clearfix"></div>';

        document.querySelector(".chats").innerHTML += BotResponse;
      } else {
        //if we get response from Rasa
        for (i = 0; i < response.length; i++) {
          //check if the response contains "text"
          if (response[i].hasOwnProperty("text")) {
            var BotResponse =
              '<img class="botAvatar" alt="" role=”presentation” src="' +
              botphoto +
              '"/><p tabindex="0" aria-live="polite" class="botMsg">' +
              response[i].text +
              '</p><div class="clearfix"></div>';
            document.querySelector(".chats").innerHTML += BotResponse;
          }

          //check if the response contains "images"
          if (response[i].hasOwnProperty("image")) {
            var BotResponse =
              '<div class="singleCard">' +
              '<img class="imgcard" src="' +
              response[i].image +
              '">' +
              '</div><div class="clearfix">';
            document.querySelector(".chats").innerHTML += BotResponse;
          }

          //check if the response contains "buttons"
          if (response[i].hasOwnProperty("buttons")) {
            addSuggestion(response[i].buttons);
          }

          //check if the response contains "attachment"
          if (response[i].hasOwnProperty("attachment")) {
            //check if the attachment type is "video"
            if (response[i].attachment.type == "video") {
              video_url = response[i].attachment.payload.src;

              var BotResponse =
                '<div class="video-container"> <iframe src="' +
                video_url +
                '" frameborder="0" allowfullscreen></iframe> </div>';
              document.querySelector(".chats").innerHTML += BotResponse;
            }
          }
          //check if the response contains "custom" message
          if (response[i].hasOwnProperty("custom")) {
            //check if the custom payload type is "quickReplies"
            if (response[i].custom.payload == "quickReplies") {
              quickRepliesData = response[i].custom.data;
              showQuickReplies(quickRepliesData);
              return;
            }

            //check if the custom payload type is "pdf_attachment"
            if (response[i].custom.payload == "pdf_attachment") {
              renderPdfAttachment(response[i]);
              return;
            }

            //check if the custom payload type is "dropDown"
            if (response[i].custom.payload == "dropDown") {
              dropDownData = response[i].custom.data;
              renderDropDwon(dropDownData);
              return;
            }

            //check if the custom payload type is "location"
            if (response[i].custom.payload == "location") {
              document.querySelector("#userInput").disabled = true;
              getLocation();
              scrollToBottomOfResults();
              return;
            }

            //check if the custom payload type is "cardsCarousel"
            if (response[i].custom.payload == "cardsCarousel") {
              restaurantsData = response[i].custom.data;
              showCardsCarousel(restaurantsData);
              return;
            }

            //check if the custom payload type is "chart"
            if (response[i].custom.payload == "chart") {
              // sample format of the charts data:
              // var chartData = { "title": "Leaves", "labels": ["Sick Leave", "Casual Leave", "Earned Leave", "Flexi Leave"], "backgroundColor": ["#36a2eb", "#ffcd56", "#ff6384", "#009688", "#c45850"], "chartsData": [5, 10, 22, 3], "chartType": "pie", "displayLegend": "true" }

              //store the below parameters as global variable,
              // so that it can be used while displaying the charts in modal.
              chartData = response[i].custom.data;
              title = chartData.title;
              labels = chartData.labels;
              backgroundColor = chartData.backgroundColor;
              chartsData = chartData.chartsData;
              chartType = chartData.chartType;
              displayLegend = chartData.displayLegend;

              // pass the above variable to createChart function
              createChart(
                title,
                labels,
                backgroundColor,
                chartsData,
                chartType,
                displayLegend
              );
              return;
            }

            //check of the custom payload type is "collapsible"
            if (response[i].custom.payload == "collapsible") {
              data = response[i].custom.data;
              //pass the data variable to createCollapsible function
              createCollapsible(data);
            }
          }
        }
        scrollToBottomOfResults();
      }
    }, 500);
  }

  //====================================== Toggle chatbot =======================================
  document.querySelector("#profile_div").addEventListener("click", function () {
    toggleVisibility(".widget");
    toggleVisibility(".profile_div");
  });

  //====================================== Render Pdf attachment =======================================
  function renderPdfAttachment(data) {
    pdf_url = data.custom.url;
    pdf_title = data.custom.title;
    pdf_attachment =
      '<div class="pdf_attachment">' +
      '<div class="row">' +
      '<div class="col s3 pdf_icon"><i class="fa fa-file-pdf-o" aria-hidden="true"></i></div>' +
      '<div class="col s9 pdf_link">' +
      '<a href="' +
      pdf_url +
      '" target="_blank">' +
      pdf_title +
      " </a>" +
      "</div>" +
      "</div>" +
      "</div>";
    document.querySelector(".chats").innerHTML += pdf_attachment;
    scrollToBottomOfResults();
  }

  //====================================== DropDown ==================================================
  //render the dropdown messageand handle user selection
  function renderDropDwon(data) {
    var options = "";
    for (i = 0; i < data.length; i++) {
      options +=
        '<option value="' + data[i].value + '">' + data[i].label + "</option>";
    }
    var select =
      '<div class="dropDownMsg"><select class="browser-default dropDownSelect"> <option value="" disabled selected>Choose your option</option>' +
      options +
      "</select></div>";
    document.querySelector(".chats").innerHTML += select;
    scrollToBottomOfResults();

    //add event handler if user selects a option.
    document.querySelector("select").addEventListener("change", function () {
      var value = "";
      var label = "";
      document
        .querySelectorAll("select option:selected")
        .forEach(function (element) {
          label += element.innerText;
          value += element.value;
        });

      setUserResponse(label);
      send(value);
      if (document.querySelector(".dropDownMsg"))
        document.querySelector(".dropDownMsg").remove();
    });
  }

  //====================================== Suggestions ===========================================

  function addSuggestion(textToAdd) {
    setTimeout(function () {
      var suggestions = textToAdd;
      var suggLength = textToAdd.length;

      document.querySelector(".chats").innerHTML +=
        ' <div class="singleCard"> <div class="suggestions"><div class="menu"></div></div></diV>';
      // Loop through suggestions
      for (i = 0; i < suggLength; i++) {
        document.querySelector(".menu").innerHTML +=
          '<div class="menuChips" data-payload=\'' +
          suggestions[i].payload +
          "'>" +
          suggestions[i].title +
          "</div>";
      }
      scrollToBottomOfResults();
    }, 1000);
  }

  // on click of suggestions, get the value and send to rasa
  addEventListenerByClass("click", "menuChips", function (e) {
    var text = e.target.innerText;
    var payload = e.target.getAttribute("data-payload");
    console.log("payload: ", e.target.getAttribute("data-payload"));
    setUserResponse(text);
    send(payload);

    //delete the suggestions once user click on it
    if (document.querySelector(".suggestions"))
      document.querySelector(".suggestions").remove();
  });

  //====================================== functions for drop-down menu of the bot  =========================================

  //restart function to restart the conversation.
  document.querySelector("#restart").addEventListener("click", function () {
    restartConversation();
  });

  var restartchataction = document.getElementById("restart");
  restartchataction.onkeyup = function keyPress(e) {
    wkey = e.which ? e.which : window.event.keyCode;
    if (wkey == 13) restartchataction();
    if (wkey == 32) restartchataction();

    function restartchataction() {
      restartConversation();
      document.querySelector(".widget").focus();
    }
  };

  //clear function to clear the chat contents of the widget.
  if (document.querySelector("#clear")) {
    document.querySelector("#clear").addEventListener("click", function () {
      document.querySelector(".chats").innerHTML = "";
    });
  }

  //close function to close the widget.
  addEventListenerById("click", "closeIcon", function () {
    toggleVisibility(".widget");
    toggleVisibility(".profile_div");
    scrollToBottomOfResults();
  });

  var closechataction = document.getElementById("close");
  closechataction.onkeyup = function keyPress(e) {
    wkey = e.which ? e.which : window.event.keyCode;
    if (wkey == 13) closechataction();
    if (wkey == 32) closechataction();

    function closechataction() {
      toggleVisibility(".widget");
      toggleVisibility(".profile_div");
      scrollToBottomOfResults();
    }
  };

  //minimize function to minimize the widget.
  document.querySelector("#minimize").addEventListener("click", function () {
    toggleVisibility(".widget");
    toggleVisibility(".profile_div");
    scrollToBottomOfResults();
  });

  var minimizechataction = document.getElementById("minimize");
  minimizechataction.onkeyup = function keyPress(e) {
    wkey = e.which ? e.which : window.event.keyCode;
    if (wkey == 13) minimizechataction();
    if (wkey == 32) minimizechataction();

    function minimizechataction() {
      toggleVisibility(".widget");
      toggleVisibility(".profile_div");
      scrollToBottomOfResults();
    }
  };

  //====================================== Cards Carousel =========================================

  function showCardsCarousel(cardsToAdd) {
    var cards = createCardsCarousel(cardsToAdd);

    document.querySelector(".chats").innerHTML += cards;

    // if (cardsToAdd.length <= 2) {
    //   $(".cards_scroller>div.carousel_cards:nth-of-type(" + i + ")").fadeIn(
    //     3000
    //   );
    // } else {
    //   for (var i = 0; i < cardsToAdd.length; i++) {
    //     $(".cards_scroller>div.carousel_cards:nth-of-type(" + i + ")").fadeIn(
    //       3000
    //     );
    //   }
    //   $(".cards .arrow.prev").fadeIn("3000");
    //   $(".cards .arrow.next").fadeIn("3000");
    // }

    scrollToBottomOfResults();

    const card = document.querySelector("#paginated_cards");
    const card_scroller = card.querySelector(".cards_scroller");
    var card_item_size = 225;

    card
      .querySelector(".arrow.next")
      .addEventListener("click", scrollToNextPage);
    card
      .querySelector(".arrow.prev")
      .addEventListener("click", scrollToPrevPage);

    // For paginated scrolling, simply scroll the card one item in the given
    // direction and let css scroll snaping handle the specific alignment.
    function scrollToNextPage() {
      card_scroller.scrollBy(card_item_size, 0);
    }

    function scrollToPrevPage() {
      card_scroller.scrollBy(-card_item_size, 0);
    }
  }

  function createCardsCarousel(cardsData) {
    var cards = "";

    for (i = 0; i < cardsData.length; i++) {
      title = cardsData[i].name;
      ratings = Math.round((cardsData[i].ratings / 5) * 100) + "%";
      data = cardsData[i];
      item =
        '<div class="carousel_cards in-left">' +
        '<img class="cardBackgroundImage" src="' +
        cardsData[i].image +
        '"><div class="cardFooter">' +
        '<span class="cardTitle" title="' +
        title +
        '">' +
        title +
        "</span> " +
        '<div class="cardDescription">' +
        '<div class="stars-outer">' +
        '<div class="stars-inner" style="width:' +
        ratings +
        '" ></div>' +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>";

      cards += item;
    }

    var cardContents =
      '<div id="paginated_cards" class="cards"> <div class="cards_scroller">' +
      cards +
      '  <span class="arrow prev fa fa-chevron-circle-left "></span> <span class="arrow next fa fa-chevron-circle-right" ></span> </div> </div>';

    return cardContents;
  }

  //====================================== Quick Replies ==================================================

  function showQuickReplies(quickRepliesData) {
    var chips = "";
    for (i = 0; i < quickRepliesData.length; i++) {
      var chip =
        '<div class="chip" data-payload=\'' +
        quickRepliesData[i].payload +
        "'>" +
        quickRepliesData[i].title +
        "</div>";
      chips += chip;
    }

    var quickReplies =
      '<div class="quickReplies">' +
      chips +
      '</div><div class="clearfix"></div>';
    document.querySelector(".chats").innerHTML += quickReplies;
    scrollToBottomOfResults();
    const slider = document.querySelector(".quickReplies");
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener("mousedown", (e) => {
      isDown = true;
      slider.classList.add("active");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener("mouseleave", () => {
      isDown = false;
      slider.classList.remove("active");
    });
    slider.addEventListener("mouseup", () => {
      isDown = false;
      slider.classList.remove("active");
    });
    slider.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 3; //scroll-fast
      slider.scrollLeft = scrollLeft - walk;
    });
  }

  // on click of quickreplies, get the value and send to rasa
  addEventListenerByClass("click", "chip", function (e) {
    var text = e.target.innerText;
    var payload = e.target.getAttribute("data-payload");
    console.log("chip payload: ", e.target.getAttribute("data-payload"));
    setUserResponse(text);
    send(payload);

    //delete the quickreplies
    if (document.querySelector(".quickReplies"))
      document.querySelector(".quickReplies").remove();
  });

  //====================================== Get User Location ==================================================
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        getUserPosition,
        handleLocationAccessError
      );
    } else {
      response = "Geolocation is not supported by this browser.";
    }
  }

  function getUserPosition(position) {
    response =
      "Latitude: " +
      position.coords.latitude +
      " Longitude: " +
      position.coords.longitude;
    console.log("location: ", response);

    //here you add the intent which you want to trigger
    response =
      '/inform{"latitude":' +
      position.coords.latitude +
      ',"longitude":' +
      position.coords.longitude +
      "}";
    document.querySelector("#userInput").disabled = false;
    send(response);
    showBotTyping();
  }

  function handleLocationAccessError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.log("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        console.log("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        console.log("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        console.log("An unknown error occurred.");
        break;
    }

    response = '/inform{"user_location":"deny"}';
    send(response);
    showBotTyping();
    document.querySelector(".usrInput").value = "";
    document.querySelector("#userInput").disabled = false;
  }

  //======================================bot typing animation ======================================
  function showBotTyping() {
    var botTyping =
      '<img class="botAvatar" id="botAvatar" src="./static/img/CoviduSmall.png"/><div class="botTyping">' +
      '<div class="bounce1"></div>' +
      '<div class="bounce2"></div>' +
      '<div class="bounce3"></div>' +
      "</div>";
    document.querySelector(".chats").innerHTML += botTyping;
    document.querySelector(".botTyping").style.display = "";
    scrollToBottomOfResults();
  }

  function hideBotTyping() {
    if (document.querySelector("#botAvatar"))
      document.querySelector("#botAvatar").remove();
    if (document.querySelector(".botTyping"))
      document.querySelector(".botTyping").remove();
  }

  //====================================== Collapsible =========================================

  // function to create collapsible,
  // for more info refer:https://materializecss.com/collapsible.html
  function createCollapsible(data) {
    //sample data format:
    //var data=[{"title":"abc","description":"xyz"},{"title":"pqr","description":"jkl"}]
    list = "";
    for (i = 0; i < data.length; i++) {
      item =
        "<li>" +
        '<div class="collapsible-header">' +
        data[i].title +
        "</div>" +
        '<div class="collapsible-body"><span>' +
        data[i].description +
        "</span></div>" +
        "</li>";
      list += item;
    }
    var contents = '<ul class="collapsible">' + list + "</uL>";
    document.querySelector(".chats").innerHTML += contents;

    // initialize the collapsible
    // $(".collapsible").collapsible();
    scrollToBottomOfResults();
  }

  //====================================== creating Charts ======================================

  //function to create the charts & render it to the canvas
  function createChart(
    title,
    labels,
    backgroundColor,
    chartsData,
    chartType,
    displayLegend
  ) {
    //create the ".chart-container" div that will render the charts in canvas as required by charts.js,
    // for more info. refer: https://www.chartjs.org/docs/latest/getting-started/usage.html
    var html =
      '<div class="chart-container"> <span class="modal-trigger" id="expand" title="expand" href="#modal1"><i class="fa fa-external-link" aria-hidden="true"></i></span> <canvas id="chat-chart" ></canvas> </div> <div class="clearfix"></div>';
    document.querySelector(".chats").innerHTML += html;

    //create the context that will draw the charts over the canvas in the ".chart-container" div
    var ctx = document.getElementById("chat-chart");

    // Once you have the element or context, instantiate the chart-type by passing the configuration,
    //for more info. refer: https://www.chartjs.org/docs/latest/configuration/
    var data = {
      labels: labels,
      datasets: [
        {
          label: title,
          backgroundColor: backgroundColor,
          data: chartsData,
          fill: false,
        },
      ],
    };
    var options = {
      title: {
        display: true,
        text: title,
      },
      layout: {
        padding: {
          left: 5,
          right: 0,
          top: 0,
          bottom: 0,
        },
      },
      legend: {
        display: displayLegend,
        position: "right",
        labels: {
          boxWidth: 5,
          fontSize: 10,
        },
      },
    };

    //draw the chart by passing the configuration
    chatChart = new Chart(ctx, {
      type: chartType,
      data: data,
      options: options,
    });

    scrollToBottomOfResults();
  }

  // on click of expand button, get the chart data from gloabl variable & render it to modal
  addEventListenerById("click", "expand", function () {
    //the parameters are declared gloabally while we get the charts data from rasa.
    createChartinModal(
      title,
      labels,
      backgroundColor,
      chartsData,
      chartType,
      displayLegend
    );
  });

  //function to render the charts in the modal
  function createChartinModal(
    title,
    labels,
    backgroundColor,
    chartsData,
    chartType,
    displayLegend
  ) {
    //if you want to display the charts in modal, make sure you have configured the modal in index.html
    //create the context that will draw the charts over the canvas in the "#modal-chart" div of the modal
    var ctx = document.getElementById("modal-chart");

    // Once you have the element or context, instantiate the chart-type by passing the configuration,
    //for more info. refer: https://www.chartjs.org/docs/latest/configuration/
    var data = {
      labels: labels,
      datasets: [
        {
          label: title,
          backgroundColor: backgroundColor,
          data: chartsData,
          fill: false,
        },
      ],
    };
    var options = {
      title: {
        display: true,
        text: title,
      },
      layout: {
        padding: {
          left: 5,
          right: 0,
          top: 0,
          bottom: 0,
        },
      },
      legend: {
        display: displayLegend,
        position: "right",
      },
    };

    modalChart = new Chart(ctx, {
      type: chartType,
      data: data,
      options: options,
    });
  }
}, 200);

function toggleVisibility(selector) {
  let node = document.querySelector(selector);
  window.getComputedStyle(node).display == "none"
    ? (node.style.display = "block")
    : (node.style.display = "none");
}

function ready(callback) {
  document.readyState != "loading"
    ? callback()
    : document.addEventListener("DOMContentLoaded", callback);
}

Element.prototype.remove = function () {
  this.parentElement.removeChild(this);
};
NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
  for (var i = this.length - 1; i >= 0; i--) {
    if (this[i] && this[i].parentElement) {
      this[i].parentElement.removeChild(this[i]);
    }
  }
};

function addEventListenerById(event, id, callback) {
  document.addEventListener(event, function (e) {
    if (e.target && e.target.id == id) {
      callback(e);
    }
  });
}

function addEventListenerByClass(event, className, callback) {
  document.addEventListener(event, function (e) {
    if (e.target && e.target.classList.contains(className)) {
      callback(e);
    }
  });
}
