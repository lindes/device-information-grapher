var battery = navigator.battery || navigator.mozBattery || navigator.webkitBattery;
var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection

var batteryInfoArray = new Array();

var battery_bullet = new Ico.BulletGraph( "battery-bullet", 0,
                         { min: 0, max: 100, target: 25,
                           graph_background: { key_values: [50, 75], key_colors: ['#f88','#ff8','#8f8'], colors_transition: 30 }
                         }
                       );


function updateGraphs() {
    new Ico.BulletGraph( "bulletgraph0", 85,
                         { min: 0, max: 100, target: 65,
                           graph_background: { key_values: [50, 75], key_colors: ['#555','#999','#ddd'], colors_transition: 10 }
                         }
                       );
    new Ico.BarGraph("graph0", [2, 5, 3, 8, 7],
                     { labels: {
                         values: ['foo', 'bar', 'baz', 'xyzzy', 'flam'],
                         angle: -30
                     }
                       , font: { 'font-family': 'Arial', 'font-size': 15, 'fill' : 'black', stroke: 'none' }
                       , color: '#ccccff'
                       , background: { attributes: { stroke: 'none', gradient: '0-#ccf:20-#aaa' } }
                       , meanline: true
                       , grid : true
                       , mouse_pointer: true
                       , status_bar : true
                     });
}

function updateInfo()
{
    batteryInfoArray.push([new Date(), battery.charging, battery.level, battery.chargingTime, battery.dischargingTime]);

    var data = batteryInfoArray.map(function (item) { item[2] * 100 });
    data = [99, 100, 80, 30, 10, 30, 90];

    battery_bullet.data_samples =  battery.level * 100;


    new Ico.SparkLine("battery-sparkline", data, { highlight: true } );

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

updateGraphs();

if(battery)
{
    updateInfo();
    ["chargingchange", "chargingtimechange", "dischargingtimechange", "levelchange"].forEach(
        function (event) { battery.addEventListener(event, updateInfo); });
}
