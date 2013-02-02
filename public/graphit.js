var hidden = document.getElementById("hideme1");
hidden.parentNode.removeChild(hidden);

var battery = navigator.battery || navigator.mozBattery || navigator.webkitBattery;
var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

var batteryInfoArray = new Array();

function updateInfo()
{
    batteryInfoArray.push([new Date(), battery.charging, battery.level, battery.chargingTime, battery.dischargingTime]);

    var data = batteryInfoArray.map(function (item) { item[2] * 100 });
    data = [99, 100, 80, 30, 10, 30, 90];

    document.getElementById("bat_latest").innerHTML =
        "charging: " + battery.charging
        + ", level: " + battery.level
        + ", charging time: " + battery.chargingTime
        + ", discharging time: " + battery.dischargingTime
        + ", log: " + batteryInfoArray;
    document.getElementById("con_latest").innerHTML =
        "bandwidth (MB/s): " + connection.bandwidth
        + ", metered: " + connection.metered;
}

document.getElementById("bat_status").innerHTML = battery ? "know about battery" : "bummer";
document.getElementById("con_status").innerHTML = connection ? "Know about connection status" : "nope";

var chart;

function updateChart() {
    var data = google.visualization.arrayToDataTable([
        ['Label', 'Value'],
        ['Battery', battery.level * 100]
    ]);

    var options = {
        width: 400, height: 120,
        redFrom: 0, redTo: 20,
        yellowFrom:20, yellowTo: 50,
        greenFrom:80, greenTo: 100,
        minorTicks: 5
    };

    chart.draw(data, options);
}

function drawChart() {
    chart = new google.visualization.Gauge(document.getElementById('battery_gauge'));
    updateChart();
}

if(battery)
{
    var hidden = document.getElementById("hideme2");
    hidden.parentNode.removeChild(hidden);

    updateInfo();
    ["chargingchange", "chargingtimechange", "dischargingtimechange", "levelchange"].forEach(
        function (event) { battery.addEventListener(event, updateChart); });

    google.load('visualization', '1', {packages:['gauge']});
    google.setOnLoadCallback(drawChart);
}
