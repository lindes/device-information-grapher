var battery = navigator.battery || navigator.mozBattery || navigator.webkitBattery;
var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection

var batteryInfoArray = new Array();

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
    
    document.getElementById("bat_latest").innerHTML =
        "charging: " + battery.charging
        + ", level: " + battery.level
        + ", charging time: " + battery.chargingTime
        + ", discharging time: " + battery.dischargingTime;
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
