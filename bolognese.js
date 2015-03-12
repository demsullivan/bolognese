$(function() {
    var timeLeft      = null,
        counting      = false,
        timer         = null,
        currentTimer  = 0;

    var timers = [
        {name: "Work",       length: 50*60, completeText: "Time for a break!"},
        {name: "Break",      length: 10*60, completeText: "Get back to work!"},
        {name: "Work",       length: 50*60, completeText: "Time for a break!"},
        {name: "Long Break", length: 15*60, completeText: "Get back to work!"}
    ];

    var ding = new Audio("ding.wav");

    init();

    function init() {

        $('#toggle')      .on('click', toggleTimer);
        $('#reset')       .on('click', setTimer);
        $('#enableNotify').on('click', enableNotifications);
        $('#nextTimer')   .on('click', nextTimer);

        setTimer();
        updateDisplay();

    }

    function padDigits(number, digits) {

        return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;

    }


    function updateDisplay() {

        var hours = timeLeft.hours();
        var minutes = timeLeft.minutes(); // - (hours*60);
        var seconds = timeLeft.seconds(); // - (timeLeft.minutes()*60);

        var displayText = padDigits(hours, 2)+":"+padDigits(minutes, 2)+":"+padDigits(seconds, 2);
        
        $('#timerName').text(timers[currentTimer].name);
        $('#timer').text(displayText);
        document.title = timers[currentTimer].name + ": " + displayText + " - Bolognese";

    }         


    function tick() {

        timeLeft.subtract(1, 's');

        updateDisplay();

        if (timeLeft.asSeconds() === 0) {

            ding.play();

            if (Notification.permission === "granted") {
                var notification = new Notification("Bolognese", {
                    icon: '/tomato-icon.png',
                    body: timers[currentTimer].completeText
                });
            } else {
                window.alert(timers[currentTimer].completeText);
            }

            nextTimer();

        }

        if (counting) {
            timer = setTimeout(tick, 1000);
        }

    }

    function toggleTimer() {

        if (counting) {
            clearTimeout(timer);
            $(this).text("Start");
            counting = false;
        } else {
            $(this).text("Pause");
            timer = setTimeout(tick, 1000);
            counting = true;
        }

    }

    function setTimer() {

        if (currentTimer === timers.length) {
            currentTimer = 0;
        }

        timeLeft = moment.duration(timers[currentTimer].length, 's');

        updateDisplay();

    }

    function nextTimer() {

        currentTimer += 1;
        setTimer();

    }

  function enableNotifications() {
      if ((Notification) && (Notification.permission !== "granted")) {
          Notification.requestPermission(function(status) {
              if (Notification.permission !== status) {
                  Notification.permission = status;
              }

              var n = new Notification("test");
              console.dir(n);
              console.debug(status);
          });
      }
  }

 });
