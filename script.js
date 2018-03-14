var Elevator = (function(window, document) {
  'use strict';

  var self = {},
    randomMinFloor = 5,
    randomMaxFloor = 20,
    buildings = [];

  self.init = function(numberOfTest) {
    while (numberOfTest > 0) {
      var floorMax = getRandomFloor(),
        resistance = getResistance(floorMax);
      var building = {
        floorMax: floorMax,
        resistance: resistance,
        numberOfTest: 0,
        tests: {
          failed: [],
          success: []
        }
      };

      buildings.push(building);
      self.testOneBuilding(building);
      numberOfTest -= 1;
      constructTable(buildings.length, floorMax, resistance, building.numberOfTest);
    }

    var average = document.getElementById('average'),
    span = average.querySelector('span');
    span.innerHTML = self.average();
  };

  self.getResult = function() {
    return JSON.stringify(buildings);
  };

  self.average = function() {
    var index = 0,
    length = buildings.length,
    sum = 0;

    for(; index < length; index++) {
      sum += buildings[index].numberOfTest;
    }

    return sum / length;
  };

  var constructTable = function(index, floorMax, resistance, numberOfTest) {
    var table = document.querySelector('table'),
    tbody = table.querySelector('tbody');
    var tr = document.createElement('tr');

    var td = document.createElement('td');
    td.innerHTML = floorMax;
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = resistance;
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = numberOfTest;
    tr.appendChild(td);
    tbody.appendChild(tr);

  };

  self.testOneBuilding = function(building) {
    var lastTest,
      failed,
      lastTestSuccess,
      lastTestFailed,
      findResistance = false,
      firstTest = true,
      middle,
      find = false,
      numberOfTest = 0;

    while (!find) {
      numberOfTest += 1;
      if (firstTest) {
        firstTest = !firstTest;
        middle = Math.round(building.floorMax / 2);

        if (middle > building.resistance) {
          building.tests.failed.push(middle);
          failed = true;
        } else {
          building.tests.success.push(middle);
          failed = false;
        }
      } else {
        if (failed) {
          lastTest = building.tests.failed[building.tests.failed.length - 1];
          middle = Math.round(lastTest / 2);
        } else {
          lastTestSuccess = building.tests.success[building.tests.success.length - 1];
          if (!building.tests.failed.length) {
            lastTestFailed = building.floorMax;
          } else {
            lastTestFailed = building.tests.failed[building.tests.failed.length - 1];
          }

          var max = lastTestSuccess > lastTestFailed ? lastTestSuccess : lastTestFailed;
          var min = lastTestSuccess < lastTestFailed ? lastTestSuccess + 1 : lastTestFailed + 1;
          middle = Math.floor(Math.random() * (max - min) + min);
        }

        if (middle > building.resistance) {
          building.tests.failed.push(middle);
          failed = true;
        } else {
          building.tests.success.push(middle);
          failed = false;
          var found = building.tests.failed.find(function(element) {
            return element == middle + 1;
          });

          if (found) {
            find = true;
            building.verifResistance = middle;
            break;
            console.log(find, middle);
          }

        }
      }
    }
    building.numberOfTest = numberOfTest;
  };

  var getRandomFloor = function() {
    return Math.floor(Math.random() * (randomMaxFloor - randomMinFloor + 1)) + randomMinFloor;
  };

  var getResistance = function(max) {
    return Math.floor(Math.random() * Math.floor(max));
  };

  return self;

}(window, document));

Elevator.init(10);
//Elevator.testOneBuilding();
