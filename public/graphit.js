function removeElement(name)
{
    var elem = document.getElementById(name);
    elem.parentNode.removeChild(elem);
}

removeElement("hideme1");

var battery = navigator.battery || navigator.mozBattery || navigator.webkitBattery;
var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

var batteryInfoArray = new Array();

var charts = {};

function updateInfo()
{
    batteryInfoArray.push([new Date(), battery.charging, battery.level * 100, battery.chargingTime, battery.dischargingTime]);

    var data = batteryInfoArray.map(function (item) { return item[2] });

    document.getElementById("bat_latest").innerHTML =
        "charging: " + battery.charging
        + ", level: " + battery.level
        + ", charging time: " + battery.chargingTime
        + ", discharging time: " + battery.dischargingTime
        + ", log: " + batteryInfoArray
        + ", data: " + data;
    document.getElementById("con_latest").innerHTML =
        "bandwidth (MB/s): " + connection.bandwidth
        + ", metered: " + connection.metered;
    if(google.visualization) { updateCharts(); } // only if initialized
}

document.getElementById("bat_status").innerHTML = battery ? "know about battery" : "bummer";
document.getElementById("con_status").innerHTML = connection ? "Know about connection status" : "nope";

function updateCharts() {
    var gauge_data = google.visualization.arrayToDataTable([
        ['Label', 'Value'],
        ['Battery', battery.level * 100]
    ]);

    var gauge_options = {
        width: 200, height: 120,
        redFrom: 0, redTo: 20,
        yellowFrom:20, yellowTo: 50,
        greenFrom:80, greenTo: 100,
        minorTicks: 5
    };

    charts['batt_gauge'].draw(gauge_data, gauge_options);

    var batt_line_data = new google.visualization.DataTable();
    batt_line_data.addColumn('datetime', 'When');
    batt_line_data.addColumn('number', 'Level (%)');
    batt_line_data.addColumn('number', 'Charge Time (minutes)');
    batt_line_data.addColumn('number', 'Discharge Time');

    batt_line_data.addRows(batteryInfoArray.map(function (item) {
        return [item[0], item[2], item[3] / 60.0, item[4] / 60.0]
    }));

    // var battLineDataView = new google.visualization.DataView(batt_line_data);
    // battLineDataView.setColumns([{calc: function(data, row) { return data.getFormattedValue(row, 0); }, type:'string'}, 1]);

    var batt_line_options = {
        title: "Battery over time",
        width: 500,
        height: 300,
        pointSize: 5,
    };

    charts['batt_line'].draw(batt_line_data, batt_line_options);
}

function drawCharts() {
    charts['batt_gauge'] = new google.visualization.Gauge(document.getElementById('battery_gauge'));
    charts['batt_line'] = new google.visualization.LineChart(document.getElementById('battery_line'));
    updateCharts();
}

if(battery)
{
    removeElement("hideme2");

    google.load('visualization', '1', {packages:['corechart', 'gauge']});
    google.setOnLoadCallback(drawCharts);

    updateInfo();
    ["chargingchange", "chargingtimechange", "dischargingtimechange", "levelchange"].forEach(
        function (event) { battery.addEventListener(event, updateInfo); });
}
